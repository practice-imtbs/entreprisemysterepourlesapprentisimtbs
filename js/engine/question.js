/* Moteur commun de question : orchestration mécanique + feedback + indice + « retenir » */
import { el, clear, showRetenir, stamp, scrollTop } from '../ui.js';
import { answerRecord, save } from '../state.js';
import { createQCM } from './qcm.js';
import { createVraiFaux } from './vraifaux.js';
import { createOrdre } from './ordre.js';
import { createMatching } from './matching.js';

const TYPE_LABEL = {
  qcm: 'QCM',
  vraifaux: 'Vrai / Faux',
  ordre: 'Remettre dans l’ordre',
  matching: 'Appariement',
};

function createMechanic(q) {
  switch (q.type) {
    case 'qcm': return createQCM(q);
    case 'vraifaux': return createVraiFaux(q);
    case 'ordre': return createOrdre(q);
    case 'matching': return createMatching(q);
    default: throw new Error('Type de question inconnu : ' + q.type);
  }
}

/**
 * Rend une question dans `container`. Appelle onDone() après validation
 * (bonne réponse + encart « retenir » lu).
 */
export function renderQuestion(container, qid, q, zoneLabel, onDone) {
  clear(container);
  const rec = answerRecord(qid);
  const mech = createMechanic(q);

  const feedbackBox = el('div', { 'aria-live': 'polite' });
  const validateBtn = el('button', { class: 'btn-primary', text: 'Valider la réponse' });

  const card = el('div', { class: 'panel q-card' },
    el('div', { class: 'q-meta' },
      el('span', { text: `Question ${q.num}/19 · ${TYPE_LABEL[q.type]}` }),
      el('span', { text: zoneLabel || '' })
    ),
    el('p', { class: 'q-enonce', text: q.enonce }),
    mech.el,
    feedbackBox,
    validateBtn
  );

  validateBtn.addEventListener('click', async () => {
    if (!mech.isComplete()) {
      clear(feedbackBox).append(
        el('div', { class: 'feedback hint', text: 'Complétez votre réponse avant de valider, agent.' })
      );
      return;
    }
    const ok = mech.check();
    rec.attempts += 1;
    mech.flash(ok);

    if (ok) {
      rec.done = true;
      rec.firstTry = rec.attempts === 1;
      save();
      mech.lock();
      validateBtn.disabled = true;
      clear(feedbackBox).append(
        el('div', { class: 'feedback ok' },
          stamp('Validé', 'vert'),
          el('span', { text: ' Bonne réponse, agent.' })
        )
      );
      await showRetenir(q.retenir);
      onDone();
    } else {
      save();
      clear(feedbackBox).append(
        el('div', { class: 'feedback err', text: '✖ Piste incorrecte, agent. Réessayez.' }),
        rec.attempts >= 2 && q.indice
          ? el('div', { class: 'feedback hint' },
              el('span', { text: '🔎 Indice : ' + q.indice })
            )
          : null
      );
    }
  });

  container.append(card);
  scrollTop();
}
