/* Dossier kraft à feuilleter : navigation par flèches + balayage, poursuite après la dernière page */
import { el, clear, scrollTop } from '../ui.js';

export function renderFeuillet(container, feuillet, onDone) {
  clear(container);
  let page = 0;
  let maxSeen = 0;
  const total = feuillet.pages.length;

  const pageBox = el('div', { class: 'feuillet-pages', 'aria-live': 'polite' });
  const dots = el('div', { class: 'feuillet-dots', 'aria-hidden': 'true' });
  const prevBtn = el('button', { class: 'btn-ghost', text: '← Page préc.' });
  const nextBtn = el('button', { class: 'btn-secondary', text: 'Page suiv. →' });
  const doneBtn = el('button', { class: 'btn-primary', text: 'Dossier consulté — poursuivre' });

  function renderPage() {
    const p = feuillet.pages[page];
    clear(pageBox).append(
      el('div', { class: 'feuillet-page' },
        el('div', { class: 'f-page-num', text: `Page ${page + 1} / ${total}` }),
        el('h3', { text: p.titre }),
        el('p', { text: p.texte })
      )
    );
    clear(dots);
    for (let i = 0; i < total; i++) {
      dots.append(el('span', { class: `dot${i <= maxSeen ? ' seen' : ''}${i === page ? ' current' : ''}` }));
    }
    prevBtn.disabled = page === 0;
    nextBtn.classList.toggle('hidden', page === total - 1);
    doneBtn.classList.toggle('hidden', !(page === total - 1 && maxSeen === total - 1));
  }

  function go(delta) {
    page = Math.min(total - 1, Math.max(0, page + delta));
    maxSeen = Math.max(maxSeen, page);
    renderPage();
  }

  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));
  doneBtn.addEventListener('click', onDone);

  /* Balayage tactile */
  let touchX = null;
  pageBox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  pageBox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  container.append(
    el('div', { class: 'kraft-folder' },
      el('h2', { class: 'stamp-title', style: 'font-size:1.05rem', text: '📋 ' + feuillet.titre }),
      pageBox,
      el('div', { class: 'feuillet-nav' }, prevBtn, dots, nextBtn),
      el('div', { class: 'spacer' }),
      doneBtn
    )
  );
  renderPage();
  scrollTop();
}
