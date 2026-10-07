const state = { tasks: [], filtered: [] };
const prefsKey = 'academicTrackerPrefs';

const $ = (id) => document.getElementById(id);
const fmtDate = (s) => {
  if (!s || s === 'TBD') return 'TBD';
  try {
    const d = new Date(`${s}T00:00:00`);
    if (Number.isNaN(d.getTime())) return s;
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  } catch { return s; }
};
const monthKey = (s) => s ? s.slice(0, 7) : '';
const monthLabel = (key) => {
  try {
    return key ? new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(`${key}-01T00:00:00`)) : '';
  } catch { return key; }
};
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function init() {
  try {
    state.tasks = await fetch('data/tasks.json').then(r => r.json());
    restorePrefs();
    populateFilters();
    renderAll();
  } catch (err) {
    document.body.innerHTML = `<main style="padding:3rem;font-family:system-ui"><h1>Tracker failed to load</h1><p>Run the repo from a local server rather than opening index.html directly.</p><pre>${esc(err.message)}</pre></main>`;
  }
}

function restorePrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(prefsKey) || '{}');
    for (const [id, val] of Object.entries(p)) {
      const el = $(id);
      if (el) el.value = val;
    }
  } catch {}
}

function savePrefs() {
  const ids = ['search', 'trackFilter', 'monthFilter', 'statusFilter', 'readinessFilter'];
  const p = {};
  ids.forEach(id => p[id] = $(id).value);
  localStorage.setItem(prefsKey, JSON.stringify(p));
}

function populateFilters() {
  const tracks = [...new Set(state.tasks.map(t => t.Track))].sort();
  const months = [...new Set(state.tasks.map(t => monthKey(t.Deadline)).filter(Boolean))].sort();
  
  tracks.forEach(t => $('trackFilter').insertAdjacentHTML('beforeend', `<option value="${esc(t)}">${esc(t)}</option>`));
  months.forEach(m => $('monthFilter').insertAdjacentHTML('beforeend', `<option value="${m}">${esc(monthLabel(m))}</option>`));
  
  ['search', 'trackFilter', 'monthFilter', 'statusFilter', 'readinessFilter'].forEach(id => {
    $(id).addEventListener('input', () => { savePrefs(); renderAll(); });
  });
  
  $('resetPrefs').onclick = () => { localStorage.removeItem(prefsKey); location.reload(); };
  $('exportProgress').onclick = exportProgress;
}

function filteredTasks() {
  const q = $('search').value.trim().toLowerCase();
  const tr = $('trackFilter').value;
  const m = $('monthFilter').value;
  const st = $('statusFilter').value;
  const r = $('readinessFilter').value;
  
  return state.tasks.filter(t => {
    const haystack = `${t.Task} ${t.Track} ${t.Type} ${t.Notes || ''} ${t.Dependencies || ''}`.toLowerCase();
    return (
      (!q || haystack.includes(q)) &&
      (!tr || t.Track === tr) &&
      (!m || monthKey(t.Deadline) === m) &&
      (!st || t.Status === st) &&
      (!r || t.Readiness === r)
    );
  }).sort((a, b) => (a.Deadline || '').localeCompare(b.Deadline || ''));
}

function renderAll() {
  state.filtered = filteredTasks();
  renderSummary();
  renderTimeline();
  renderTracks();
  renderWeekOverview();
  renderTasks();
  renderExams();
  renderPortfolio();
  renderDependencyMap();
}

function renderSummary() {
  const avg = state.tasks.length ? Math.round(state.tasks.reduce((a, t) => a + Number(t.Progress || 0), 0) / state.tasks.length) : 0;
  $('overallProgress').textContent = `${avg}%`;
  $('overallBar').style.width = `${avg}%`;
  $('completedCount').textContent = `${state.tasks.filter(t => t.Status === 'Complete').length} / ${state.tasks.length} tasks complete`;
  
  const critical = state.tasks.filter(t => t.Priority === 'Critical' && t.Status !== 'Complete').length;
  $('criticalRemaining').textContent = String(critical);
  $('criticalLabel').textContent = critical === 1 ? 'critical task left' : 'critical tasks left';
}

function renderTimeline() {
  const groups = {};
  state.tasks.forEach(t => {
    const m = monthKey(t.Deadline);
    if (!m) return;
    (groups[m] ??= []).push(t);
  });
  
  $('timeline').innerHTML = Object.keys(groups).sort().map(m => {
    const arr = groups[m];
    const prog = arr.length ? Math.round(arr.reduce((a, t) => a + Number(t.Progress || 0), 0) / arr.length) : 0;
    const done = arr.filter(t => t.Status === 'Complete').length;
    const isCurrent = m === monthKey(new Date().toISOString().slice(0, 10));
    return `<article class="month-card ${isCurrent ? 'current' : ''}"><div class="month-title">${esc(monthLabel(m))}</div><div class="month-progress">${done}/${arr.length} complete · ${prog}% avg</div><div class="progress-track"><div class="progress-fill" style="width:${prog}%"></div></div>${arr.slice(0, 8).map(t => `<div class="month-task"><strong>${esc(t.Task)}</strong><div class="mini">${esc(t.Track)} · ${fmtDate(t.Deadline)}</div></div>`).join('')}${arr.length > 8 ? `<div class="mini">+ ${arr.length - 8} more</div>` : ''}</article>`;
  }).join('');
}

