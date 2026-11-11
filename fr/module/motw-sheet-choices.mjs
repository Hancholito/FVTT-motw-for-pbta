// Montée de niveau : fenêtres de choix pour les améliorations qui n'étaient que notées à la main
// (refuge, manœuvres de base avancées, allié ou équipe, retraite, second chasseur, changement de type).
// applyManual(actor, libellé) renvoie : undefined (non géré), null (annulé) ou le texte à noter.
const MOD = import.meta.url.includes('motw-for-pbta-en') ? 'motw-for-pbta-en' : 'motw-for-pbta';
const EN = MOD.endsWith('-en');
const { DialogV2 } = foundry.applications.api;

const S = EN ? {
  ok: 'Confirm', cancel: 'Cancel',
  havenTitle: 'Haven options', havenHelp: (n) => `Pick ${n} option${n > 1 ? 's' : ''} for your haven. They are added to your moves.`,
  havenNone: 'No haven option left to take.', haven: 'Haven',
  pick: (n) => `pick ${n}`,
  advTitle: 'Mark basic moves as advanced', advHelp: (n) => `Pick ${n} basic move${n > 1 ? 's' : ''} to mark as advanced.`,
  advNone: 'No basic move left to mark.', advNote: 'Advanced moves',
  noteTitle: 'Details', nameLabel: 'Name', detailLabel: 'Details (optional)',
  retireTitle: 'Retire this hunter', retireText: (n) => `<p><strong>${n}</strong> will be marked as retired. The character stays in your world but can no longer be played.</p>`, retired: 'retired',
  retiredSuffix: '(retired)',
  secondTitle: 'Second hunter', secondText: '<p>Create your second hunter now?</p>', secondYes: 'Create now', secondLater: 'Later', secondNote: 'second hunter to create',
  changeTitle: 'Change type', changeText: '<p>Pick the new type (playbook) of this hunter. You keep your level, ratings and gear; the new playbook asks you to choose its moves.</p>', changeNote: 'new type',
  secondFail: 'Create the second hunter from the Actors tab.'
} : {
  ok: 'Valider', cancel: 'Annuler',
  havenTitle: 'Options de refuge', havenHelp: (n) => `Choisissez ${n} option${n > 1 ? 's' : ''} pour votre refuge. Elles sont ajoutées à vos manœuvres.`,
  havenNone: 'Plus aucune option de refuge à prendre.', haven: 'Refuge',
  pick: (n) => `${n} au choix`,
  advTitle: 'Manœuvres de base avancées', advHelp: (n) => `Choisissez ${n} manœuvre${n > 1 ? 's' : ''} de base à marquer comme avancée${n > 1 ? 's' : ''}.`,
  advNone: 'Plus aucune manœuvre de base à marquer.', advNote: 'Manœuvres avancées',
  noteTitle: 'Précisions', nameLabel: 'Nom', detailLabel: 'Précisions (facultatif)',
  retireTitle: 'Mettre ce chasseur à la retraite', retireText: (n) => `<p><strong>${n}</strong> sera marqué comme retraité. Le personnage reste dans votre monde mais ne peut plus être joué.</p>`, retired: 'retraité',
  retiredSuffix: '(retraité)',
  secondTitle: 'Second chasseur', secondText: '<p>Créer votre second chasseur maintenant ?</p>', secondYes: 'Créer maintenant', secondLater: 'Plus tard', secondNote: 'second chasseur à créer',
  changeTitle: 'Changer de type', changeText: '<p>Choisissez le nouveau type (livret) de ce chasseur. Vous gardez votre niveau, vos caractéristiques et votre matériel ; le nouveau livret vous demande de choisir ses manœuvres.</p>', changeNote: 'nouveau type',
  secondFail: 'Créez le second chasseur depuis l’onglet Acteurs.'
};

const norm = (s) => String(s).replace(/ /g, ' ').replace(/[’‘]/g, "'").trim();
const esc = (s) => foundry.utils.escapeHTML(String(s ?? ''));
const NUM = { one: 1, two: 2, three: 3, un: 1, une: 1, deux: 2, trois: 3 };
const countIn = (n, dflt, re = /\b(one|two|three|une?|deux|trois)\s+(?:more |another |autre |additional )?options?\b/i) => { const m = re.exec(n); return m ? NUM[m[1].toLowerCase()] : dflt; };

