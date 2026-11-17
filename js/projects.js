// mrmickwhite.com — proyectos en vivo desde GitHub
import { $, CONTACT } from './common.js';

// GitHub trata distinto a cuentas de usuario y organizaciones:
// /users/{login}/repos funciona para cuentas personales (la mayoría de freelancers),
// /orgs/{login}/repos solo funciona si la cuenta es una organización.
// Probamos primero como usuario y, si GitHub responde 404, reintentamos como organización.
const API_URL_USER = `https://api.github.com/users/${CONTACT.githubOrg}/repos?per_page=100&sort=updated`;
const API_URL_ORG = `https://api.github.com/orgs/${CONTACT.githubOrg}/repos?per_page=100&sort=updated`;
const CACHE_KEY = 'mw_repos_cache_v1';
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutos

const LANG_COLORS = {
  JavaScript: '#d9a23a',
  TypeScript: '#3b7ddd',
  HTML: '#d8602f',
  CSS: '#9b82d6',
  Python: '#6f8c3f',
  default: '#6b6457',
};

const LANG_ICON = {
  JavaScript: 'JS',
  TypeScript: 'TS',
  HTML: '◇',
  CSS: '◆',
  Python: 'PY',
  default: '◌',
};

// Repos que no queremos mostrar en el grid (configuración, forks vacíos, etc.)
// Se filtra por nombre exacto si alguna vez hace falta excluir algo puntual.
const EXCLUDE = [];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} mes${months > 1 ? 'es' : ''}`;
  const years = Math.floor(months / 12);
  return `hace ${years} año${years > 1 ? 's' : ''}`;
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* sessionStorage no disponible, seguimos sin caché */
  }
}

function projectIcon(repo) {
  const name = repo.name.toLowerCase();
  if (name.includes('fly')) return '🛩️';
  if (name.includes('labs') || name.includes('white')) return '🧪';
  if (name.includes('esport') || name.includes('game') || name.includes('torneo')) return '🎮';
  if (name.includes('banco') || name.includes('banquito') || name.includes('finan')) return '🏦';
  return '📦';
}

function cardTemplate(repo) {
  const lang = repo.language || 'default';
  const color = LANG_COLORS[lang] || LANG_COLORS.default;
  const icon = LANG_ICON[lang] || LANG_ICON.default;
  const desc = repo.description || 'Sin descripción todavía — disponible en el repositorio.';
  const hasLiveDemo = Boolean(repo.homepage);
  const liveUrl = hasLiveDemo ? repo.homepage : null;

  return `
    <article class="card project-card reveal">
      <div class="project-top">
        <span class="project-icon">${projectIcon(repo)}</span>
        <span class="tag">${repo.private ? 'privado' : 'público'}</span>
      </div>
      <h3>${repo.name}</h3>
      <p class="project-desc">${desc}</p>
      <div class="project-meta">
        ${repo.language ? `<span><i class="lang-dot" style="background:${color}"></i>${icon} ${repo.language}</span>` : ''}
        <span>★ ${repo.stargazers_count ?? 0}</span>
        <span>actualizado ${timeAgo(repo.pushed_at || repo.updated_at)}</span>
      </div>
      <div class="project-actions">
        ${liveUrl ? `<a class="btn primary sm" href="${liveUrl}" target="_blank" rel="noopener">Ver demo en vivo</a>` : ''}
        <a class="btn outline sm" href="${repo.html_url}" target="_blank" rel="noopener">Ver código</a>
      </div>
    </article>
  `;
}

function skeletonTemplate() {
  return `
    <article class="card project-card skeleton">
      <div class="project-top">
        <span class="project-icon">⏳</span>
      </div>
      <div class="skeleton-line" style="width:60%; margin-bottom:10px;"></div>
      <div class="skeleton-line" style="width:90%; margin-bottom:8px;"></div>
      <div class="skeleton-line" style="width:75%;"></div>
    </article>
  `;
}

async function fetchRepos() {
  const cached = readCache();
  if (cached) return cached;

  // Intento 1: cuenta de usuario (caso típico de freelancer individual)
  let res = await fetch(API_URL_USER, { headers: { Accept: 'application/vnd.github+json' } });

  // Intento 2: si no es cuenta de usuario, puede ser una organización
  if (res.status === 404) {
    res = await fetch(API_URL_ORG, { headers: { Accept: 'application/vnd.github+json' } });
  }

  if (!res.ok) throw new Error(`GitHub API respondió ${res.status}`);
  const data = await res.json();
  writeCache(data);
  return data;
}

export async function renderProjects() {
  const grid = $('[data-project-grid]');
  const status = $('[data-project-status]');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 3 }, skeletonTemplate).join('');
  if (status) status.textContent = 'conectando con github…';

  try {
    const repos = await fetchRepos();
    const visible = repos
      .filter(repo => !repo.fork)
      .filter(repo => !EXCLUDE.includes(repo.name))
      .sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at));

    if (!visible.length) {
      grid.innerHTML = `<div class="project-empty">Todavía no hay repositorios públicos para mostrar.</div>`;
      if (status) status.textContent = 'sin repositorios públicos';
      return;
    }

    grid.innerHTML = visible.map(cardTemplate).join('');
    if (status) status.textContent = `${visible.length} repositorio${visible.length > 1 ? 's' : ''} · actualizado en vivo`;
    import('./common.js').then(({ initReveal }) => initReveal());
  } catch (err) {
    grid.innerHTML = `
      <div class="project-error">
        No se pudo conectar con la API de GitHub en este momento.<br />
        Puedes ver los proyectos directamente en
        <a href="${CONTACT.github}" target="_blank" rel="noopener" style="color:var(--olive-soft); text-decoration:underline;">github.com/${CONTACT.githubOrg}</a>.
      </div>`;
    if (status) status.textContent = 'sin conexión con github';
    console.warn('No se pudieron cargar los repos de GitHub:', err);
  }
}
