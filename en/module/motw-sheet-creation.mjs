// Assistant de création de personnage : après le choix du livret et des manœuvres (fenêtre du système PbtA),
// la fiche passe sur l'onglet Description (apparence + caractéristiques), puis sur l'onglet Équipement,
// où une fenêtre propose le matériel du livret (objets fournis + choix à faire).
// L'avancement est mémorisé sur la fiche : fermer une fenêtre ne perd rien, un bandeau permet de reprendre.
import { loadSections } from './motw-sheet-look.mjs';

const MOD = import.meta.url.includes('motw-for-pbta-en') ? 'motw-for-pbta-en' : 'motw-for-pbta';
const EN = MOD.endsWith('-en');
const { DialogV2 } = foundry.applications.api;

const S = EN ? {
  title: 'Character creation',
  s1: 'Playbook and moves', s2: 'Look and ratings', s3: 'Gear',
  step: (n) => `Step ${n}/3`,
  lookHelp: 'Pick your look and one line of ratings in the Description tab.',
  gearHelp: 'Choose your starting gear.',
  goDesc: 'Go to Description', goGear: 'Choose gear',
  finish: 'End creation (GM)',
  gmGear: 'Starting gear… (GM)',
  dlgTitle: 'Starting gear',
  intro: 'Your playbook gives you the gear below. Tick your choices, then confirm: the items are added to your Equipment tab.',
  given: 'Included with your playbook',
  pickN: (a, b) => (a === b ? `pick ${a}` : a === 0 ? `up to ${b}` : `pick ${a} to ${b}`),
  total: (n) => `${n} weapons in total`,
  ok: 'Confirm', later: 'Later',
  done: 'Creation complete: your gear has been added.',
  nothing: 'No gear to choose for this playbook.'
} : {
  title: 'Création du personnage',
  s1: 'Livret et manœuvres', s2: 'Apparence et caractéristiques', s3: 'Matériel',
  step: (n) => `Étape ${n}/3`,
  lookHelp: 'Choisissez votre apparence et une ligne de caractéristiques dans l’onglet Description.',
  gearHelp: 'Choisissez votre matériel de départ.',
  goDesc: 'Aller à Description', goGear: 'Choisir le matériel',
  finish: 'Terminer la création (MJ)',
  gmGear: 'Matériel de départ… (MJ)',
  dlgTitle: 'Matériel de départ',
  intro: 'Votre livret vous donne le matériel ci-dessous. Cochez vos choix puis validez : les objets sont ajoutés à votre onglet Équipement.',
  given: 'Fourni avec votre livret',
  pickN: (a, b) => (a === b ? `${a} au choix` : a === 0 ? `jusqu’à ${b}` : `de ${a} à ${b}`),
  total: (n) => `${n} armes au total`,
  ok: 'Valider', later: 'Plus tard',
  done: 'Création terminée : votre matériel a été ajouté.',
  nothing: 'Aucun matériel à choisir pour ce livret.'
};

const esc = (s) => (foundry.utils.escapeHTML ? foundry.utils.escapeHTML(String(s ?? '')) : String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));

let rulesP = null;
const getRules = () => (rulesP ??= fetch(foundry.utils.getRoute(`modules/${MOD}/data/gear-rules.json`)).then((r) => r.json()).catch((e) => { console.warn(`${MOD} | gear-rules`, e); return {}; }));

const playbookOf = (actor) => actor.items.find((i) => i.type === 'playbook');
const slugOf = (actor) => playbookOf(actor)?.system?.slug || actor.system?.playbook?.slug || '';
const stepOf = (actor) => actor.getFlag(MOD, 'creation')?.step ?? null;
const setStep = (actor, step) => actor.setFlag(MOD, 'creation', { step });

/* ---------- onglets ---------- */
const pendingTab = new Map();
function activate(app, tab) {
  const root = app?.element instanceof HTMLElement ? app.element : app?.element?.[0];
  if (!root) return false;
  const link = root.querySelector(`.sheet-tabs [data-tab="${tab}"]`);
  if (!link) return false;
  try { if (app._tabs?.[0]) app._tabs[0].activate(tab); else link.click(); } catch (e) { link.click(); }
  return true;
}
function goTo(actor, tab) {
  pendingTab.set(actor.id, tab);
  const app = actor.sheet;
  if (app?.rendered) setTimeout(() => { if (activate(app, tab)) pendingTab.delete(actor.id); }, 200);
}

/* ---------- étape 2 : apparence + caractéristiques ---------- */
async function lookDone(actor) {
  const uuid = actor.system?.playbook?.uuid;
  const d = await loadSections(uuid);
  if (!d) return true;
  const sel = actor.getFlag(MOD, 'look') ?? [];
  const lookOk = !d.look.length || d.look.every((_, i) => sel[i]);
  const statOk = !d.stats.length || (actor.getFlag(MOD, 'statLine') ?? null) !== null;
  return lookOk && statOk;
}

