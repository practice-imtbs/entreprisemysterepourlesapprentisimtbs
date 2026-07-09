/* L'Entreprise Mystère — orchestration des écrans */
import { el, clear, toast, typewriter, confirmDialog, scrollTop } from './ui.js';
import {
  state, save, loadSaved, adoptSaved, resetState, hasProgress,
  initDossiers, questionDone, stats,
} from './state.js';
import { validateContent } from './validate.js';
import { renderQuestion } from './engine/question.js';
import { renderPostits } from './engine/postit.js';
import { renderFeuillet } from './engine/dossier-feuillete.js';
import { showAlerte } from './engine/alerte.js';
import { renderDebrief } from './engine/debriefing.js';
import { exportAgentCard } from './export.js';

let content = null;
const app = document.getElementById('app');
const dockbar = document.getElementById('dockbar');
let chronoTimer = null;
let impatienceToastShown = {};

const PROGRAMME_LABEL = { bachelor: 'Bachelor', pge: 'PGE' };

/* ============================ Initialisation ============================ */

async function boot() {
  if (new URLSearchParams(location.search).get('mode') === 'animateur') {
    location.replace('animateur.html');
    return;
  }
  try {
    const res = await fetch('content/content.json');
    content = await res.json();
  } catch (e) {
    app.textContent = 'Erreur de chargement du contenu. Vérifiez votre connexion puis rechargez la page.';
    console.error(e);
    return;
  }
  validateContent(content);

  const saved = loadSaved();
  if (hasProgress(saved)) {
    adoptSaved(saved);
    initDossiers(content);
    renderResumeChoice();
  } else {
    initDossiers(content);
    render();
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

/* ============================ Routage ============================ */

function render() {
  clearInterval(chronoTimer);
  clear(app);
  dockbar.hidden = state.screen === 'welcome' || state.screen === 'intro';
  switch (state.screen) {
    case 'welcome': renderWelcome(); break;
    case 'intro': renderIntro(); break;
    case 'hub': renderHub(); break;
    case 'dossier': renderDossier(); break;
    case 'final': renderFinal(); break;
    default: state.screen = 'welcome'; renderWelcome();
  }
  scrollTop();
}

function go(screen, extra = {}) {
  state.screen = screen;
  Object.assign(state, extra);
  save();
  render();
}

/* ============================ Écran de reprise ============================ */

function renderResumeChoice() {
  clear(app);
  dockbar.hidden = true;
  const resume = el('button', { class: 'btn-primary', text: '▶ Reprendre la mission' });
  const restart = el('button', { class: 'btn-secondary', text: 'Nouvelle mission' });

  resume.addEventListener('click', () => render());
  restart.addEventListener('click', async () => {
    const ok = await confirmDialog(
      'Cette action efface la progression enregistrée sur cet appareil. Continuer ?',
      'Effacer et recommencer'
    );
    if (ok) {
      resetState();
      initDossiers(content);
      save();
      render();
    }
  });

  const agents = state.agents.filter(Boolean).join(' & ');
  app.append(
    el('div', { class: 'welcome-hero' },
      emblem(),
      el('h1', { text: content.meta.titre }),
      el('p', { class: 'dim', text: agents ? `Une mission est en cours — binôme : ${agents}` : 'Une mission est en cours sur cet appareil.' })
    ),
    el('div', { class: 'resume-choice' }, resume, restart)
  );
}

/* ============================ Accueil ============================ */

function emblem() {
  const wrap = el('div', { class: 'agency-emblem', 'aria-hidden': 'true' });
  wrap.innerHTML = `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Emblème de l'Agence de l'Alternance">
    <circle cx="60" cy="60" r="56" fill="none" stroke="#AD1D89" stroke-width="4"/>
    <circle cx="60" cy="60" r="47" fill="none" stroke="#00B8DE" stroke-width="1.6" stroke-dasharray="4 5"/>
    <g stroke="#E8EDF6" stroke-width="4.5" fill="none" stroke-linecap="round">
      <circle cx="53" cy="53" r="18"/>
      <line x1="66" y1="66" x2="82" y2="82"/>
    </g>
    <path d="M53 45 v16 M45 53 h16" stroke="#00B8DE" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
  return wrap;
}

function renderWelcome() {
  const in1 = el('input', { type: 'text', maxlength: '30', id: 'agent1', autocomplete: 'off', value: state.agents[0] || '' });
  const in2 = el('input', { type: 'text', maxlength: '30', id: 'agent2', autocomplete: 'off', value: state.agents[1] || '' });
  let programme = state.programme;

  const bBach = el('button', { class: 'choice', 'aria-pressed': String(programme === 'bachelor'), text: 'Bachelor' });
  const bPGE = el('button', { class: 'choice', 'aria-pressed': String(programme === 'pge'), text: 'PGE' });
  const pick = (p) => {
    programme = p;
    bBach.setAttribute('aria-pressed', String(p === 'bachelor'));
    bPGE.setAttribute('aria-pressed', String(p === 'pge'));
  };
  bBach.addEventListener('click', () => pick('bachelor'));
  bPGE.addEventListener('click', () => pick('pge'));

  const startBtn = el('button', { class: 'btn-primary', text: '🕵️ Démarrer la mission' });
  startBtn.addEventListener('click', () => {
    const a1 = in1.value.trim().slice(0, 30);
    const a2 = in2.value.trim().slice(0, 30);
    if (!a1) { toast('Indiquez au moins le prénom de l’agent n°1.'); in1.focus(); return; }
    if (!programme) { toast('Sélectionnez votre programme : Bachelor ou PGE.'); return; }
    state.agents = [a1, a2];
    state.programme = programme;
    state.startedAt = Date.now();
    go('intro');
  });

  app.append(
    el('div', { class: 'welcome-hero' },
      emblem(),
      el('div', { class: 'confidentiel' }, el('span', { class: 'stamp rouge', text: 'Confidentiel' })),
      el('h1', { text: content.meta.titre }),
      el('p', { class: 'dim small', text: content.meta.sousTitre })
    ),
    el('div', { class: 'panel' },
      el('div', { class: 'field' }, el('label', { for: 'agent1', text: 'Agent n°1 — prénom' }), in1),
      el('div', { class: 'field' }, el('label', { for: 'agent2', text: 'Agent n°2 — prénom (optionnel)' }), in2),
      el('div', { class: 'field' },
        el('label', { text: 'Votre programme' }),
        el('div', { class: 'programme-choice' }, bBach, bPGE)
      ),
      startBtn
    ),
    el('footer', { class: 'mentions' },
      el('div', { class: 'logo-chip' }, el('img', { src: 'assets/img/logo-imtbs.png', alt: 'IMT Business School' })),
      el('p', {},
        content.mentions.footer, el('br'),
        el('a', { href: 'mailto:' + content.meta.contactMail, text: content.meta.contactMail }), el('br'),
        content.mentions.donnees
      )
    )
  );
}

/* ============================ Intro narrative ============================ */

function renderIntro() {
  const agents = state.agents.filter(Boolean);
  const dest = agents.length > 1 ? `Agents ${agents.join(' & ')}` : `Agent ${agents[0] || ''}`;

  const msgP = el('p', { class: 'telex-msg' });
  const nextBtn = el('button', { class: 'btn-primary hidden', text: 'Message suivant' });
  const skipBtn = el('button', { class: 'btn-ghost', text: 'Passer l’introduction ≫' });

  let idx = 0;
  let cancelled = false;

  async function playMessage() {
    nextBtn.classList.add('hidden');
    await typewriter(msgP, content.intro.messages[idx]);
    if (cancelled) return;
    nextBtn.textContent = idx < content.intro.messages.length - 1 ? 'Message suivant' : 'Ouvrir le tableau de bord';
    nextBtn.classList.remove('hidden');
  }

  nextBtn.addEventListener('click', () => {
    idx += 1;
    if (idx >= content.intro.messages.length) { go('hub'); return; }
    playMessage();
  });
  skipBtn.addEventListener('click', () => { cancelled = true; go('hub'); });

  app.append(
    el('div', { class: 'telex' },
      el('div', { class: 'telex-paper' },
        el('div', { class: 'telex-head', text: `TÉLEX ENTRANT — QG → ${dest}` }),
        msgP
      ),
      el('div', { class: 'spacer' }),
      nextBtn,
      el('div', { class: 'spacer' }),
      skipBtn
    )
  );
  playMessage();
}

/* ============================ Hub ============================ */

function dossierProgress(d) {
  const qids = d.zones.flatMap((z) => z.steps.filter((s) => s.type === 'question').map((s) => s.ref));
  const done = qids.filter((q) => questionDone(q)).length;
  return { done, total: qids.length };
}

function renderHub() {
  const agents = state.agents.filter(Boolean);
  const totalQ = Object.keys(content.questions).length;
  const doneQ = Object.keys(content.questions).filter((q) => questionDone(q)).length;
  const pct = Math.round((doneQ / totalQ) * 100);

  const head = el('div', { class: 'screen-head' },
    el('div', { class: 'kicker', text: 'QG — Tableau de bord de l’agence' }),
    el('h1', { text: 'Vos dossiers de mission' })
  );

  const banner = el('div', { class: 'agents-banner' },
    ...agents.map((a) => el('span', { class: 'badge', text: '🕵️ ' + a })),
    el('span', { text: PROGRAMME_LABEL[state.programme] || '' })
  );

  const progress = el('div', { class: 'progress-global' },
    el('div', { class: 'progress-track', role: 'progressbar', 'aria-valuenow': String(pct), 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': 'Progression globale' },
      el('div', { class: 'progress-fill', style: `width:${pct}%` })
    ),
    el('div', { class: 'progress-label', text: `Progression : ${doneQ}/${totalQ} questions · ${pct} %` })
  );

  const cards = content.dossiers.map((d) => {
    const ds = state.dossiers[d.id];
    const p = dossierProgress(d);
    let stateCls = 'locked';
    let stateNode;
    if (ds.done) {
      stateCls = 'done';
      stateNode = el('span', {}, el('span', { class: 'led on' }), el('span', { class: 'stamp vert', style: 'font-size:.72rem', text: 'Classé' }));
    } else if (!ds.unlocked) {
      stateNode = el('span', { class: 'mono', text: '🔒 Accès refusé' });
    } else if (p.done > 0 || ds.postits.length > 0) {
      stateCls = 'available';
      stateNode = el('span', {}, el('span', { class: 'led' }), el('span', { class: 'mono', text: `En cours ${p.done}/${p.total}` }));
    } else {
      stateCls = 'available';
      stateNode = el('span', { class: 'stamp kraft', style: 'font-size:.72rem', text: 'À traiter' });
    }

    const card = el('button', { class: `dossier-card ${stateCls}`, 'aria-label': `Dossier ${d.numero} : ${d.titre}` },
      el('span', { class: 'd-icon', 'aria-hidden': 'true', text: ds.done ? '📁' : ds.unlocked ? '🗂️' : '🔒' }),
      el('span', {},
        el('span', { class: 'd-num', text: `Dossier n°${d.numero}` }),
        el('span', { class: 'd-title', style: 'display:block', text: d.titre }),
        el('span', { class: 'd-theme', text: d.theme })
      ),
      el('span', { class: 'd-state' }, stateNode)
    );
    card.addEventListener('click', () => {
      if (!ds.unlocked) { toast('Accès refusé, agent. Terminez d’abord le dossier précédent.'); return; }
      if (ds.done) { toast('Dossier classé ✔ — mission déjà accomplie.'); return; }
      openDossier(d.id);
    });
    return card;
  });

  const allDone = content.dossiers.every((d) => state.dossiers[d.id].done);
  const finalBtn = allDone
    ? el('button', { class: 'btn-primary', text: '🏆 Accéder à la conférence de presse' })
    : null;
  if (finalBtn) finalBtn.addEventListener('click', () => go('final'));

  app.append(head, banner, progress, ...cards, finalBtn || '',
    el('p', { class: 'center dim small', text: '📅 Calendrier et 📞 annuaire : disponibles à tout moment dans la barre ci-dessous.' })
  );
}

/* ============================ Dossier ============================ */

function openDossier(id) {
  const ds = state.dossiers[id];
  if (!ds.start) ds.start = Date.now();
  state.dossierId = id;
  state.view = null;
  go('dossier');
}

function dossierDef() {
  return content.dossiers.find((d) => d.id === state.dossierId);
}

function computeView(d, ds) {
  if (d.postits && ds.postits.length < d.postits.items.length) return { kind: 'postits' };
  const allZonesDone = d.zones.every((z) => ds.zoneStep[z.id] >= z.steps.length);
  if (!allZonesDone) return state.view && state.view.kind === 'zone' ? state.view : { kind: 'zones' };
  if (!ds.alerteVue) return { kind: 'alerte' };
  if (d.messagesQG && ds.qgIdx < d.messagesQG.length) return { kind: 'qg' };
  if (!ds.debriefFait) return { kind: 'debrief' };
  if (d.transition) return { kind: 'transition' };
  return { kind: 'exit' };
}

function renderDossier() {
  const d = dossierDef();
  if (!d) { go('hub'); return; }
  const ds = state.dossiers[d.id];
  const view = computeView(d, ds);
  state.view = view;
  save();

  switch (view.kind) {
    case 'postits': return viewPostits(d, ds);
    case 'zones': return viewZones(d, ds);
    case 'zone': return viewZone(d, ds, view.zoneId);
    case 'alerte': return viewAlerte(d, ds);
    case 'qg': return viewQG(d, ds);
    case 'debrief': return viewDebrief(d, ds);
    case 'transition': return viewTransition(d, ds);
    default: go('hub');
  }
}

function dossierHead(d, sub) {
  return el('div', { class: 'screen-head' },
    el('div', { class: 'kicker', text: `Dossier n°${d.numero} — ${d.titre}` }),
    el('h1', { style: 'font-size:1.25rem', text: sub }),
    el('p', { class: 'sub', text: d.theme })
  );
}

function startChrono(d, ds, node) {
  clearInterval(chronoTimer);
  const target = (content.meta.dureeCibleMinParDossier || 15) * 60000;
  const tick = () => {
    if (!node.isConnected) { clearInterval(chronoTimer); return; }
    const ms = Date.now() - ds.start;
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const over = ms > target;
    node.classList.toggle('over', over);
    node.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}${over ? ' — Le QG s’impatiente…' : ''}`;
    if (over && !impatienceToastShown[d.id]) {
      impatienceToastShown[d.id] = true;
      toast('Le QG s’impatiente… (sans conséquence, agents — prenez le temps qu’il faut)');
    }
  };
  tick();
  chronoTimer = setInterval(tick, 1000);
}

function viewPostits(d, ds) {
  clear(app);
  const chrono = el('div', { class: 'chrono' });
  app.append(dossierHead(d, 'Activité d’ouverture'), chrono);
  startChrono(d, ds, chrono);
  const holder = el('div');
  app.append(holder);
  renderPostits(holder, d.id, d.postits, () => { state.view = { kind: 'zones' }; save(); render(); });
}

function viewZones(d, ds) {
  clear(app);
  const chrono = el('div', { class: 'chrono' });
  app.append(dossierHead(d, d.zonesTitre), chrono);
  startChrono(d, ds, chrono);

  const grid = el('div', { class: 'zones-grid' });
  for (const z of d.zones) {
    const total = z.steps.length;
    const done = ds.zoneStep[z.id];
    const complete = done >= total;
    const card = el('button', {
      class: `zone-card${complete ? ' done' : ''}${z.fragment !== undefined ? ' zone-alerte ' + z.id : ''}`,
      'aria-label': `${z.nom} — ${complete ? 'terminé' : 'étape ' + (done + 1) + ' sur ' + total}`,
    },
      el('span', { class: 'z-icon', 'aria-hidden': 'true', text: z.icon }),
      el('span', { class: 'z-nom', text: z.nom }),
      el('span', { class: 'z-status' },
        el('span', { class: `led${complete ? ' on' : ''}` }),
        complete ? 'Sécurisé ✔' : done > 0 ? `En cours ${done}/${total}` : 'À explorer'
      )
    );
    card.addEventListener('click', () => {
      if (complete) { toast('Zone déjà sécurisée, agent.'); return; }
      state.view = { kind: 'zone', zoneId: z.id };
      save();
      render();
    });
    grid.append(card);
  }

  app.append(
    el('div', { class: `decor ${d.decor}` },
      el('p', { class: 'dim small', text: d.zonesConsigne }),
      grid
    ),
    d.id === 'd3' ? fragmentTracker() : '',
    el('p', { class: 'center dim small', text: d.objectif })
  );
}

function fragmentTracker() {
  const parts = content.meta.fragments.map((f, i) =>
    state.fragments[i] ? f : '▓'.repeat(f.length)
  );
  return el('div', { class: 'fragment-reveal' },
    el('div', { class: 'dim small', text: 'Code d’accès à la finale' }),
    el('div', { class: 'code-display', 'aria-label': 'Fragments du code', text: parts.join(' ') })
  );
}

function viewZone(d, ds, zoneId) {
  const z = d.zones.find((x) => x.id === zoneId);
  if (!z || ds.zoneStep[zoneId] >= z.steps.length) {
    state.view = { kind: 'zones' };
    save();
    render();
    return;
  }
  clear(app);
  const chrono = el('div', { class: 'chrono' });
  const back = el('button', { class: 'btn-ghost', text: `← Retour au ${d.decor === 'campus' ? 'plan du campus' : d.decor === 'openspace' ? 'plateau Nexus Corp' : 'tableau de crise'}` });
  back.addEventListener('click', () => { state.view = { kind: 'zones' }; save(); render(); });

  app.append(dossierHead(d, `${z.icon} ${z.nom}`), chrono, back, el('div', { class: 'spacer' }));
  startChrono(d, ds, chrono);

  const holder = el('div');
  app.append(holder);

  const step = z.steps[ds.zoneStep[zoneId]];
  const advance = () => {
    ds.zoneStep[zoneId] += 1;
    const zoneComplete = ds.zoneStep[zoneId] >= z.steps.length;
    if (zoneComplete && z.fragment !== undefined && !state.fragments[z.fragment]) {
      state.fragments[z.fragment] = true;
      save();
      showFragmentReveal(z.fragment, () => { state.view = { kind: 'zones' }; save(); render(); });
      return;
    }
    state.view = zoneComplete ? { kind: 'zones' } : { kind: 'zone', zoneId };
    save();
    render();
  };

  if (step.type === 'question') {
    renderQuestion(holder, step.ref, content.questions[step.ref], z.nom, advance);
  } else if (step.type === 'feuillet') {
    renderFeuillet(holder, content.feuillets[step.ref], advance);
  }
}

function showFragmentReveal(index, onDone) {
  clear(app);
  const parts = content.meta.fragments.map((f, i) => (state.fragments[i] ? f : '▓'.repeat(f.length)));
  const btn = el('button', { class: 'btn-primary', text: 'Retour au tableau de crise' });
  btn.addEventListener('click', onDone);
  app.append(
    el('div', { class: 'panel center', style: 'margin-top:14vh' },
      el('h2', { class: 'stamp-title', text: '🔓 Alerte désamorcée' }),
      el('p', { class: 'dim', text: 'Fragment du code d’accès déchiffré :' }),
      el('div', { class: 'fragment-reveal' },
        el('div', { class: 'code-display', text: parts.join(' ') })
      ),
      btn
    )
  );
  scrollTop();
}

function viewAlerte(d, ds) {
  clear(app);
  app.append(dossierHead(d, 'Transmission prioritaire entrante…'));
  showAlerte(d.alerte, content.meta.alerteDelaiSec, state.programme, () => {
    ds.alerteVue = true;
    save();
    render();
  });
}

function viewQG(d, ds) {
  clear(app);
  const msg = d.messagesQG[ds.qgIdx];
  const btn = el('button', { class: 'btn-primary', text: 'Message lu — continuer' });
  btn.addEventListener('click', () => { ds.qgIdx += 1; save(); render(); });
  app.append(
    dossierHead(d, 'Messagerie sécurisée'),
    el('div', { class: 'qg-message' },
      el('div', { class: 'qg-head', text: '📨 Message reçu de : ' + msg.de }),
      el('div', { class: 'qg-body', text: msg.texte })
    ),
    el('div', { class: 'spacer' }),
    btn
  );
}

function viewDebrief(d, ds) {
  clear(app);
  app.append(dossierHead(d, 'Rapport de débriefing'));
  const holder = el('div');
  app.append(holder);
  renderDebrief(holder, d.debrief, () => {
    ds.debriefFait = true;
    ds.end = Date.now();
    const idx = content.dossiers.findIndex((x) => x.id === d.id);
    const next = content.dossiers[idx + 1];
    if (next) state.dossiers[next.id].unlocked = true;
    if (!next) {
      ds.done = !d.transition ? true : ds.done;
      state.finishedAt = Date.now();
    }
    if (!d.transition) ds.done = true;
    save();
    render();
  });
}

function viewTransition(d, ds) {
  clear(app);
  const btn = el('button', { class: 'btn-primary', text: 'Retour au tableau de bord' });
  btn.addEventListener('click', () => {
    ds.done = true;
    state.dossierId = null;
    state.view = null;
    save();
    go('hub');
  });
  app.append(
    dossierHead(d, 'Messagerie sécurisée'),
    el('div', { class: 'qg-message' },
      el('div', { class: 'qg-head', text: '📨 Message reçu de : ' + d.transition.de }),
      el('div', { class: 'qg-body', text: d.transition.texte })
    ),
    el('div', { class: 'spacer' }),
    btn
  );
}

/* ============================ Écran final ============================ */

function renderFinal() {
  // Sécurise l'état : le dossier 3 est bien terminé
  const d3 = state.dossiers.d3;
  if (d3 && d3.debriefFait && !d3.done) { d3.done = true; save(); }

  const s = stats(content);
  const agents = state.agents.filter(Boolean);
  const now = state.finishedAt ? new Date(state.finishedAt) : new Date();

  const exportPreview = el('div');
  const exportBtn = el('button', { class: 'btn-primary', text: '⬇️ Télécharger mon rapport de mission (PNG)' });
  exportBtn.addEventListener('click', () => exportAgentCard(content, exportPreview));

  const resetBtn = el('button', { class: 'btn-ghost', text: 'Réinitialiser la mission (nouveau binôme)' });
  resetBtn.addEventListener('click', async () => {
    const ok1 = await confirmDialog('Réinitialiser efface toute la progression de ce binôme sur cet appareil. Continuer ?', 'Oui, réinitialiser');
    if (!ok1) return;
    const ok2 = await confirmDialog('Dernière confirmation : effacer définitivement la partie ?', 'Effacer définitivement');
    if (!ok2) return;
    resetState();
    initDossiers(content);
    save();
    render();
  });

  app.append(
    el('div', { class: 'screen-head' },
      el('div', { class: 'kicker', text: 'Accréditation délivrée' }),
      el('h1', { text: '🏆 ' + content.final.titre })
    ),
    el('p', { class: 'center dim', text: content.final.messageCode }),
    el('div', { class: 'final-code', 'aria-label': 'Code d’accès : ' + content.meta.codeFinal, text: content.meta.codeFinal.split('').join(' ') }),

    el('div', { class: 'agent-card-preview' },
      el('div', { class: 'acp-head' },
        el('span', { text: 'Carte d’agent' }),
        el('span', { text: content.meta.annee })
      ),
      el('h2', { style: 'font-size:1.3rem', text: agents.join(' & ') || 'Agent' }),
      el('p', { class: 'dim small', text: `${PROGRAMME_LABEL[state.programme] || ''} · ${content.final.accreditation} · ${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` }),
      el('div', { class: 'stats-grid' },
        el('div', { class: 'stat-tile' }, el('div', { class: 'v', text: `${s.firstTry}/${s.total}` }), el('div', { class: 'l', text: 'du premier coup' })),
        ...s.perDossier.map((pd) =>
          el('div', { class: 'stat-tile' }, el('div', { class: 'v', text: pd.minutes !== null ? pd.minutes + ' min' : '—' }), el('div', { class: 'l', text: `Dossier ${pd.numero}` }))
        )
      ),
      exportBtn,
      exportPreview
    ),

    el('div', { class: 'qg-message' },
      el('div', { class: 'qg-head', text: '📨 Message reçu de : QG · Agence de l’Alternance' }),
      el('div', { class: 'qg-body' },
        el('p', { text: content.final.transition }),
        el('p', { style: 'margin:0', text: '📅 ' + content.final.rappel })
      )
    ),
    el('div', { class: 'reset-zone' }, resetBtn)
  );
}

/* ============================ Overlays permanents ============================ */

let overlayNode = null;

function closeOverlay() {
  if (overlayNode) { overlayNode.remove(); overlayNode = null; }
}

function openOverlay(title, sub, bodyNode) {
  closeOverlay();
  const closeBtn = el('button', { class: 'o-close', 'aria-label': 'Fermer', text: '✕' });
  closeBtn.addEventListener('click', closeOverlay);
  overlayNode = el('div', { class: 'overlay-root', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    el('div', { class: 'overlay-sheet' },
      el('div', { class: 'o-head' }, el('h2', { text: title }), closeBtn),
      el('p', { class: 'o-sub', text: sub }),
      bodyNode
    )
  );
  overlayNode.addEventListener('click', (e) => { if (e.target === overlayNode) closeOverlay(); });
  document.body.append(overlayNode);
  closeBtn.focus();
}

function openCalendrier() {
  const list = el('div', { class: 'punaise-list' });
  for (const p of content.calendrier.punaises) {
    const detail = el('div', { class: 'pi-detail hidden' },
      el('span', {}, el('strong', { text: 'Action : ' }), p.action), el('br'),
      el('span', {}, el('strong', { text: 'En cas d’oubli : ' }), p.consequence),
      p.echeanceParProgramme && state.programme
        ? el('span', { class: 'pi-vous', text: `👉 Pour vous (${PROGRAMME_LABEL[state.programme]}) : ${p.echeanceParProgramme[state.programme]}` })
        : ''
    );
    const item = el('button', { class: 'punaise-item', 'aria-expanded': 'false' },
      el('span', { class: `punaise-dot ${p.couleur}`, 'aria-hidden': 'true' }),
      el('span', {},
        el('span', { class: 'pi-periode', text: p.periode }),
        detail
      )
    );
    item.addEventListener('click', () => {
      const open = detail.classList.toggle('hidden');
      item.setAttribute('aria-expanded', String(!open));
    });
    list.append(item);
  }
  openOverlay('📅 ' + content.calendrier.titre, content.calendrier.sousTitre + ' — tapez une punaise pour ouvrir sa fiche.', list);
}

function openAnnuaire() {
  const prog = state.programme;
  const fiches = content.annuaire.fiches.slice().sort((a, b) => {
    const rank = (f) => (f.priorite ? 0 : f.programmes && prog && !f.programmes.includes(prog) ? 2 : 1);
    return rank(a) - rank(b);
  });
  const list = el('div', { class: 'fiche-list' });
  for (const f of fiches) {
    const dimmed = f.programmes && prog && !f.programmes.includes(prog);
    list.append(
      el('div', { class: `fiche${f.priorite ? ' prioritaire' : ''}${dimmed ? ' dimmed' : ''}` },
        f.priorite ? el('span', { class: 'f-tag-prio', text: '1er interlocuteur' }) : '',
        el('div', { class: 'f-nom', text: f.nom }),
        el('div', { class: 'f-role', text: f.role }),
        el('div', { class: 'f-quand', text: f.quand }),
        (f.email || f.tel)
          ? el('div', { class: 'f-coords' },
              f.email ? el('a', { href: 'mailto:' + f.email, text: '✉ ' + f.email }) : '',
              f.tel ? el('a', { href: 'tel:' + f.tel.replace(/\s/g, ''), text: '☎ ' + f.tel }) : ''
            )
          : ''
      )
    );
  }
  openOverlay('📞 ' + content.annuaire.titre, content.annuaire.sousTitre, list);
}

async function openOptions() {
  const body = el('div', {},
    el('p', { class: 'dim small', text: content.mentions.donnees }),
    el('button', { class: 'btn-ghost', text: 'Réinitialiser la mission', onclick: async () => {
      closeOverlay();
      const ok1 = await confirmDialog('Réinitialiser efface toute la progression sur cet appareil. Continuer ?', 'Oui, réinitialiser');
      if (!ok1) return;
      const ok2 = await confirmDialog('Dernière confirmation : effacer définitivement la partie ?', 'Effacer définitivement');
      if (!ok2) return;
      resetState();
      initDossiers(content);
      save();
      render();
    } }),
    el('p', { class: 'dim small', style: 'margin-top:14px', text: content.mentions.footer })
  );
  openOverlay('⚙️ Options', 'Réservé aux tests et au passage d’appareil entre binômes.', body);
}

function buildDock() {
  const mk = (ic, label, fn) => {
    const b = el('button', { 'aria-label': label },
      el('span', { class: 'ic', 'aria-hidden': 'true', text: ic }),
      el('span', { text: label })
    );
    b.addEventListener('click', fn);
    return b;
  };
  dockbar.append(
    mk('🗂️', 'QG', () => {
      closeOverlay();
      if (state.screen === 'dossier') { state.view = null; go('hub'); }
      else if (state.screen !== 'final') go('hub');
      else toast('Mission déjà accomplie, agent. 🏆');
    }),
    mk('📅', 'Calendrier', openCalendrier),
    mk('📞', 'Annuaire', openAnnuaire),
    mk('⚙️', 'Options', openOptions)
  );
}

/* ============================ Lancement ============================ */

buildDock();
boot();
