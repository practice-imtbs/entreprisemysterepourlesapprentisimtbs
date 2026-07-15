/* Utilitaires DOM et micro-interactions */

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v === true) node.setAttribute(k, '');
    else node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

let toastTimer = null;
export function toast(msg, ms = 3200) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Effet machine à écrire (résolu instantanément si reduced motion) */
export function typewriter(node, text, speed = 28) {
  return new Promise((resolve) => {
    if (reducedMotion()) { node.textContent = text; resolve(); return; }
    node.textContent = '';
    let i = 0;
    const cursor = el('span', { class: 'cursor', 'aria-hidden': 'true' });
    node.after(cursor);
    const tick = () => {
      if (!node.isConnected) { cursor.remove(); resolve(); return; }
      node.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, speed);
      else { cursor.remove(); resolve(); }
    };
    tick();
  });
}

/* Tampon animé */
export function stamp(text, color = 'vert') {
  const s = el('span', { class: `stamp ${color} animate`, text });
  return s;
}

/* Scroll doux vers le haut de l'app */
export function scrollTop() {
  window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/* Mélange (Fisher–Yates) — copie */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Encart "Ce qu'il faut retenir" — modal bloquante douce.
   options.success : affiche d'abord un bandeau « Bonne réponse » bien visible. */
export function showRetenir(texte, options = {}) {
  return new Promise((resolve) => {
    const btn = el('button', { class: 'btn-primary', text: 'Compris, continuer' });
    const overlay = el('div', { class: 'retenir-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': options.success ? 'Bonne réponse — ce qu’il faut retenir' : 'Ce qu’il faut retenir' },
      el('div', { class: 'retenir-card' },
        options.success
          ? el('div', { class: 'r-success' },
              stamp('✔ Validé', 'vert'),
              el('span', { text: 'Bonne réponse, agent !' })
            )
          : null,
        el('div', { class: 'r-kicker', text: '💬 Ce qu’il faut retenir' }),
        el('p', { text: texte }),
        btn
      )
    );
    btn.addEventListener('click', () => { overlay.remove(); resolve(); });
    document.body.append(overlay);
    btn.focus();
  });
}

/* Confirmation à deux boutons */
export function confirmDialog(message, okLabel = 'Confirmer', cancelLabel = 'Annuler') {
  return new Promise((resolve) => {
    const ok = el('button', { class: 'btn-primary', text: okLabel });
    const cancel = el('button', { class: 'btn-secondary', text: cancelLabel });
    const overlay = el('div', { class: 'retenir-overlay', role: 'alertdialog', 'aria-modal': 'true' },
      el('div', { class: 'retenir-card' },
        el('p', { text: message }),
        ok, el('div', { class: 'spacer' }), cancel
      )
    );
    ok.addEventListener('click', () => { overlay.remove(); resolve(true); });
    cancel.addEventListener('click', () => { overlay.remove(); resolve(false); });
    document.body.append(overlay);
    cancel.focus();
  });
}
