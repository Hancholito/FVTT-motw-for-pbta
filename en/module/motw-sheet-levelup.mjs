// Montée de niveau : le bouton « flèche » de la fiche ouvre la liste des améliorations du livret
// et applique automatiquement les effets (caractéristiques, manœuvres, Chance).
const MOD = 'motw-for-pbta-en';
const { DialogV2 } = foundry.applications.api;
const STATS = { weird: 'weird', charm: 'charm', cool: 'cool', sharp: 'sharp', tough: 'tough' };
const STAT_LABEL = { weird: 'Weird', charm: 'Charm', cool: 'Cool', sharp: 'Sharp', tough: 'Tough' };
const esc = (s) => foundry.utils.escapeHTML(String(s));

async function lists(actor) {
  const pb = await fromUuid(actor.system?.playbook?.uuid ?? '');
  const doc = new DOMParser().parseFromString(pb?.system?.description ?? '', 'text/html');
  const grab = (re) => {
    const h = [...doc.querySelectorAll('h3')].find((e) => re.test(e.textContent));
    const out = [];
    for (let e = h?.nextElementSibling; e && !/^H[1-4]$/.test(e.tagName); e = e.nextElementSibling) {
      const m = /@UUID\[[^\]]*\]\{([^}]*)\}/.exec(e.textContent);
      if (m) out.push(m[1].trim().replace(/\.$/, ''));
    }
    return out;
  };
  return { basic: grab(/^\s*Improvements\s*$/i), adv: grab(/^\s*Advanced Improvements\s*$/i) };
}

const state = (actor) => ({ taken: actor.getFlag(MOD, 'taken') ?? [], pending: actor.getFlag(MOD, 'pending') ?? 0 });
const statVal = (actor, k) => Number(actor.system.stats?.[k]?.value ?? 0);
const statMax = (name) => Number(/max\s*\+?(\d)/i.exec(name)?.[1] ?? 3);
const fixedStat = (name) => { const m = /^Get \+1 (\w+)/i.exec(name); return m ? STATS[m[1].toLowerCase()] : null; };
const anyStat = (name) => /^Get \+1 to (any|one)/i.test(name);

async function pickStat(actor, max) {
  const ks = Object.keys(STAT_LABEL).filter((k) => statVal(actor, k) < max);
  if (!ks.length) { ui.notifications.warn('All ratings are already at their maximum.'); return null; }
  return DialogV2.wait({
    window: { title: `Get +1 (max +${max})` }, content: '<p>Choose a rating:</p>',
    buttons: [...ks.map((k) => ({ action: k, label: `${STAT_LABEL[k]} (${statVal(actor, k)} → ${statVal(actor, k) + 1})`, callback: () => k })), { action: 'x', label: 'Cancel', callback: () => null }],
    rejectClose: false
  });
}

async function chooseMove(actor, other) {
  const pbName = actor.system?.playbook?.name;
  const owned = new Set(actor.items.map((i) => i.name));
  const found = [];
  for (const pack of game.packs.filter((p) => p.metadata.packageName === MOD && p.documentName === 'Item')) {
    const idx = await pack.getIndex({ fields: ['system.moveType', 'system.playbook'] });
    for (const e of idx) {
      if (e.type !== 'move' || e.system?.moveType !== 'class' || owned.has(e.name)) continue;
      const own = e.system.playbook === pbName;
      if (own !== !other) continue;
      found.push({ uuid: e.uuid, name: e.name, pb: e.system.playbook });
    }
  }
  let list = found;
  if (other) {
    const pbs = [...new Set(found.map((f) => f.pb))].sort((a, b) => a.localeCompare(b, 'en'));
    const pbSel = await DialogV2.wait({
      window: { title: 'Move from another playbook' }, content: '<p>Choose a playbook:</p>',
      buttons: [...pbs.map((p) => ({ action: p, label: p, callback: () => p })), { action: 'x', label: 'Cancel', callback: () => null }], rejectClose: false
    });
    if (!pbSel) return null;
    list = found.filter((f) => f.pb === pbSel);
  }
  if (!list.length) { ui.notifications.warn('No move available.'); return null; }
  const uuid = await DialogV2.wait({
    window: { title: 'Choose a move' }, content: '',
    buttons: [...list.map((f) => ({ action: f.uuid, label: f.name, callback: () => f.uuid })), { action: 'x', label: 'Cancel', callback: () => null }], rejectClose: false
  });
  if (!uuid) return null;
  const doc = await fromUuid(uuid);
  const data = doc.toObject(); delete data._id;
  await actor.createEmbeddedDocuments('Item', [data]);
  return doc.name;
}

async function apply(actor, name) {
  // renvoie le complément de texte à noter, ou null si annulé
  const fs = fixedStat(name);
  if (fs || anyStat(name)) {
    const max = statMax(name);
    const k = fs ?? await pickStat(actor, max);
    if (!k) return null;
    if (statVal(actor, k) >= max) { ui.notifications.warn(`${STAT_LABEL[k]} is already at its maximum (+${max}).`); return null; }
    await actor.update({ [`system.stats.${k}.value`]: statVal(actor, k) + 1 });
    return fs ? '' : `${STAT_LABEL[k]} +1`;
  }
  if (/^Take another .* move/i.test(name)) { const n = await chooseMove(actor, false); return n ? `move: ${n}` : null; }
  if (/^Take a move from another playbook/i.test(name)) { const n = await chooseMove(actor, true); return n ? `move: ${n}` : null; }
  if (/used Luck point|used luck mark/i.test(name)) {
    const v = Number(actor.system.attributes?.luck?.value ?? 0);
    if (v > 0) await actor.update({ 'system.attributes.luck.value': v - 1 });
    return '';
  }
  return ''; // effet à gérer à la main : on le note simplement
}

