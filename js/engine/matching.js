/* Mécanique matching / appariement — tap séquentiel : élément de gauche puis cible.
   Plus fiable sur mobile que le tracé de lignes. Une cible peut accueillir
   plusieurs éléments (cas des catégories ✅ / ❌). */
import { el, shuffle } from '../ui.js';

export function createMatching(q) {
  const pairs = {};     // leftId -> rightId
  let armed = null;     // leftId sélectionné en attente d'une cible
  const leftBtns = new Map();
  const rightBtns = new Map();

  const leftItems = shuffle(q.left);
  const rightItems = q.right.length > 2 ? shuffle(q.right) : q.right;

  const leftCol = el('div', { class: 'opt-list match-left', role: 'group', 'aria-label': 'Éléments à relier' });
  const rightCol = el('div', { class: 'opt-list match-right', role: 'group', 'aria-label': 'Cibles' });
  const root = el('div', {},
    el('p', { class: 'match-instructions', text: '1. Tapez un élément (à gauche) — 2. Tapez sa cible (à droite). Re-tapez un élément relié pour annuler son lien.' }),
    el('div', { class: 'match-duo' },
      el('div', { class: 'match-duo-col' },
        el('div', { class: 'match-col-label', text: 'Situations' }),
        leftCol
      ),
      el('div', { class: 'match-duo-col' },
        el('div', { class: 'match-col-label', text: 'Cibles' }),
        rightCol
      )
    )
  );

  function labelFor(rightId) {
    const r = q.right.find((x) => x.id === rightId);
    const t = r ? r.text : rightId;
    return t.length > 22 ? t.slice(0, 20).trimEnd() + '…' : t;
  }

  function sync() {
    for (const [id, b] of leftBtns) {
      const paired = pairs[id] !== undefined;
      b.classList.toggle('paired', paired);
      b.classList.toggle('selected', armed === id);
      b.setAttribute('aria-pressed', String(armed === id));
      const tag = b.querySelector('.pair-tag');
      if (tag) tag.remove();
      if (paired) b.append(el('span', { class: 'pair-tag', text: '→ ' + labelFor(pairs[id]) }));
    }
    for (const b of rightBtns.values()) b.classList.toggle('target-armed', armed !== null);
  }

  for (const item of leftItems) {
    const btn = el('button', { class: 'opt', 'aria-pressed': 'false' },
      el('span', { class: 'opt-key', 'aria-hidden': 'true', text: item.id }),
      el('span', { text: item.text })
    );
    btn.addEventListener('click', () => {
      if (root.dataset.locked) return;
      if (pairs[item.id] !== undefined) { delete pairs[item.id]; armed = null; }
      else armed = armed === item.id ? null : item.id;
      sync();
    });
    leftBtns.set(item.id, btn);
    leftCol.append(btn);
  }

  for (const target of rightItems) {
    const btn = el('button', { class: 'opt' },
      el('span', { text: target.text })
    );
    btn.addEventListener('click', () => {
      if (root.dataset.locked || armed === null) return;
      pairs[armed] = target.id;
      armed = null;
      sync();
    });
    rightBtns.set(target.id, btn);
    rightCol.append(btn);
  }

  return {
    el: root,
    isComplete: () => Object.keys(pairs).length === q.left.length,
    check: () => q.left.every((item) => pairs[item.id] === q.correct[item.id]),
    flash: (ok) => {
      if (!ok) {
        leftCol.classList.add('wrong-flash');
        setTimeout(() => leftCol.classList.remove('wrong-flash'), 900);
      }
    },
    lock: () => { root.dataset.locked = '1'; },
  };
}
