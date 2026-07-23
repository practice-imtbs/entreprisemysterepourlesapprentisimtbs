/* Validation du content.json au chargement (garde-fou des mises à jour annuelles) */

const DEBRIEF_ITEMS_ATTENDUS = { d2: 6 };

export function validateContent(c) {
  const errors = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };

  need(c.meta && typeof c.meta.codeFinal === 'string', 'meta.codeFinal manquant');
  need(Array.isArray(c.meta?.fragments) && c.meta.fragments.length === 3, 'meta.fragments doit contenir 3 fragments');
  need(c.meta && (c.meta.fragments || []).join('') === c.meta.codeFinal,
    `meta.fragments (${(c.meta?.fragments || []).join('')}) doit reconstituer meta.codeFinal (${c.meta?.codeFinal})`);

  need(Array.isArray(c.intro?.messages) && c.intro.messages.length >= 1, 'intro.messages manquant');
  need(Array.isArray(c.calendrier?.punaises) && c.calendrier.punaises.length === 5, 'calendrier : 5 punaises attendues');
  need(Array.isArray(c.annuaire?.fiches) && c.annuaire.fiches.length === 8, 'annuaire : 8 fiches attendues');

  const questions = c.questions || {};
  for (const [qid, q] of Object.entries(questions)) {
    need(q.enonce, `${qid} : énoncé manquant`);
    need(q.retenir, `${qid} : encart « Ce qu'il faut retenir » manquant`);
    if (q.type === 'qcm') {
      const ids = (q.options || []).map((o) => o.id);
      need(ids.length >= 2, `${qid} : options insuffisantes`);
      need(Array.isArray(q.correct) && q.correct.length >= 1, `${qid} : bonne(s) réponse(s) manquante(s)`);
      for (const cId of q.correct || []) need(ids.includes(cId), `${qid} : réponse correcte « ${cId} » absente des options`);
      if (q.multi) need((q.correct || []).length >= 2, `${qid} : multi=true mais une seule bonne réponse`);
    } else if (q.type === 'vraifaux') {
      need(typeof q.correct === 'boolean', `${qid} : correct doit être true/false`);
    } else if (q.type === 'ordre') {
      const ids = (q.items || []).map((i) => i.id);
      need(Array.isArray(q.correct) && q.correct.length === ids.length, `${qid} : l'ordre correct doit couvrir tous les items`);
      for (const cId of q.correct || []) need(ids.includes(cId), `${qid} : item « ${cId} » de l'ordre correct absent`);
    } else if (q.type === 'matching') {
      const l = (q.left || []).map((i) => i.id);
      const r = (q.right || []).map((i) => i.id);
      need(l.length >= 2 && r.length >= 2, `${qid} : colonnes matching incomplètes`);
      need(q.correct && Object.keys(q.correct).length === l.length, `${qid} : appariement correct incomplet`);
      for (const [a, b] of Object.entries(q.correct || {})) {
        need(l.includes(a), `${qid} : élément gauche « ${a} » inconnu`);
        need(r.includes(b), `${qid} : cible « ${b} » inconnue`);
      }
    } else {
      errors.push(`${qid} : type inconnu « ${q.type} »`);
    }
  }

  need(Array.isArray(c.dossiers) && c.dossiers.length === 3, '3 dossiers attendus');
  for (const d of c.dossiers || []) {
    need(d.id && d.titre, `dossier ${d.numero} : id/titre manquant`);
    need(Array.isArray(d.zones) && d.zones.length >= 1, `${d.id} : zones manquantes`);
    for (const z of d.zones || []) {
      for (const s of z.steps || []) {
        if (s.type === 'question') need(questions[s.ref], `${d.id}/${z.id} : question « ${s.ref} » introuvable`);
        if (s.type === 'feuillet') need(c.feuillets && c.feuillets[s.ref], `${d.id}/${z.id} : feuillet « ${s.ref} » introuvable`);
      }
    }
    need(d.alerte && d.alerte.texte, `${d.id} : panneau d'alerte manquant`);
    const nbEngagements = DEBRIEF_ITEMS_ATTENDUS[d.id] ?? 5;
    need(
      d.debrief && Array.isArray(d.debrief.items) && d.debrief.items.length === nbEngagements,
      `${d.id} : débriefing — ${nbEngagements} cases attendues`
    );
  }

  for (const [fid, f] of Object.entries(c.feuillets || {})) {
    need(Array.isArray(f.pages) && f.pages.length >= 2, `feuillet ${fid} : pages manquantes`);
  }

  if (errors.length) {
    console.error(`⚠️ content.json invalide — ${errors.length} erreur(s) :`);
    for (const e of errors) console.error('  · ' + e);
  } else {
    console.info('✅ content.json validé sans erreur.');
  }
  return errors;
}
