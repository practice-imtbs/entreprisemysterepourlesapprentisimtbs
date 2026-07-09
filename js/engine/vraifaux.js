/* Mécanique Vrai / Faux */
import { el } from '../ui.js';

export function createVraiFaux(q) {
  let selected = null; // true | false | null
  const grid = el('div', { class: 'vf-grid', role: 'group', 'aria-label': 'Vrai ou faux' });
  const buttons = new Map();

  for (const val of [true, false]) {
    const btn = el('button', { class: 'opt', 'aria-pressed': 'false', text: val ? 'VRAI' : 'FAUX' });
    btn.addEventListener('click', () => {
      if (grid.dataset.locked) return;
      selected = val;
      for (const [v, b] of buttons) b.setAttribute('aria-pressed', String(v === selected));
    });
    buttons.set(val, btn);
    grid.append(btn);
  }

  return {
    el: grid,
    isComplete: () => selected !== null,
    check: () => selected === q.correct,
    flash: (ok) => {
      const b = buttons.get(selected);
      if (b) b.classList.add(ok ? 'correct-flash' : 'wrong-flash');
      if (!ok) setTimeout(() => b && b.classList.remove('wrong-flash'), 900);
    },
    lock: () => { grid.dataset.locked = '1'; },
  };
}
