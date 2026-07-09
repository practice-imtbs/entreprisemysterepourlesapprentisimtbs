/* Panneau d'alerte non zappable : plein écran, bouton "Bien reçu" après délai de lecture */
import { el } from '../ui.js';

const PROGRAMME_LABEL = { bachelor: 'Bachelor', pge: 'PGE' };

export function showAlerte(alerte, delaiSec, programme, onDone) {
  const btn = el('button', { class: 'btn-primary hidden', text: 'Bien reçu' });
  const wait = el('div', { class: 'a-wait', 'aria-live': 'polite' });

  let echeanceBox = null;
  if (alerte.echeanceParProgramme && programme && alerte.echeanceParProgramme[programme]) {
    echeanceBox = el('div', { class: 'a-echeance' },
      `👉 Votre échéance (${PROGRAMME_LABEL[programme]}) : ${alerte.echeanceParProgramme[programme]}`
    );
  }

  const screen = el('div', { class: 'alerte-screen', role: 'alertdialog', 'aria-modal': 'true', 'aria-label': alerte.titre },
    el('div', { class: 'alerte-card' },
      el('div', { class: 'a-head' },
        el('span', { class: 'a-beacon', 'aria-hidden': 'true' }),
        el('span', { text: '⚡ ' + alerte.titre })
      ),
      el('p', { class: 'a-texte', text: alerte.texte }),
      echeanceBox,
      wait,
      btn
    )
  );

  let remaining = Math.max(1, Number(delaiSec) || 8);
  wait.textContent = `Lecture en cours… ${remaining} s`;
  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      wait.textContent = '';
      btn.classList.remove('hidden');
      btn.focus();
    } else {
      wait.textContent = `Lecture en cours… ${remaining} s`;
    }
  }, 1000);

  btn.addEventListener('click', () => {
    screen.remove();
    onDone();
  });

  document.body.append(screen);
}