const busy = new Map(); // actor.id -> 'run' | 'again' (réévaluer si un nouveau choix arrive pendant la vérification)
async function afterLook(actor) {
  if (busy.has(actor.id)) { busy.set(actor.id, 'again'); return; }
  let go = false;
  try {
    do {
      busy.set(actor.id, 'run');
      if (stepOf(actor) !== 'look') break;
      if (await lookDone(actor)) { await setStep(actor, 'gear'); go = true; break; }
    } while (busy.get(actor.id) === 'again');
  } finally { busy.delete(actor.id); }
  if (go) startGear(actor);
}

/* ---------- étape 3 : matériel ---------- */
async function rulesFor(actor) {
  const r = (await getRules())[slugOf(actor)];
  if (!r || (!r.fixed?.length && !r.groups?.length)) return null;
  return r;
}

async function startGear(actor) {
  const r = await rulesFor(actor);
  if (!r) { await setStep(actor, 'done'); return; }
  goTo(actor, 'equipment');
  openGear(actor);
}

const tagsOf = (it) => {
  const t = it?.system?.tags;
  try { return (typeof t === 'string' && t.trim().startsWith('[') ? JSON.parse(t).map((x) => x.value) : []).join(', '); } catch (e) { return ''; }
};

async function openGear(actor, rules) {
  const r = rules ?? await rulesFor(actor);
  if (!r) return ui.notifications.info(S.nothing);
  const all = [...(r.fixed ?? []), ...(r.groups ?? []).flatMap((g) => g.items)];
  const docs = new Map();
  await Promise.all([...new Set(all.map((i) => i.uuid))].map(async (u) => { try { docs.set(u, await fromUuid(u)); } catch (e) { /* objet absent */ } }));
  const line = (i, input) => {
    const it = docs.get(i.uuid);
    const tg = tagsOf(it);
    return `<label class="motw-gear__item">${input}<img src="${esc(it?.img ?? 'icons/svg/item-bag.svg')}" alt=""><span class="motw-gear__name">${esc(it?.name ?? i.name)}</span>${tg ? `<small>${esc(tg)}</small>` : ''}</label>`;
  };
  let h = `<div class="motw-gear"><p>${esc(S.intro)}</p>`;
  if (r.fixed?.length) h += `<section class="motw-gear__fixed"><h4>${esc(S.given)}</h4>${r.fixed.map((i) => line(i, '<input type="checkbox" checked disabled>')).join('')}</section>`;
  (r.groups ?? []).forEach((g, gi) => {
    h += `<section class="motw-gear__group" data-g="${gi}" data-min="${g.min}" data-max="${g.max}"><h4>${esc(g.title)} <small>(${esc(S.pickN(g.min, g.max))})</small> <span class="motw-gear__count">0/${g.max}</span></h4>`
      + g.items.map((i) => line(i, `<input type="checkbox" data-g="${gi}" data-u="${esc(i.uuid)}">`)).join('') + '</section>';
  });
  if (r.total) h += `<p class="motw-gear__total"><strong>${esc(S.total(r.total))}</strong> <span class="motw-gear__sum">0/${r.total}</span></p>`;
  h += '</div>';
  const picked = await DialogV2.wait({
    window: { title: S.dlgTitle }, position: { width: 560 }, content: h, rejectClose: false,
    buttons: [
      { action: 'ok', label: S.ok, icon: 'fa-solid fa-check', default: true, callback: (ev, btn, dlg) => [...(dlg?.element ?? btn.form?.closest('.application')).querySelectorAll('input[data-u]:checked')].map((x) => x.dataset.u) },
      { action: 'later', label: S.later }
    ],
    render: (ev, dlg) => {
      const el = dlg.element;
      const ok = el.querySelector('[data-action="ok"]');
      const refresh = () => {
        let sum = 0, valid = true;
        el.querySelectorAll('.motw-gear__group').forEach((sec) => {
          const mn = Number(sec.dataset.min), mx = Number(sec.dataset.max);
          const boxes = [...sec.querySelectorAll('input[data-u]')];
          const n = boxes.filter((b) => b.checked).length;
          sum += n;
          sec.querySelector('.motw-gear__count').textContent = `${n}/${mx}`;
          if (n < mn || n > mx) valid = false;
          sec.classList.toggle('is-ok', n >= mn && n <= mx);
        });
        if (r.total) {
          el.querySelector('.motw-gear__sum').textContent = `${sum}/${r.total}`;
          if (sum !== r.total) valid = false;
        }
        el.querySelectorAll('.motw-gear__group').forEach((sec) => {
          const mx = Number(sec.dataset.max);
          const n = [...sec.querySelectorAll('input[data-u]')].filter((b) => b.checked).length;
          sec.querySelectorAll('input[data-u]').forEach((b) => { b.disabled = !b.checked && (n >= mx || (r.total && sum >= r.total)); });
        });
        if (ok) ok.disabled = !valid;
      };
      el.addEventListener('change', refresh);
      refresh();
    }
  });
  if (!Array.isArray(picked)) return;
  const wanted = [...(r.fixed ?? []).map((i) => i.uuid), ...picked];
  const have = new Set(actor.items.filter((i) => i.type === 'equipment').map((i) => i.name));
  const data = [];
  for (const u of wanted) {
    const it = docs.get(u) ?? await fromUuid(u).catch(() => null);
    if (!it || have.has(it.name)) continue;
    const o = it.toObject();
    delete o._id;
    o.flags = foundry.utils.mergeObject(o.flags ?? {}, { [MOD]: { startGear: true } });
    data.push(o); have.add(it.name);
  }
  if (data.length) await actor.createEmbeddedDocuments('Item', data);
  await setStep(actor, 'done');
  ui.notifications.info(S.done);
  goTo(actor, 'equipment');
}

