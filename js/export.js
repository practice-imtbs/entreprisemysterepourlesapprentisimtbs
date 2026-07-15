/* Génération PNG de la carte d'agent (canvas, 100 % côté client) */
import { state, stats } from './state.js';
import { el } from './ui.js';

const W = 1000;
const H = 1840;

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function loadLogo() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = 'assets/img/logo-imtbs.png';
  });
}

export async function generateAgentCard(content) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const s = stats(content);
  const now = state.finishedAt ? new Date(state.finishedAt) : new Date();

  /* Fond */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#141031');
  bg.addColorStop(1, '#0B0A1C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Cadre */
  ctx.strokeStyle = '#AD1D89';
  ctx.lineWidth = 10;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.strokeStyle = '#00B8DE';
  ctx.lineWidth = 2;
  ctx.strokeRect(44, 44, W - 88, H - 88);

  const MONO = '"American Typewriter", "Courier New", monospace';
  const SANS = '-apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  let y = 128;

  /* En-tête */
  ctx.textAlign = 'center';
  ctx.fillStyle = '#00B8DE';
  ctx.font = `26px ${MONO}`;
  ctx.fillText('AGENCE DE L’ALTERNANCE — DOSSIER CONFIDENTIEL', W / 2, y); y += 66;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 62px ${SANS}`;
  ctx.fillText('CARTE D’AGENT', W / 2, y); y += 54;
  ctx.fillStyle = '#E04FB8';
  ctx.font = `30px ${MONO}`;
  ctx.fillText(content.final.accreditation, W / 2, y); y += 70;

  /* Binôme */
  const agents = state.agents.filter(Boolean);
  ctx.fillStyle = '#9FACC4';
  ctx.font = `24px ${MONO}`;
  ctx.fillText(agents.length > 1 ? 'BINÔME D’AGENTS' : 'AGENT', W / 2, y); y += 52;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 46px ${SANS}`;
  ctx.fillText(agents.join('  &  ') || 'Agent anonyme', W / 2, y); y += 48;
  ctx.fillStyle = '#9FACC4';
  ctx.font = `26px ${SANS}`;
  const progLabel = state.programme === 'pge' ? 'Programme Grande École' : 'Bachelor';
  ctx.fillText(`${progLabel} · IMT Business School`, W / 2, y); y += 40;
  ctx.font = `22px ${MONO}`;
  ctx.fillText('Complété le ' + now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), W / 2, y);
  y += 64;

  /* Code d'accès */
  ctx.fillStyle = 'rgba(0,184,222,.10)';
  ctx.fillRect(180, y - 10, W - 360, 96);
  ctx.strokeStyle = '#00B8DE';
  ctx.lineWidth = 3;
  ctx.strokeRect(180, y - 10, W - 360, 96);
  ctx.fillStyle = '#4DD4F0';
  ctx.font = `bold 56px ${MONO}`;
  ctx.fillText(content.meta.codeFinal.split('').join(' '), W / 2, y + 56);
  y += 130;
  ctx.fillStyle = '#9FACC4';
  ctx.font = `22px ${SANS}`;
  ctx.fillText('Code d’accès à la finale — à présenter à l’animateur', W / 2, y);
  y += 66;

  /* Statistiques */
  ctx.fillStyle = '#E04FB8';
  ctx.font = `26px ${MONO}`;
  ctx.fillText('— RAPPORT DE MISSION —', W / 2, y); y += 48;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `28px ${SANS}`;
  ctx.fillText(`Questions réussies du premier coup : ${s.firstTry} / ${s.total}`, W / 2, y); y += 44;
  ctx.fillText(`Temps total de la mission : ${s.totalMinutes !== null ? s.totalMinutes + ' min' : '—'}`, W / 2, y); y += 44;
  const durees = s.perDossier
    .map((d) => `D${d.numero} : ${d.minutes !== null ? d.minutes + ' min' : '—'}`)
    .join('   ·   ');
  ctx.fillText(durees, W / 2, y); y += 72;

  /* Dates clés */
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E04FB8';
  ctx.font = `26px ${MONO}`;
  ctx.fillText('📅 5 DATES À NE PAS RATER', 110, y); y += 44;
  ctx.fillStyle = '#E8EDF6';
  ctx.font = `24px ${SANS}`;
  for (const p of content.calendrier.punaises) {
    y = wrapText(ctx, `• ${p.periode} — ${p.action}`, 110, y, W - 220, 32) + 6;
  }
  y += 26;

  /* Contacts prioritaires */
  ctx.fillStyle = '#E04FB8';
  ctx.font = `26px ${MONO}`;
  ctx.fillText('📞 CONTACTS PRIORITAIRES', 110, y); y += 44;
  ctx.fillStyle = '#E8EDF6';
  ctx.font = `24px ${SANS}`;
  const fiches = content.annuaire.fiches
    .filter((f) => f.priorite || !f.programmes || f.programmes.includes(state.programme))
    .slice(0, 5);
  for (const f of fiches) {
    y = wrapText(ctx, `• ${f.nom} — ${f.role}`, 110, y, W - 220, 32) + 4;
  }

  /* Pied : logo IMT-BS sur cartouche blanc — ancré par son bord bas pour
     garantir l'espace avec la ligne de mentions (H − 72) quel que soit le
     ratio de l'image */
  const logo = await loadLogo();
  if (logo) {
    const lw = 300;
    const lh = lw * (logo.height / logo.width);
    const lx = (W - lw) / 2;
    const pad = 18;
    const ly = H - 120 - pad - lh; // bas du cartouche à H − 120
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(lx - pad, ly - pad, lw + pad * 2, lh + pad * 2, 14);
    ctx.fill();
    ctx.drawImage(logo, lx, ly, lw, lh);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9FACC4';
  ctx.font = `20px ${MONO}`;
  ctx.fillText(content.mentions.footer, W / 2, H - 72);

  return canvas;
}

export async function exportAgentCard(content, previewContainer) {
  const canvas = await generateAgentCard(content);
  const dataUrl = canvas.toDataURL('image/png');

  /* Tentative de téléchargement direct */
  const a = document.createElement('a');
  a.href = dataUrl;
  const names = state.agents.filter(Boolean).join('_') || 'agent';
  a.download = `Rapport_Mission_${names.replace(/[^\p{L}\p{N}_-]/gu, '')}.png`;
  document.body.append(a);
  a.click();
  a.remove();

  /* Aperçu systématique (fallback iOS : appui long pour enregistrer) */
  if (previewContainer) {
    previewContainer.textContent = '';
    const img = el('img', {
      src: dataUrl,
      alt: 'Carte d’agent — rapport de mission',
      style: 'width:100%;border-radius:12px;border:1px solid var(--line);margin-top:12px',
    });
    previewContainer.append(
      img,
      el('p', { class: 'dim small center', text: 'Si le téléchargement ne démarre pas : appui long (mobile) ou clic droit sur l’image → « Enregistrer l’image ».' })
    );
  }
}
