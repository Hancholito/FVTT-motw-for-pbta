// Infobulle de description au survol des manœuvres (fiche de personnage).
const DELAY = 300; // ms avant l'apparition
let tip = null;
let timer = null;

function hideTip() {
  clearTimeout(timer);
  timer = null;
  if (tip) { tip.remove(); tip = null; }
}

function placeTip(row) {
  const r = row.getBoundingClientRect();
  const w = tip.offsetWidth, h = tip.offsetHeight;
  const vw = window.innerWidth, vh = window.innerHeight;
  let left = Math.min(Math.max(8, r.left + 40), vw - w - 8);
  let top = r.bottom + 6;
  if (top + h > vh - 8) top = Math.max(8, r.top - h - 6);
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function showTip(row) {
  hideTip();
  const desc = row.querySelector('.item-description');
  if (!desc || !desc.textContent.trim()) return;
  const name = row.querySelector('.item-label')?.childNodes[0]?.textContent?.trim() ?? '';
  tip = document.createElement('div');
  tip.className = 'motw-tooltip';
  const title = document.createElement('div');
  title.className = 'motw-tt-title';
  title.textContent = name;
  tip.append(title);
  for (const child of desc.children) tip.append(child.cloneNode(true));
  document.body.append(tip);
  placeTip(row);
  requestAnimationFrame(() => tip?.classList.add('visible'));
}

function bind(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root || !root.querySelectorAll) return;
  for (const row of root.querySelectorAll('.tab.moves .items-list > li.item')) {
    row.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      timer = setTimeout(() => showTip(row), DELAY);
    });
    row.addEventListener('mouseleave', hideTip);
    row.addEventListener('mousedown', hideTip);
  }
}

export function registerMoveTooltips() {
  Hooks.on('renderActorSheet', bind);
  Hooks.on('renderPbtaActorSheet', bind);
  Hooks.on('closeActorSheet', hideTip);
  document.addEventListener('wheel', hideTip, { passive: true, capture: true });
}
