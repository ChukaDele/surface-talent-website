/*
 * Surface Talent — Airtable jobs integration
 *
 * Configure the three values below, then jobs.html and job.html will
 * populate automatically from your Airtable base.
 *
 * Airtable schema expected (table name: "Jobs")
 *   - Title (single line text)                     e.g. "Operations Manager (LEAN focus)"
 *   - Subtitle (single line text)                  e.g. "Architectural Anodisers"
 *   - Location (single line text)                  e.g. "Huddersfield"
 *   - Salary (single line text)                    e.g. "£65-80k + bonus"
 *   - Type (single select)                         Permanent / Contract / Interim
 *   - Discipline (single select)                   Anodising / Electroplating / ...
 *   - Function (single select)                     Operations / Commercial / Quality / ...
 *   - Seniority (single select)                    Professional / Manager / Director
 *   - Hook (long text)                             One-line pitch at top of ad
 *   - TheBusiness (long text)                      Paragraph about the employer
 *   - TheRole (long text)                          Paragraph about the role
 *   - ThePerson (long text)                        Paragraph about the person
 *   - Status (single select)                       Live / Closed / Draft
 *   - Slug (formula or single line)                URL-safe slug, e.g. "ops-manager-anodiser-huddersfield"
 *
 * Only records with Status = "Live" will be shown.
 */

/*
 * Jobs data is fetched through a server-side proxy at /api/jobs, never
 * directly from Airtable. Do not put an Airtable token back in this file —
 * it would ship in the browser bundle of a public static site. See the
 * "Wire up the live jobs list" step in README.md for the proxy contract
 * (GET /api/jobs -> raw Airtable { records: [...] } shape,
 *  GET /api/jobs/:id -> raw Airtable { id, fields } shape).
 */

async function fetchJobs() {
  const res = await fetch('/api/jobs');
  if (!res.ok) throw new Error(`Jobs API error ${res.status}`);
  const data = await res.json();
  return data.records.map(r => ({ id: r.id, ...r.fields }));
}

async function fetchJob(id) {
  const res = await fetch(`/api/jobs/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Jobs API error ${res.status}`);
  const data = await res.json();
  return { id: data.id, ...data.fields };
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function renderJobList(target, jobs) {
  if (!jobs.length) {
    target.innerHTML = `<p class="muted" style="padding:2rem 0">No live roles right now. <a href="contact.html">Register for alerts</a> and we'll be in touch when something lands.</p>`;
    return;
  }
  target.innerHTML = jobs.map(j => `
    <a href="job.html?id=${encodeURIComponent(j.id)}" class="job">
      <div>
        <div class="job-title">${escapeHtml(j.Title || 'Untitled role')}${j.Subtitle ? ' — ' + escapeHtml(j.Subtitle) : ''}</div>
        <div class="job-meta">
          ${j.Location ? `<span>${escapeHtml(j.Location)}</span>` : ''}
          ${j.Salary ? `<span>${escapeHtml(j.Salary)}</span>` : ''}
          ${j.Type ? `<span>${escapeHtml(j.Type)}</span>` : ''}
        </div>
      </div>
      <div class="arrow">View →</div>
    </a>
  `).join('');
}

function applyFilters(jobs, { q, discipline, funcArea, seniority }) {
  return jobs.filter(j => {
    if (discipline && j.Discipline !== discipline) return false;
    if (funcArea && j.Function !== funcArea) return false;
    if (seniority && j.Seniority !== seniority) return false;
    if (q) {
      const hay = `${j.Title||''} ${j.Subtitle||''} ${j.Location||''} ${j.Discipline||''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
}

function initJobsList() {
  const listEl = document.getElementById('jobs-list');
  const countEl = document.getElementById('jobs-count');
  const q = document.getElementById('q');
  const disc = document.getElementById('discipline');
  const func = document.getElementById('function');
  const sen = document.getElementById('seniority');
  if (!listEl) return;

  listEl.innerHTML = `<p class="muted" style="padding:2rem 0">Loading live roles…</p>`;

  fetchJobs().then(jobs => {
    const render = () => {
      const filtered = applyFilters(jobs, {
        q: q?.value, discipline: disc?.value, funcArea: func?.value, seniority: sen?.value
      });
      renderJobList(listEl, filtered);
      if (countEl) countEl.textContent = filtered.length;
    };
    render();
    [q, disc, func, sen].forEach(el => el && el.addEventListener('input', render));
  }).catch(err => {
    console.error(err);
    listEl.innerHTML = `<p class="muted" style="padding:2rem 0">We couldn't load live roles right now. Please <a href="contact.html">get in touch</a> and we'll send the current list.</p>`;
  });
}

function initJobDetail() {
  const wrap = document.getElementById('job-detail');
  if (!wrap) return;
  const id = new URLSearchParams(location.search).get('id');
  if (!id) {
    wrap.innerHTML = '<div class="container" style="padding:4rem 0"><p>No role selected. <a href="jobs.html" style="color:var(--copper);text-decoration:underline">See all live roles</a>.</p></div>';
    return;
  }

  fetchJob(id).then(j => {
    document.title = `${j.Title} — Surface Talent`;
    const businessHtml = j.TheBusiness ? escapeHtml(j.TheBusiness).replace(/\n/g, '</p><p>') : '';
    const roleHtml = j.TheRole ? escapeHtml(j.TheRole).replace(/\n/g, '</p><p>') : '';
    const personHtml = j.ThePerson ? escapeHtml(j.ThePerson).replace(/\n/g, '</p><p>') : '';
    wrap.innerHTML = `
      <div class="job-header">
        <div class="container">
          <div class="eyebrow">${escapeHtml(j.Discipline || 'Surface engineering')} · ${escapeHtml(j.Type || 'Permanent')}</div>
          <h1>${escapeHtml(j.Title || '')}${j.Subtitle ? ' — ' + escapeHtml(j.Subtitle) : ''}</h1>
          ${j.Hook ? `<p class="lede" style="max-width:60ch;margin-top:1rem;font-size:1.15rem">${escapeHtml(j.Hook)}</p>` : ''}
        </div>
      </div>
      <div class="job-body">
        <div class="container job-layout">
          <div>
            ${businessHtml ? `<h2>The business</h2><p>${businessHtml}</p>` : ''}
            ${roleHtml ? `<h2>The role</h2><p>${roleHtml}</p>` : ''}
            ${personHtml ? `<h2>The person</h2><p>${personHtml}</p>` : ''}
            <div class="cta-row" style="margin-top:2rem">
              <a href="apply.html?role=${encodeURIComponent(j.Title||'')}" class="btn btn-primary">Apply in confidence</a>
              <a href="jobs.html" class="btn">See all live roles</a>
            </div>
          </div>
          <aside>
            <div class="job-sidebar">
              <dl>
                <dt>Location</dt><dd>${escapeHtml(j.Location || '—')}</dd>
                <dt>Salary guide</dt><dd>${escapeHtml(j.Salary || '—')}</dd>
                <dt>Type</dt><dd>${escapeHtml(j.Type || '—')}</dd>
                <dt>Discipline</dt><dd>${escapeHtml(j.Discipline || '—')}</dd>
                <dt>Function</dt><dd>${escapeHtml(j.Function || '—')}</dd>
                <dt>Seniority</dt><dd>${escapeHtml(j.Seniority || '—')}</dd>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    `;
  }).catch(err => {
    console.error(err);
    wrap.innerHTML = '<div class="container" style="padding:4rem 0;text-align:center"><p>Role not found. <a href="jobs.html" style="color:var(--copper);text-decoration:underline">See live roles</a>.</p></div>';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initJobsList();
  initJobDetail();
});
