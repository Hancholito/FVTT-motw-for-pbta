// Apparence cliquable : les choix du livret (Apparence) sont proposés dans l'onglet Description
// de la fiche et reportés dans le champ « Look » du personnage.
import { openImprovements } from './motw-sheet-levelup.mjs';
const MOD = 'motw-for-pbta-en';
const cache = new Map();

function sectionList(doc, re) {
  const h = [...doc.querySelectorAll('h1,h2,h3,h4')].find((e) => re.test(e.textContent));
  let ul = h?.nextElementSibling;
  while (ul && ul.tagName !== 'UL') ul = ul.nextElementSibling;
  return ul ? [...ul.querySelectorAll(':scope > li')] : [];
}

const STAT_KEYS = { charm: 'charm', cool: 'cool', sharp: 'sharp', tough: 'tough', weird: 'weird' };
function parseStats(line) {
  const out = {};
  for (const m of line.matchAll(/(Charm|Cool|Sharp|Tough|Weird)\s*([+\-–−=]{0,2})\s*(\d)/gi)) {
    const n = Number(m[3]);
    out[STAT_KEYS[m[1].toLowerCase()]] = /[\-–−]/.test(m[2]) ? -n : n;
  }
  return Object.keys(out).length === 5 ? out : null;
}

async function loadSections(uuid) {
  if (!uuid) return null;
  if (cache.has(uuid)) return cache.get(uuid);
  let res = { look: [], stats: [], history: [] };
  try {
    const pb = await fromUuid(uuid);
    const doc = new DOMParser().parseFromString(pb?.system?.description ?? '', 'text/html');
    const clean = (li) => li.textContent.replace(/\s+/g, ' ').trim();
    res.look = sectionList(doc, /^\s*Look\s*$/i).map((li) =>
      clean(li).replace(/[.,]+$/, '').split(',').map((x) => x.trim()).filter(Boolean)).filter((g) => g.length);
    res.stats = sectionList(doc, /^\s*Ratings\s*$/i).map((li) => ({ label: clean(li).replace(/\.$/, ''), values: parseStats(clean(li)) })).filter((x) => x.values);
    res.history = sectionList(doc, /^\s*History\s*$/i).map(clean).filter(Boolean);
  } catch (e) { console.warn(`${MOD} | playbook`, e); }
  cache.set(uuid, res);
  return res;
}

const esc = (s) => foundry.utils.escapeHTML ? foundry.utils.escapeHTML(s) : s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const text = (sel) => sel.filter(Boolean).map((s, i) => (i ? s.toLowerCase() : cap(s))).join(', ');

async function choose(actor, gi, option, groups) {
  const sel = [...(actor.getFlag(MOD, 'look') ?? [])];
  while (sel.length < groups.length) sel.push(null);
  const previous = text(sel);
  sel[gi] = sel[gi] === option ? null : option;
  const next = text(sel);
  const cur = actor.system.attributes?.look?.value ?? '';
  const last = actor.getFlag(MOD, 'lookText') ?? '';
  let value;
  if (last && cur.includes(esc(last))) value = cur.replace(esc(last), esc(next));
  else if (!cur.replace(/<[^>]*>/g, '').trim()) value = next ? `<p>${esc(next)}</p>` : '';
  else value = next ? `${cur}<p>${esc(next)}</p>` : cur;
  if (!next && value === `<p></p>`) value = '';
  await actor.setFlag(MOD, 'look', sel);
  await actor.setFlag(MOD, 'lookText', next);
  if (actor.system.attributes?.look) await actor.update({ 'system.attributes.look.value': value });
}

async function bind(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const actor = app.actor ?? app.document;
  if (!root || !actor || actor.type !== 'character') return;
  const tab = root.querySelector('.tab.description .sheet-tab');
  if (!tab || tab.querySelector('.motw-look')) return;
  const data = await loadSections(actor.system?.playbook?.uuid);
  if (!data || tab.querySelector('.motw-look')) return;
  const { look: groups, stats, history } = data;
  if (!groups.length && !stats.length && !history.length) return;
  const sel = actor.getFlag(MOD, 'look') ?? [];
  const names = actor.getFlag(MOD, 'history') ?? [];
  const cur = actor.system.stats ?? {};
  const picked = actor.getFlag(MOD, 'statLine');
  const locked = picked !== undefined && picked !== null;
  const same = (v, i) => locked ? picked === i : Object.entries(v).every(([k, n]) => Number(cur[k]?.value) === n);
  if (locked && !game.user.isGM) root.querySelectorAll('input[name^="system.stats."]').forEach((el) => { el.readOnly = true; el.classList.add('motw-locked'); });
  const pend = actor.getFlag(MOD, 'pending') ?? 0;
  let h = `<div class="motw-look__levels"><button type="button" class="motw-look__opt" data-act="levels">Improvements${pend ? ` (${pend} pending)` : ''}</button></div>`;
  if (groups.length) h += '<h3 class="motw-look__title">Look</h3>' + groups.map((g, gi) =>
    `<div class="motw-look__group">${g.map((o) =>
      `<button type="button" class="motw-look__opt${sel[gi] === o ? ' on' : ''}" data-g="${gi}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`).join('');
  if (stats.length) h += '<h3 class="motw-look__title">Ratings</h3><div class="motw-look__group motw-look__stats">' + stats.map((x, i) =>
    `<button type="button" class="motw-look__opt motw-look__stat${same(x.values, i) ? ' on' : ''}" data-s="${i}"${locked ? ' disabled' : ''}>${esc(x.label)}</button>`).join('') + '</div>' + (locked && game.user.isGM ? '<div class="motw-look__gm"><button type="button" class="motw-look__opt" data-act="unlock">Unlock ratings (GM)</button></div>' : '');
  if (history.length) h += '<h3 class="motw-look__title">History</h3><div class="motw-look__history">' + history.map((t, i) =>
    `<label class="motw-look__link"><span>${esc(t)}</span><input type="text" data-h="${i}" value="${esc(names[i] ?? '')}" placeholder="Name of the character involved"${actor.isOwner ? '' : ' disabled'}></label>`).join('') + '</div>';
  const box = document.createElement('div');
  box.className = 'motw-look';
  box.innerHTML = h;
  tab.prepend(box);
  if (!actor.isOwner) return;
  box.addEventListener('click', (ev) => {
    const b = ev.target.closest('.motw-look__opt');
    if (!b) return;
    ev.preventDefault();
    if (b.dataset.act === 'levels') return openImprovements(actor);
    if (b.dataset.act === 'unlock') return actor.unsetFlag(MOD, 'statLine');
    if (b.disabled) return;
    if (b.dataset.s !== undefined) {
      const v = stats[Number(b.dataset.s)].values;
      actor.setFlag(MOD, 'statLine', Number(b.dataset.s));
      actor.update(Object.fromEntries(Object.entries(v).map(([k, n]) => [`system.stats.${k}.value`, n])));
    } else choose(actor, Number(b.dataset.g), b.dataset.o, groups);
  });
  box.addEventListener('change', (ev) => {
    const i = ev.target.closest('input[data-h]');
    if (!i) return;
    const arr = [...(actor.getFlag(MOD, 'history') ?? [])];
    while (arr.length < history.length) arr.push('');
    arr[Number(i.dataset.h)] = i.value.trim();
    actor.setFlag(MOD, 'history', arr);
  });
}


export function registerLookPicker() {
  Hooks.on('renderActorSheet', bind);
  Hooks.on('renderPbtaActorSheet', bind);
}
