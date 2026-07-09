/* Mur de post-it : tableau liège, retournement au tap, compteur x/6 */
import { el, clear } from '../ui.js';
import { state, save } from '../state.js';

export function renderPostits(container, dossierId, postitsDef, onDone) {
  clear(container);
  const ds = state.dossiers[dossierId];
  const total = postitsDef.items.length;

  const counter = el('p', { class: 'center mono dim', 'aria-live': 'polite' });
  const continueBtn = el('button', { class: 'btn-primary', text: 'Poursuivre la mission' });

  function refreshMeta() {
    const n = ds.postits.length;
    counter.textContent = `Post-it consultés : ${n}/${total}`;
    continueBtn.disabled = n < total;
  }

  const board = el('div', { class: 'corkboard', role: 'group', 'aria-label': 'Mur de post-it' });
  postitsDef.items.forEach((p, i) => {
    const flipped = ds.postits.includes(p.id);
    const note = el('button', {
      class: `postit ${p.couleur}${flipped ? ' flipped' : ''}`,
      style: `--tilt:${(i % 3 - 1) * 2.2}deg`,
      'aria-expanded': String(flipped),
      'aria-label': `Post-it : ${p.titre}`,
    });
    const front = () => el('span', { class: 'p-front' },
      el('span', { text: p.titre }),
      el('span', { class: 'p-hint', text: 'Tapez pour retourner' })
    );
    const back = () => el('span', { class: 'p-back' },
      el('strong', { text: p.titre }),
      el('span', { text: p.texte })
    );
    note.append(flipped ? back() : front());
    note.addEventListener('click', () => {
      if (ds.postits.includes(p.id)) return;
      ds.postits.push(p.id);
      save();
      note.classList.add('flipped');
      note.setAttribute('aria-expanded', 'true');
      clear(note).append(back());
      refreshMeta();
    });
    board.append(note);
  });

  continueBtn.addEventListener('click', onDone);
  refreshMeta();

  container.append(
    el('div', { class: 'panel' },
      el('h2', { class: 'stamp-title', text: '🗒️ ' + postitsDef.titre }),
      el('p', { class: 'dim small', text: postitsDef.consigne }),
      board,
      el('div', { class: 'spacer' }),
      counter,
      continueBtn
    )
  );
}
