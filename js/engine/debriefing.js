/* Rapport de débriefing : 5 cases à cocher à la 1re personne, validation exigeant les 5 */
import { el, clear, stamp, scrollTop } from '../ui.js';

export function renderDebrief(container, debrief, onDone) {
  clear(container);
  const checks = new Set();
  const validateBtn = el('button', { class: 'btn-primary', text: 'Valider le rapport', disabled: true });

  const list = el('div', { class: 'debrief-list' });
  debrief.items.forEach((texte, i) => {
    const cb = el('input', { type: 'checkbox', id: `deb-${i}` });
    cb.addEventListener('change', () => {
      cb.checked ? checks.add(i) : checks.delete(i);
      validateBtn.disabled = checks.size !== debrief.items.length;
    });
    list.append(
      el('label', { class: 'debrief-item', for: `deb-${i}` },
        cb,
        el('span', { text: texte })
      )
    );
  });

  validateBtn.addEventListener('click', () => {
    validateBtn.replaceWith(stamp('Classé', 'vert'));
    setTimeout(onDone, 650);
  });

  container.append(
    el('div', { class: 'paper' },
      el('h2', { class: 'stamp-title', style: 'font-size:1.1rem', text: '✅ ' + debrief.titre }),
      el('p', { class: 'small', style: 'color:#6B5A2E', text: debrief.consigne }),
      list,
      validateBtn
    )
  );
  scrollTop();
}