/* ---------- bandeau ---------- */
function banner(actor) {
  const step = stepOf(actor);
  if (!step || step === 'done') return null;
  const n = step === 'look' ? 2 : 3;
  const mark = (ok) => (ok ? '✓' : '•');
  const box = document.createElement('div');
  box.className = 'motw-wiz';
  box.innerHTML = `<div class="motw-wiz__head"><strong>${esc(S.title)}</strong> — ${esc(S.step(n))}</div>
    <div class="motw-wiz__steps"><span class="ok">${mark(true)} ${esc(S.s1)}</span><span class="${step === 'gear' ? 'ok' : 'now'}">${mark(step === 'gear')} ${esc(S.s2)}</span><span class="${step === 'gear' ? 'now' : ''}">${mark(false)} ${esc(S.s3)}</span></div>
    <p>${esc(step === 'look' ? S.lookHelp : S.gearHelp)}</p>
    <div class="motw-wiz__btns"><button type="button" data-act="${step === 'look' ? 'desc' : 'gear'}">${esc(step === 'look' ? S.goDesc : S.goGear)}</button>${game.user.isGM ? `<button type="button" data-act="finish" class="motw-wiz__gm">${esc(S.finish)}</button>` : ''}</div>`;
  return box;
}

function bind(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const actor = app.actor ?? app.document;
  if (!root || actor?.type !== 'character' || !actor.isOwner) return;
  root.querySelector('.motw-wiz')?.remove();
  const box = banner(actor);
  if (box) {
    (root.querySelector('.sheet-tabs') ?? root.firstElementChild)?.before(box);
    box.addEventListener('click', async (ev) => {
      const b = ev.target.closest('button[data-act]');
      if (!b) return;
      ev.preventDefault();
      if (b.dataset.act === 'desc') activate(app, 'description');
      else if (b.dataset.act === 'gear') { activate(app, 'equipment'); openGear(actor); }
      else if (b.dataset.act === 'finish') await setStep(actor, 'done');
    });
  }
  const tab = pendingTab.get(actor.id);
  if (tab) { setTimeout(() => { if (activate(app, tab)) pendingTab.delete(actor.id); }, 50); }
  if (game.user.isGM && !root.querySelector('.motw-wiz-gm')) {
    const eq = root.querySelector('.tab.equipment');
    if (eq) {
      const d = document.createElement('div');
      d.className = 'motw-wiz-gm';
      d.innerHTML = `<button type="button">${esc(S.gmGear)}</button>`;
      d.firstElementChild.addEventListener('click', (ev) => { ev.preventDefault(); openGear(actor); });
      eq.prepend(d);
    }
  }
}

export function registerCreation() {
  Hooks.on('renderActorSheet', bind);
  Hooks.on('renderPbtaActorSheet', bind);

  // livret ajouté à une fiche (la fenêtre du système a déjà été validée ou fermée)
  Hooks.on('createItem', async (item, options, userId) => {
    if (userId !== game.user.id || item.type !== 'playbook') return;
    const actor = item.parent;
    if (!actor || actor.documentName !== 'Actor' || actor.type !== 'character') return;
    const cur = stepOf(actor);
    if (cur === 'done' || (actor.system?.advancements ?? 0) > 0) return;
    if (cur) { await actor.unsetFlag(MOD, 'statLine'); await actor.unsetFlag(MOD, 'look'); }
    await setStep(actor, 'look');
    goTo(actor, 'description');
    await afterLook(actor); // livret sans apparence ni caractéristiques : on passe au matériel
  });

  // apparence et caractéristiques choisies -> matériel
  Hooks.on('updateActor', (actor, changes, options, userId) => {
    if (userId !== game.user.id || actor.type !== 'character') return;
    if (!foundry.utils.hasProperty(changes, `flags.${MOD}`)) return;
    afterLook(actor);
  });
}