export async function openImprovements(actor) {
  const { basic, adv } = await lists(actor);
  const { taken, pending } = state(actor);
  const nBasic = taken.filter((k) => k.startsWith('b')).length;
  const advOpen = nBasic >= 5;
  const sel = new Set();
  const row = (arr, p) => arr.map((n, i) => {
    const key = `${p}:${i}`, done = taken.includes(key);
    const fs = fixedStat(n), cap = fs ? statVal(actor, fs) >= statMax(n) : false;
    const off = done || !pending || (p === 'a' && !advOpen) || cap;
    return `<button type="button" class="motw-imp${done ? ' done' : ''}" data-key="${key}" ${off ? 'disabled' : ''}>${esc(n)}${done ? ' ✓' : ''}${cap ? ' (max)' : ''}</button>`;
  }).join('');
  const content = `<div class="motw-lvl"><p>Levels to spend: <strong>${pending}</strong> · Improvements taken: <strong>${nBasic}</strong> · Selected: <strong class="motw-sel">0</strong>/${pending}</p>
    <h4>Improvements</h4><div class="motw-imp-list">${row(basic, 'b')}</div>
    <h4>Advanced improvements ${advOpen ? '' : '<small>(after 5 improvements)</small>'}</h4><div class="motw-imp-list">${row(adv, 'a')}</div></div>`;
  let chosen = [];
  const refresh = (el) => {
    el.querySelector('.motw-sel').textContent = sel.size;
    el.querySelectorAll('.motw-imp').forEach((b) => {
      const on = sel.has(b.dataset.key);
      b.classList.toggle('sel', on);
      if (!b.classList.contains('done') && !b.dataset.locked) b.disabled = !on && sel.size >= pending;
    });
    const ok = el.querySelector('[data-action="ok"]');
    if (ok) ok.disabled = sel.size === 0;
  };
  const dlg = new DialogV2({
    window: { title: 'Improvements' }, position: { width: 560 }, content,
    buttons: [
      { action: 'ok', label: 'Confirm', default: true, callback: () => { chosen = [...sel]; } },
      { action: 'close', label: 'Close' }
    ],
    render: (ev, d) => {
      const el = d.element;
      el.querySelectorAll('.motw-imp[disabled]').forEach((b) => { b.dataset.locked = '1'; });
      el.querySelectorAll('.motw-imp').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.locked) return;
        if (sel.has(b.dataset.key)) sel.delete(b.dataset.key);
        else if (sel.size < pending) sel.add(b.dataset.key);
        refresh(el);
      }));
      refresh(el);
    },
    rejectClose: false
  });
  dlg.addEventListener('close', async () => {
    if (!chosen.length) return;
    let left = pending;
    const done = [...taken];
    for (const key of chosen) {
      const [p, i] = [key[0], Number(key.slice(2))];
      const name = (p === 'b' ? basic : adv)[i];
      const extra = await apply(actor, name);
      if (extra === null) continue;
      const field = p === 'b' ? 'improvements' : 'advancedimprovements';
      const cur = actor.system.attributes?.[field]?.value ?? '';
      const note = `<p>${esc(name)}${extra ? ` — ${esc(extra)}` : ''}</p>`;
      if (actor.system.attributes?.[field]) await actor.update({ [`system.attributes.${field}.value`]: cur + note });
      done.push(key); left = Math.max(0, left - 1);
      await actor.setFlag(MOD, 'taken', done);
      await actor.setFlag(MOD, 'pending', left);
    }
  }, { once: true });
  dlg.render({ force: true });
}

async function levelUp(actor) {
  const xp = Object.entries(actor.system.attributes ?? {}).find(([, d]) => d.type === 'Xp');
  const upd = { 'system.advancements': (actor.system.advancements ?? 0) + 1 };
  if (xp) upd[`system.attributes.${xp[0]}.value`] = 0;
  await actor.update(upd);
  await actor.setFlag(MOD, 'pending', (actor.getFlag(MOD, 'pending') ?? 0) + 1);
  openImprovements(actor);
}

function bind(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const actor = app.actor ?? app.document;
  if (!root || actor?.type !== 'character') return;
  if (!game.user.isGM) root.querySelectorAll('input[name="system.advancements"]').forEach((el) => { el.readOnly = true; el.tabIndex = -1; el.classList.add('motw-level-locked'); });
  if (root.dataset.motwLvl) return;
  root.dataset.motwLvl = '1';
  root.addEventListener('click', (ev) => {
    const a = ev.target.closest('.advancement.active');
    if (!a || !actor.isOwner) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    levelUp(actor);
  }, true);
}

export function registerLevelUp() {
  Hooks.on('renderActorSheet', bind);
  Hooks.on('renderPbtaActorSheet', bind);
}
