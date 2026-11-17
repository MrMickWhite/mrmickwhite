// mrmickwhite.com — raíz · utilidades comunes

export const CONTACT = {
  email: 'mrmickdesign@gmail.com',
  github: 'https://github.com/MrMickWhite',
  githubOrg: 'MrMickWhite',
  instagram: 'https://instagram.com/_mr.mickwhite',
  instagramHandle: '_mr.mickwhite',
};

export const $ = (selector, parent = document) => parent.querySelector(selector);
export const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

export function initHeaderScroll() {
  const header = $('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

export function initNavToggle() {
  const toggle = $('[data-nav-toggle]');
  const nav = $('[data-main-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('is-open'));
  $$('a', nav).forEach(link => link.addEventListener('click', () => nav.classList.remove('is-open')));
}

export function initReveal() {
  const items = $$('.reveal:not(.is-visible)');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
  items.forEach(item => io.observe(item));
}

export function initYear() {
  const el = $('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

export function initSocialLinks() {
  $$('[data-github-link]').forEach(el => { el.href = CONTACT.github; el.target = '_blank'; el.rel = 'noopener'; });
  $$('[data-instagram-link]').forEach(el => { el.href = CONTACT.instagram; el.target = '_blank'; el.rel = 'noopener'; });
  $$('[data-email-link]').forEach(el => { el.href = `mailto:${CONTACT.email}`; });
}

export function bootBase() {
  initHeaderScroll();
  initNavToggle();
  initSocialLinks();
  initYear();
}
