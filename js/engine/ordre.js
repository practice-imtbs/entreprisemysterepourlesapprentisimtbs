/* Mécanique "Remettre dans l'ordre" — interaction par taps (fiable mobile + accessible).
   On tape les éléments dans l'ordre voulu ; un tap sur un élément placé le retire. */
import { el, shuffle } from '../ui.js';

export function createOrdre(q) {
  const sequence = []; // ids dans l'ordre choisi
  const items = shuffle(q.items);
  const buttons = new Map();

  const slots = el('div', { class: 'ordre-slots', 'aria-live': 'polite', 'aria-label': 'Votre ordre' });
  const list = el('div', { class: 'opt-list', role: 'group', 'aria-label': 'Étapes à ordonner' });

  function renderSlots() {
    slots.textContent = '';
    if (!sequence.length) {
      slots.append(el('span', { class: 'placeholder', text: 'Tapez les étapes dans l’ordre choisi ↓ (re-tapez une étape placée pour la retirer)' }));
      return;
    }
    sequence.forEach((id, i) => {
      const item = q.items.find((it) => it.id === id);
      const chip = el('button', { class: 'slot', type: 'button', 'aria-label': `Retirer l'étape ${i + 1} : ${item.text}` },
        el('span', { class: 'n', text: String(i + 1) }),
        el('span', { text: shortText(item.text) })
      );
      chip.addEventListener('click', () => {
        if (slots.dataset.locked) return;
        sequence.splice(sequence.indexOf(id), 1);
        sync();
      });
      slots.append(chip);
    });
  }

  function shortText(t) {
    return t.length > 46 ? t.slice(0, 44).trimEnd() + '…' : t;
  }

  function sync() {
    renderSlots();
    for (const [id, b] of buttons) {
      const placed = sequence.includes(id);
      b.classList.toggle('selected', placed);
      b.setAttribute('aria-pressed', String(placed));
      const tag = b.querySelector('.pair-tag');
      if (tag) tag.remove();
      if (placed) {
        b.append(el('span', { class: 'pair-tag', text: '#' + (sequence.indexOf(id) + 1) }));
      }
    }
  }

  for (const item of items) {
    const btn = el('button', { class: 'opt', 'aria-pressed': 'false' },
      el('span', { class: 'opt-key', 'aria-hidden': 'true', text: '↕' }),
      el('span', { text: item.text })
    );
    btn.addEventListener('click', () => {
      if (slots.dataset.locked) return;
      if (sequence.includes(item.id)) sequence.splice(sequence.indexOf(item.id), 1);
      else sequence.push(item.id);
      sync();
    });
    buttons.set(item.id, btn);
    list.append(btn);
  }
  renderSlots();

  return {
    el: el('div', { class: 'match-left' }, slots, list),
    isComplete: () => sequence.length === q.items.length,
    check: () => sequence.length === q.correct.length && sequence.every((id, i) => id === q.correct[i]),
    flash: (ok) => {
      if (!ok) {
        slots.classList.add('wrong-flash');
        setTimeout(() => slots.classList.remove('wrong-flash'), 900);
      }
    },
    lock: () => { slots.dataset.locked = '1'; },
  };
}
