// ===== Supabase Config =====
const SUPABASE_URL = 'https://luzjbpklkheytbrylyyt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nm_Y4iTvaZkVTtb6AR3gQA_6AZzkled';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== DOM References =====
const projectsGrid   = document.getElementById('projects-grid');
const projectsLoading = document.getElementById('projects-loading');
const projectsError  = document.getElementById('projects-error');
const projectsEmpty  = document.getElementById('projects-empty');
const filterBar      = document.getElementById('filter-bar');

// ===== State =====
let allProjects = [];

// ===== Fetch Projects from Supabase =====
async function fetchProjects() {
  showState('loading');

  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    showState('error');
    return;
  }

  allProjects = data || [];

  if (allProjects.length === 0) {
    showState('empty');
    return;
  }

  buildFilterButtons(allProjects);
  renderProjects(allProjects);
  showState('grid');
}

// ===== Build Dynamic Filter Buttons =====
function buildFilterButtons(projects) {
  // Collect unique tech tags from all projects
  const techSet = new Set();
  projects.forEach(p => {
    if (Array.isArray(p.tech_stack)) {
      p.tech_stack.forEach(t => techSet.add(t));
    }
  });

  // Keep "全部" and add tech filters
  filterBar.innerHTML = '<button class="filter-btn active" data-filter="all">全部</button>';
  techSet.forEach(tech => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = tech;
    btn.textContent = tech;
    filterBar.appendChild(btn);
  });

  // Attach events
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter);
    });
  });
}

// ===== Filter Projects =====
function filterProjects(filter) {
  if (filter === 'all') {
    renderProjects(allProjects);
  } else {
    const filtered = allProjects.filter(p =>
      Array.isArray(p.tech_stack) && p.tech_stack.includes(filter)
    );
    renderProjects(filtered);
  }
}

// ===== Render Project Cards =====
function renderProjects(projects) {
  projectsGrid.innerHTML = '';

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Image / Placeholder
    const imageSrc = project.image_url;
    const imageHTML = imageSrc
      ? `<div class="project-image"><img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(project.title)}" loading="lazy" onerror="this.parentElement.innerHTML='🖼'"></div>`
      : `<div class="project-image">🖼</div>`;

    // Tech tags
    const techHTML = Array.isArray(project.tech_stack)
      ? project.tech_stack.map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`).join('')
      : '';

    // Links
    const githubLink = project.github_url
      ? `<a href="${escapeHTML(project.github_url)}" target="_blank" rel="noopener" class="project-link">⌥ GitHub</a>`
      : '';
    const demoLink = project.demo_url
      ? `<a href="${escapeHTML(project.demo_url)}" target="_blank" rel="noopener" class="project-link">↗ Demo</a>`
      : '';

    // Featured badge
    const featuredBadge = project.featured
      ? `<span class="project-featured-badge">✦ Featured</span>`
      : '';

    card.innerHTML = `
      ${imageHTML}
      <div class="project-body">
        ${featuredBadge}
        <h3 class="project-title">${escapeHTML(project.title)}</h3>
        <p class="project-desc">${escapeHTML(project.description || '')}</p>
        <div class="project-tech">${techHTML}</div>
        <div class="project-links">${githubLink}${demoLink}</div>
      </div>
    `;

    projectsGrid.appendChild(card);
  });
}

// ===== UI State Helper =====
function showState(state) {
  projectsLoading.classList.add('hidden');
  projectsError.classList.add('hidden');
  projectsEmpty.classList.add('hidden');
  projectsGrid.classList.add('hidden');

  if (state === 'loading') projectsLoading.classList.remove('hidden');
  else if (state === 'error')  projectsError.classList.remove('hidden');
  else if (state === 'empty')  projectsEmpty.classList.remove('hidden');
  else if (state === 'grid')   projectsGrid.classList.remove('hidden');
}

// ===== XSS Prevention =====
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// ===== Init =====
fetchProjects();
