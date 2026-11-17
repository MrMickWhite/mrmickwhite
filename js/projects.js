// mrmickwhite.com — lista curada de proyectos (estática).
// No depende de la visibilidad de los repositorios en GitHub.
import { initReveal } from './common.js';

const PROJECTS = [
  { name: 'MRExtin', icon: '🧯', tag: 'Sistema web',
    desc: 'Gestión y control de extintores: inspecciones, vencimientos, etiquetas QR y reportes.',
    url: 'https://extin.mrmickwhite.com' },
  { name: 'MRFIRM', icon: '✍️', tag: 'App de escritorio',
    desc: 'Crear, firmar, validar y gestionar documentos digitales. Para Windows.',
    url: 'https://firma.mrmickwhite.com' },
  { name: 'MR TAXI', icon: '🚕', tag: 'Web',
    desc: 'Pide tu taxi por WhatsApp en la Península de Santa Elena.',
    url: 'https://taxi.mrmickwhite.com' },
  { name: 'MR.MICK FLY', icon: '🛩️', tag: 'Servicio',
    desc: 'Servicio técnico de drones: diagnóstico, mantenimiento y reparación.',
    url: 'https://fly.mrmickwhite.com' },
  { name: 'Banquito', icon: '🏦', tag: 'App de escritorio',
    desc: 'Caja de ahorro y crédito comunitario. Funciona sin internet, con reportes PDF.',
    url: 'https://banquito.mrmickwhite.com' },
  { name: 'Software E-Sports', icon: '🎮', tag: 'Evento',
    desc: 'Web del torneo de videojuegos, con panel de staff y puntajes en vivo.',
    url: 'https://esports.mrmickwhite.com' },
  { name: 'MrMickDesign', icon: '🎨', tag: 'Diseño y desarrollo',
    desc: 'Diseño gráfico, desarrollo web y de apps, sublimación y personalizados.',
    url: 'https://design.mrmickwhite.com' },
  { name: 'MrMickWhite Labs', icon: '🧪', tag: 'Productos',
    desc: 'Esencias, jabones y cremas botánicas. Catálogo y pedido por WhatsApp.',
    url: 'https://labs.mrmickwhite.com' },
];

function card(p) {
  return `
    <article class="card project-card reveal">
      <div class="project-top">
        <span class="project-icon">${p.icon}</span>
        <span class="tag">${p.tag}</span>
      </div>
      <h3>${p.name}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-actions">
        <a class="btn primary sm" href="${p.url}" target="_blank" rel="noopener">Ver sitio →</a>
      </div>
    </article>`;
}

export function renderProjects() {
  const grid = document.querySelector('[data-project-grid]');
  if (grid) grid.innerHTML = PROJECTS.map(card).join('');
  const status = document.querySelector('[data-project-status]');
  if (status) status.innerHTML = `<span class="blip"></span> ${PROJECTS.length} proyectos activos`;
  initReveal();
}