/* ---------- fenêtres génériques ---------- */
async function pickList({ title, help, items, count }) {
  const n = Math.min(count, items.length);
  const html = `<div class="motw-gear"><p>${esc(help)}</p><section class="motw-gear__group" data-max="${n}"><h4>${esc(title)} <small>(${esc(S.pick(n))})</small> <span class="motw-gear__count">0/${n}</span></h4>`
    + items.map((it, i) => `<label class="motw-gear__item"><input type="checkbox" data-i="${i}"><span class="motw-gear__name">${esc(it.name)}</span>${it.hint ? `<small>${esc(it.hint)}</small>` : ''}</label>`).join('') + '</section></div>';
  const res = await DialogV2.wait({
    window: { title }, position: { width: 520 }, content: html, rejectClose: false,
    buttons: [
      { action: 'ok', label: S.ok, default: true, callback: (ev, btn, dlg) => [...(dlg?.element ?? btn.form?.closest('.application')).querySelectorAll('input[data-i]:checked')].map((x) => Number(x.dataset.i)) },
      { action: 'x', label: S.cancel }
    ],
    render: (ev, dlg) => {
      const el = dlg.element;
      const ok = el.querySelector('[data-action="ok"]');
      const refresh = () => {
        const boxes = [...el.querySelectorAll('input[data-i]')];
        const c = boxes.filter((b) => b.checked).length;
        el.querySelector('.motw-gear__count').textContent = `${c}/${n}`;
        boxes.forEach((b) => { b.disabled = !b.checked && c >= n; });
        if (ok) ok.disabled = c !== n;
      };
      el.addEventListener('change', refresh);
      refresh();
    }
  });
  return Array.isArray(res) ? res.map((i) => items[i]) : null;
}

async function askNote(label) {
  const res = await DialogV2.wait({
    window: { title: S.noteTitle }, position: { width: 460 }, rejectClose: false,
    content: `<p><em>${esc(label)}</em></p><div class="form-group"><label>${esc(S.nameLabel)}</label><div class="form-fields"><input type="text" name="motwName"></div></div><div class="form-group"><label>${esc(S.detailLabel)}</label><div class="form-fields"><textarea name="motwDetail" rows="3"></textarea></div></div>`,
    buttons: [
      { action: 'ok', label: S.ok, default: true, callback: (ev, btn, dlg) => { const el = dlg?.element ?? btn.form?.closest('.application'); return { name: el.querySelector('[name="motwName"]').value.trim(), detail: el.querySelector('[name="motwDetail"]').value.trim() }; } },
      { action: 'x', label: S.cancel }
    ]
  });
  if (!res || typeof res !== 'object') return null;
  return [res.name, res.detail].filter(Boolean).join(' — ');
}

const confirm = async (title, content, yes, no) => (await DialogV2.wait({
  window: { title }, content, rejectClose: false,
  buttons: [{ action: 'yes', label: yes, default: true }, { action: 'no', label: no }]
})) === 'yes';

/* ---------- refuge ---------- */
async function havenOptions() {
  const out = [];
  for (const pack of game.packs.filter((p) => p.metadata.packageName === MOD && p.documentName === 'Item')) {
    const idx = await pack.getIndex({ fields: ['system.playbook'] });
    for (const e of idx) if (e.type === 'move' && /^(Refuge|Haven)\s?:/i.test(norm(e.name))) out.push({ uuid: e.uuid, name: e.name });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, EN ? 'en' : 'fr'));
}

async function doHaven(actor, name) {
  const n = norm(name);
  const owned = new Set(actor.items.map((i) => i.name));
  const all = await havenOptions();
  if (!all.length) return undefined;
  let pick = countIn(n, 1);
  if (/^(obtenir un refuge|(get|take|gain) a haven)\s*$/i.test(n)) pick = 2;
  const fixed = [];
  let extra = '';
  const find = (re) => all.find((o) => re.test(norm(o.name)));
  if (/atelier|workshop/i.test(n)) { const w = find(/atelier|workshop/i); if (w) fixed.push(w); pick = 1; }
  else if (/mystical library|biblioth[eè]que mystique/i.test(n)) { const w = find(/mystical library|biblioth[eè]que mystique/i); if (w) fixed.push(w); pick = 0; }
  else if (/film lab|laboratoire de d[ée]veloppement/i.test(n)) { pick = 1; extra = EN ? 'film lab and editing suite' : 'laboratoire de développement et salle de montage'; }
  const have = (o) => owned.has(o.name);
  const pool = all.filter((o) => !have(o) && !fixed.includes(o));
  let chosen = [];
  if (pick > 0) {
    if (!pool.length) { ui.notifications.warn(S.havenNone); return null; }
    chosen = await pickList({ title: S.havenTitle, help: S.havenHelp(pick), items: pool, count: pick });
    if (!chosen) return null;
  }
  const toAdd = [...fixed.filter((o) => !have(o)), ...chosen];
  const docs = [];
  for (const o of toAdd) { const d = await fromUuid(o.uuid); if (d) { const x = d.toObject(); delete x._id; docs.push(x); } }
  if (docs.length) await actor.createEmbeddedDocuments('Item', docs);
  const names = [...toAdd.map((o) => norm(o.name).replace(/^(Refuge|Haven)\s?:\s*/i, '')), extra].filter(Boolean);
  return `${S.haven} : ${names.join(', ')}`;
}

