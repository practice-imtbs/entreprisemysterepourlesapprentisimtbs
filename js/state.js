/* Progression et persistance localStorage */

const KEY = 'entreprise-mystere-imtbs-v1';

export function defaultState() {
  return {
    v: 1,
    agents: ['', ''],
    programme: null,          // 'bachelor' | 'pge'
    screen: 'welcome',        // welcome | intro | hub | dossier | final
    dossierId: null,
    view: null,               // { kind, zoneId, stepIdx, qgIdx, fragment }
    dossiers: {},             // rempli à l'init d'après content.json
    answers: {},              // qid -> { attempts, done, firstTry }
    fragments: [],
    startedAt: null,
    finishedAt: null,
  };
}

export let state = defaultState();

export function initDossiers(content) {
  for (const d of content.dossiers) {
    if (!state.dossiers[d.id]) {
      const zoneStep = {};
      for (const z of d.zones) zoneStep[z.id] = 0;
      state.dossiers[d.id] = {
        unlocked: d.numero === 1,
        done: false,
        postits: [],
        zoneStep,
        alerteVue: false,
        qgIdx: 0,
        debriefFait: false,
        start: null,
        end: null,
      };
    }
  }
  if (!state.fragments.length) {
    state.fragments = content.meta.fragments.map(() => false);
  }
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Sauvegarde locale impossible :', e);
  }
}

export function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.v === 1) return parsed;
  } catch (e) {
    console.warn('Lecture de la sauvegarde impossible :', e);
  }
  return null;
}

export function adoptSaved(saved) {
  state = saved;
}

export function resetState() {
  localStorage.removeItem(KEY);
  state = defaultState();
}

export function hasProgress(saved) {
  return !!saved && (saved.screen !== 'welcome' || saved.agents.some((a) => a));
}

/* --- Réponses --- */
export function answerRecord(qid) {
  if (!state.answers[qid]) state.answers[qid] = { attempts: 0, done: false, firstTry: false };
  return state.answers[qid];
}

export function questionDone(qid) {
  return !!state.answers[qid] && state.answers[qid].done;
}

/* --- Statistiques pour la carte d'agent --- */
export function stats(content) {
  const qids = Object.keys(content.questions);
  const firstTry = qids.filter((q) => state.answers[q] && state.answers[q].firstTry).length;
  const perDossier = content.dossiers.map((d) => {
    const ds = state.dossiers[d.id];
    let min = null;
    if (ds && ds.start && ds.end) min = Math.max(1, Math.round((ds.end - ds.start) / 60000));
    return { numero: d.numero, minutes: min };
  });
  return { total: qids.length, firstTry, perDossier };
}
