/* Mécanique QCM — sélection simple ou multiple. Options affichées dans l'ordre du contenu (A, B, C, D…) par défaut. */
import { el, shuffle } from '../ui.js';

export function createQCM(q) {
  const selected = new Set();
  const options = q.shuffle ? shuffle(q.options) : q.options;
  const buttons = new Map();

  const list = el('div', { class: 'opt-list', role: 'group', 'aria-label': 'Options de réponse' });
  for (const opt of options) {
    const btn = el('button', { class: 'opt', 'aria-pressed': 'false' },
      el('span', { class: 'opt-key', 'aria-hidden': 'true', text: opt.id }),
      el('span', { text: opt.text })
    );
    btn.addEventListener('click', () => {
      if (list.dataset.locked) return;
      if (q.multi) {
        selected.has(opt.id) ? selected.delete(opt.id) : selected.add(opt.id);
      } else {
        selected.clear();
        selected.add(opt.id);
      }
      for (const [id, b] of buttons) b.setAttribute('aria-pressed', String(selected.has(id)));
    });
    buttons.set(opt.id, btn);
    list.append(btn);
  }

  const consigne = q.multi
    ? el('p', { class: 'match-instructions', text: 'Plusieurs réponses attendues — sélectionnez puis validez.' })
    : null;

  return {
    el: el('div', {}, consigne, list),
    isComplete: () => selected.size >= 1,
    check: () => {
      const want = new Set(q.correct);
      return selected.size === want.size && [...selected].every((s) => want.has(s));
    },
    flash: (ok) => {
      for (const [id, b] of buttons) {
        if (selected.has(id)) b.classList.add(ok ? 'correct-flash' : 'wrong-flash');
      }
      if (!ok) setTimeout(() => { for (const b of buttons.values()) b.classList.remove('wrong-flash'); }, 900);
    },
    lock: () => { list.dataset.locked = '1'; },
  };
}