function renderTracks() {
  const tracks = [...new Set(state.tasks.map(t => t.Track))].sort();
  $('trackProgress').innerHTML = tracks.map(tr => {
    const arr = state.tasks.filter(t => t.Track === tr);
    const p = arr.length ? Math.round(arr.reduce((a, t) => a + Number(t.Progress || 0), 0) / arr.length) : 0;
    return `<div class="track-row"><span>${esc(tr)}</span><div class="progress-track"><div class="progress-fill" style="width:${p}%"></div></div><strong>${p}%</strong></div>`;
  }).join('');
}

function renderWeekOverview() {
  const now = new Date();
  const soon = state.tasks.filter(t => {
    if (!t.Deadline || t.Deadline === 'TBD' || t.Status === 'Complete') return false;
    const d = new Date(`${t.Deadline}T00:00:00`);
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).sort((a, b) => (a.Deadline || '').localeCompare(b.Deadline || '')).slice(0, 6);
  
  const overdue = state.tasks.filter(t => {
    if (!t.Deadline || t.Deadline === 'TBD' || t.Status === 'Complete') return false;
    return new Date(`${t.Deadline}T00:00:00`) < now;
  }).sort((a, b) => (a.Deadline || '').localeCompare(b.Deadline || '')).slice(0, 6);
  
  $('weekOverview').innerHTML = `
    <div class="week-col">
      <div class="week-label">Due this week</div>
      ${soon.length ? soon.map(t => `<div class="week-item"><strong>${esc(t.Task)}</strong> <span class="muted">${fmtDate(t.Deadline)}</span></div>`).join('') : '<p class="muted">No tasks due in the next 7 days.</p>'}
    </div>
    <div class="week-col ${overdue.length ? 'danger' : ''}">
      <div class="week-label">Overdue / late</div>
      ${overdue.length ? overdue.map(t => `<div class="week-item danger"><strong>${esc(t.Task)}</strong> <span class="muted">${fmtDate(t.Deadline)}</span></div>`).join('') : '<p class="muted">No overdue critical tasks.</p>'}
    </div>
  `;
}

function prBadge(p) {
  return `<span class="badge badge-${p.toLowerCase()}">${esc(p)}</span>`;
}

function readinessBadge(r) {
  const c = r === 'Exam Ready' ? 'ready' : (r === 'Needs Remediation' ? 'risk' : 'learning');
  return `<span class="badge badge-${c}">${esc(r)}</span>`;
}

function renderTasks() {
  $('taskCount').textContent = `${state.filtered.length} shown`;
  $('taskTable').innerHTML = state.filtered.map(t => `<tr><td><strong>${esc(t.Task)}</strong><div class="muted">${esc(t.ID)}</div></td><td>${esc(t.Track)}</td><td>${fmtDate(t.Deadline)}</td><td>${prBadge(t.Priority)}</td><td><div class="progress-track"><div class="progress-fill" style="width:${t.Progress}%"></div></div><div class="muted">${t.Progress}%</div></td><td>${readinessBadge(t.Readiness)}</td><td>${esc(t.Status)}</td></tr>`).join('') || '<tr><td colspan="7" class="muted">No matching tasks.</td></tr>';
}

function renderExams() {
  const exams = state.tasks.filter(t => /Test|Exam/i.test(t.Type) || /GED|ACT|SAT|AP|Cambridge/i.test(t.Track));
  $('examReadiness').innerHTML = exams.map(t => `<div class="exam-card"><div class="exam-top"><span class="exam-name">${esc(t.Task)}</span>${readinessBadge(t.Readiness)}</div><div class="exam-meta">Target: ${esc(t.Target)} · Deadline: ${fmtDate(t.Deadline)}</div></div>`).join('') || '<p class="muted">No exam tasks found.</p>';
}

function renderPortfolio() {
  const arr = state.tasks.filter(t => t.Track === 'CS' || t.Track === 'ML').slice(0, 14);
  $('portfolio').innerHTML = arr.map(t => `<div class="portfolio-item"><strong>${esc(t.Task)}</strong><div class="muted">${esc(t.Track)} · ${t.Progress}% complete · ${esc(t.Evidence || 'Add GitHub evidence when complete.')}</div></div>`).join('');
}

function renderDependencyMap() {
  const chains = [
    { title: 'Mathematics progression', path: ['T001', 'T003', 'T011', 'T017', 'T027', 'T037', 'T040'] },
    { title: 'Physics progression', path: ['T002', 'T012', 'T021', 'T028', 'T034', 'T038'] },
    { title: 'GED pathway', path: ['T006', 'T007', 'T008', 'T009', 'T010', 'T013', 'T018', 'T019', 'T026'] },
    { title: 'CS → ML progression', path: ['T004', 'T014', 'T022', 'T031', 'T036', 'T040', 'T045', 'T050'] }
  ];
  
  $('dependencyMap').innerHTML = chains.map(chain => {
    const links = chain.path.map((id, i) => {
      const t = state.tasks.find(x => x.ID === id);
      if (!t) return '';
      const arrow = i < chain.path.length - 1 ? ' → ' : '';
      return `<span class="dep-link" title="${esc(t.Task)}">${esc(t.ID)}</span>${arrow}`;
    }).join('');
    return `<div class="dep-chain"><div class="dep-title">${esc(chain.title)}</div><div class="dep-path">${links}</div></div>`;
  }).join('');
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'academic-tracker-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

init().catch(err => {
  document.body.innerHTML = `<main style="padding:3rem;font-family:system-ui"><h1>Tracker failed to load</h1><p>Run the repo from a local server rather than opening index.html directly.</p><pre>${esc(err.message)}</pre></main>`;
});
