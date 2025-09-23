// Theme toggle
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || (!savedTheme && prefersLight)) root.classList.add('light');
const btn = document.getElementById('themeToggle');
if (btn) btn.addEventListener('click', () => {
  root.classList.toggle('light');
  const mode = root.classList.contains('light') ? 'light' : 'dark';
  btn.setAttribute('aria-pressed', mode === 'light');
  localStorage.setItem('theme', mode);
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Render projects from projects.json (CMS-style)
(async function renderProjects(){
  try {
    const res = await fetch('projects.json', {cache:'no-store'});
    const items = await res.json();
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title} preview" style="border-radius:14px;margin-bottom:12px;border:1px solid color-mix(in srgb,var(--muted) 22%, transparent)" />
        <div class="proj-head">
          <h3 class="proj-title">${p.title}</h3>
          <div class="pill-actions">
            ${p.live && p.live !== '#' ? `<a class="btn ghost" href="${p.live}" target="_blank" rel="noopener" aria-label="Open live demo for ${p.title}">Live</a>` : ''}
            <a class="btn ghost" href="${p.url}" target="_blank" rel="noopener" aria-label="Open GitHub for ${p.title}">Code</a>
          </div>
        </div>
        <p class="proj-desc">${p.description}</p>
        <div class="skills" style="margin-top:10px">
          ${p.tags.map(t=>`<span class='tag'>${t}</span>`).join('')}
        </div>`;
      grid.appendChild(card);
    });
    // Update KPI count
    const kpi = document.getElementById('kpiProjects');
    if (kpi) kpi.textContent = `${items.length}+`;
  } catch (e) {
    console.error('projects.json missing or invalid', e);
  }
})();

// Contact form (no backend yet)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form) form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Contact form data', data);
  if (status) status.textContent = 'Thanks! Your message has been queued. I\'ll reply soon.';
  form.reset();
});