/* ---------- manœuvres de base avancées ---------- */
async function doAdvanced(actor, name) {
  const count = countIn(norm(name), 2, /\b(one|two|three|une?|deux|trois)\b/i);
  const pool = actor.items.filter((i) => i.type === 'move' && i.system?.moveType === 'basic' && !i.getFlag(MOD, 'advanced'));
  if (!pool.length) { ui.notifications.warn(S.advNone); return null; }
  const chosen = await pickList({ title: S.advTitle, help: S.advHelp(count), items: pool.map((i) => ({ name: i.name, id: i.id })), count });
  if (!chosen) return null;
  for (const c of chosen) await actor.items.get(c.id)?.setFlag(MOD, 'advanced', true);
  return `${S.advNote} : ${chosen.map((c) => c.name).join(', ')}`;
}

/* ---------- retraite, second chasseur, changement de type ---------- */
async function doRetire(actor) {
  if (!(await confirm(S.retireTitle, S.retireText(esc(actor.name)), S.ok, S.cancel))) return null;
  await actor.setFlag(MOD, 'retired', true);
  if (!actor.name.endsWith(S.retiredSuffix)) await actor.update({ name: `${actor.name} ${S.retiredSuffix}` });
  return S.retired;
}

async function doCurse(actor) {
  const v = Number(actor.system.stats?.weird?.value ?? 0);
  await actor.update({ 'system.stats.weird.value': v - 1 });
  return EN ? 'curse lifted, -1 Weird' : 'malédiction levée, -1 Bizarre';
}

async function doSecond() {
  if (await confirm(S.secondTitle, S.secondText, S.secondYes, S.secondLater)) {
    try { await Actor.implementation.createDialog({}, {}, { types: ['character'] }); } catch (e) { ui.notifications.info(S.secondFail); }
    return '';
  }
  return S.secondNote;
}

async function doChange(actor) {
  const pack = game.packs.get(`${MOD}.playbooks`);
  if (!pack) return undefined;
  const idx = await pack.getIndex();
  const cur = actor.items.find((i) => i.type === 'playbook');
  const items = [...idx].filter((e) => e.name !== cur?.name)
    .map((e) => ({ name: e.name, uuid: e.uuid })).sort((a, b) => a.name.localeCompare(b.name, EN ? 'en' : 'fr'));
  const res = await pickList({ title: S.changeTitle, help: S.changeText.replace(/<[^>]+>/g, ''), items, count: 1 });
  if (!res?.length) return null;
  const doc = await fromUuid(res[0].uuid);
  const data = doc.toObject(); delete data._id;
  const created = await actor.createEmbeddedDocuments('Item', [data]);
  const keep = new Set((created ?? []).map((c) => c.id));
  const old = actor.items.filter((i) => i.type === 'playbook' && !keep.has(i.id)).map((i) => i.id);
  if (old.length) await actor.deleteEmbeddedDocuments('Item', old);
  return `${S.changeNote} : ${doc.name}`;
}

/* ---------- aiguillage ---------- */
export function kindOf(rawName) {
  const n = norm(rawName);
  if (/mark .*basic moves?|marquer .*man(?:œ|oe)uvres? de base/iu.test(n)) return 'adv';
  if (/^(retire this|mettre ce chasseur [àa] la retraite|retraite m[ée]rit[ée]e|redevenir mauvais|virer au mal|turn evil|you turn evil)/iu.test(n)) return 'retire';
  if (/second hunter|second chasseur|deuxi[èe]me chasseur/iu.test(n)) return 'second';
  if (/^(change this hunter|changer ce chasseur)/iu.test(n)) return 'change';
  if (/free yourself from the curse|vous lib[ée]rer de la mal[ée]diction/iu.test(n)) return 'curse';
  if (/haven|refuge|laborator|laboratoire|mystical library|biblioth[eè]que mystique/iu.test(n) && !/^(prendre|take) (une|another) /iu.test(n)) return 'haven';
  // mécaniques ou sans détail à préciser : on se contente de les noter
  if (/harm box|case de bless|case de d[ée]g[âa]ts|make it big|^percer\b/iu.test(n)) return null;
  return 'note'; // allié, équipe, tags à retirer, option à préciser… : fenêtre « nom et précisions »
}

export async function applyManual(actor, rawName) {
  const n = norm(rawName);
  switch (kindOf(rawName)) {
    case 'adv': return doAdvanced(actor, n);
    case 'retire': return doRetire(actor);
    case 'second': return doSecond();
    case 'change': return doChange(actor);
    case 'haven': return doHaven(actor, n);
    case 'curse': return doCurse(actor);
    case 'note': return askNote(rawName);
    default: return undefined;
  }
}
