/* Mécanique "Remettre dans l'ordre" — glisser-déposer direct (Pointer Events)
   + boutons ▲/▼ accessibles (clavier / sans drag). La liste démarre mélangée ;
   la position courante (1, 2, 3…) est affichée en permanence sur chaque item. */
import { el, shuffle, reducedMotion } from '../ui.js';

export function createOrdre(q) {
  let order = shuffle(q.items).map((it) => it.id); // ids dans l'ordre courant
  let locked = false;

  const list = el('div', { class: 'ordre-list', role: 'list', 'aria-label': 'Étapes à ordonner — glissez ou utilisez les flèches' });
  const root = el('div', {},
    el('p', { class: 'match-instructions', text: 'Glissez les étapes pour les remettre dans le bon ordre (ou utilisez les flèches ▲▼).' }),
    list
  );

  function itemById(id) {
    return q.items.find((it) => it.id === id);
  }

  function render() {
    list.textContent = '';
    order.forEach((id, i) => {
      const item = itemById(id);
      const up = el('button', { class: 'move-btn', type: 'button', 'aria-label': `Monter l'étape : ${item.text}`, disabled: i === 0 || locked, text: '▲' });
      const down = el('button', { class: 'move-btn', type: 'button', 'aria-label': `Descendre l'étape : ${item.text}`, disabled: i === order.length - 1 || locked, text: '▼' });
      up.addEventListener('click', () => move(id, -1));
      down.addEventListener('click', () => move(id, +1));

      const row = el('div', { class: 'ordre-item', role: 'listitem', 'data-id': id },
        el('span', { class: 'drag-handle', 'aria-hidden': 'true', text: '⠿' }),
        el('span', { class: 'ordre-pos', 'aria-hidden': 'true', text: String(i + 1) }),
        el('span', { class: 'ordre-text', text: item.text }),
        el('span', { class: 'move-btns' }, up, down)
      );
      attachDrag(row, id);
      list.append(row);
    });
  }

  function move(id, delta) {
    if (locked) return;
    const i = order.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    render();
    // Restaure le focus sur le bouton équivalent après re-rendu (navigation clavier)
    const row = list.querySelector(`[data-id="${id}"]`);
    if (row) {
      const btn = row.querySelectorAll('.move-btn')[delta < 0 ? 0 : 1];
      if (btn && !btn.disabled) btn.focus();
      else row.querySelector('.move-btn:not([disabled])')?.focus();
    }
  }

  function attachDrag(row, id) {
    const handle = row.querySelector('.drag-handle');
    handle.addEventListener('pointerdown', (e) => {
      if (locked) return;
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      row.classList.add('dragging');
      let startY = e.clientY;

      const onMove = (ev) => {
        row.style.transform = `translateY(${ev.clientY - startY}px)`;
        // Index cible = nombre d'items (hors item saisi) dont le milieu est au-dessus du pointeur
        const others = [...list.querySelectorAll('.ordre-item')].filter((r) => r !== row);
        let target = others.length;
        for (let k = 0; k < others.length; k++) {
          const r = others[k].getBoundingClientRect();
          if (ev.clientY < r.top + r.height / 2) { target = k; break; }
        }
        const cur = order.indexOf(id);
        if (target !== cur) {
          order.splice(cur, 1);
          order.splice(target, 0, id);
          reorderDom(row);
          // L'item vient d'être déplacé dans le DOM : on repart de la position actuelle du pointeur
          startY = ev.clientY;
          row.style.transform = '';
        }
      };
      const onUp = () => {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
        row.classList.remove('dragging');
        row.style.transform = '';
        render();
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    });
  }

  function reorderDom(draggedRow) {
    const rows = new Map([...list.querySelectorAll('.ordre-item')].map((r) => [r.dataset.id, r]));
    order.forEach((oid, i) => {
      const r = rows.get(oid);
      if (r && list.children[i] !== r) list.insertBefore(r, list.children[i] || null);
      const pos = r && r.querySelector('.ordre-pos');
      if (pos) pos.textContent = String(i + 1);
      if (r && !reducedMotion() && r !== draggedRow) {
        r.classList.add('shifted');
        setTimeout(() => r.classList.remove('shifted'), 180);
      }
    });
  }

  render();

  return {
    el: root,
    isComplete: () => true, // la liste est complète par construction
    check: () => order.length === q.correct.length && order.every((id, i) => id === q.correct[i]),
    flash: (ok) => {
      if (!ok) {
        list.classList.add('wrong-flash');
        setTimeout(() => list.classList.remove('wrong-flash'), 900);
      }
    },
    lock: () => { locked = true; render(); },
  };
}
