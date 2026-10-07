/* ════════════════════════════════════════════════════════════════
   connect-app.js — Alumni Connect layer for PlacementPro
   ----------------------------------------------------------------
   Adds five student ⇄ alumni features on top of the legacy app:
     1. Alumni Directory  (search seniors by company / role / batch)
     2. Mentorship & Mock Interviews (alumni publish slots, students book)
     3. Interview Experience feed (round-by-round stories + upvote/comment)
     4. Referral requests (student asks, alumni accepts / refers)
     5. Q&A Forum (students ask, alumni answer, accept best answer)

   Uses the same globals the legacy app exposes: api(), toast(),
   currentUser, navigate(). Loaded AFTER legacy-app.js.
   ════════════════════════════════════════════════════════════════ */

function cEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function cVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function cChecked(id) { const el = document.getElementById(id); return !!(el && el.checked); }
function cInitials(name) { return (name || '?').trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase(); }
function cAvatar(a, size) {
  const s = size || 42;
  if (a && a.avatar) return `<img src="${cEsc(a.avatar)}" alt="${cEsc(a.name)}" style="width:${s}px;height:${s}px;border-radius:50%;object-fit:cover;flex-shrink:0">`;
  return `<div class="avatar-sm" style="width:${s}px;height:${s}px;font-size:${Math.round(s / 3)}px;flex-shrink:0">${cEsc(cInitials(a && a.name))}</div>`;
}
function cWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function cAgo(iso) {
  if (!iso) return '';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  if (mins < 1440) return Math.round(mins / 60) + 'h ago';
  return Math.round(mins / 1440) + 'd ago';
}
function cCard(inner, extra) {
  return `<div style="background:var(--surf2);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:18px;${extra || ''}">${inner}</div>`;
}
function cChip(text, color) {
  return `<span style="font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;background:${color}18;border:1px solid ${color}44;color:${color}">${cEsc(text)}</span>`;
}
function cEmpty(msg) {
  return `<div style="padding:40px;text-align:center;color:var(--tx3);font-size:14px">${cEsc(msg)}</div>`;
}
const C_STATUS_COLOR = { pending: 'var(--gd)', accepted: 'var(--cy)', referred: 'var(--gn)', declined: 'var(--rd)', open: 'var(--cy)', booked: 'var(--pu2)', completed: 'var(--gn)', cancelled: 'var(--rd)' };

/* ══════════════ 1. ALUMNI DIRECTORY ══════════════ */
let _alumniList = [];

async function renderAlumniDirectory() {
  document.getElementById('alumni-filters').innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <input id="alumni-q" class="inp" placeholder="Search name, company, role or skill…" style="flex:1;min-width:220px" oninput="if(event.key!==undefined){}" onkeyup="if(event.key==='Enter')loadAlumni()">
      <input id="alumni-company" class="inp" placeholder="Company" style="width:160px" onkeyup="if(event.key==='Enter')loadAlumni()">
      <input id="alumni-year" class="inp" placeholder="Batch year" style="width:130px" onkeyup="if(event.key==='Enter')loadAlumni()">
      <label style="display:flex;gap:6px;align-items:center;font-size:12px;color:var(--tx2)"><input type="checkbox" id="alumni-ref"> Open to referrals</label>
      <button class="btn btn-primary btn-sm" onclick="loadAlumni()">🔍 Search</button>
    </div>`;
  await loadAlumni();
}

async function loadAlumni() {
  const grid = document.getElementById('alumni-grid');
  grid.innerHTML = cEmpty('Loading alumni…');
  const qs = new URLSearchParams();
  if (cVal('alumni-q')) qs.set('q', cVal('alumni-q'));
  if (cVal('alumni-company')) qs.set('company', cVal('alumni-company'));
  if (cVal('alumni-year')) qs.set('year', cVal('alumni-year'));
  if (cChecked('alumni-ref')) qs.set('referral', '1');

  const res = await api('/alumni.php' + (qs.toString() ? '?' + qs.toString() : ''));
  if (!res.success) { grid.innerHTML = cEmpty(res.message || 'Could not load alumni'); return; }

  _alumniList = res.alumni || [];
  if (!_alumniList.length) { grid.innerHTML = cEmpty('No alumni matched your search yet.'); return; }

  grid.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px">${_alumniList.map((a) => cCard(`
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
      ${cAvatar(a, 46)}
      <div style="min-width:0">
        <div style="font-weight:700;font-size:15px">${cEsc(a.name)}</div>
        <div style="font-size:12px;color:var(--tx2)">${cEsc([a.job_title, a.company].filter(Boolean).join(' @ ') || a.position || 'Alumni')}</div>
        <div style="font-size:11px;color:var(--tx3)">${cEsc([a.degree, a.branch, a.graduation_year && 'Batch ' + a.graduation_year].filter(Boolean).join(' • '))}</div>
      </div>
    </div>
    ${a.bio ? `<div style="font-size:12px;color:var(--tx2);margin-bottom:10px">“${cEsc(a.bio)}”</div>` : ''}
    ${a.skills && a.skills.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${a.skills.slice(0, 5).map((s) => cChip(s, '#7c6ff7')).join('')}</div>` : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      ${a.open_slots ? cChip(a.open_slots + ' open slot' + (a.open_slots > 1 ? 's' : ''), '#38d9a9') : ''}
      ${a.experiences ? cChip(a.experiences + ' experience' + (a.experiences > 1 ? 's' : ''), '#4dabf7') : ''}
      ${a.open_to_referral ? cChip('Referrals open', '#f5c842') : ''}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-sm btn-primary" onclick="messageAlumni('${a.id}')">💬 Message</button>
      <button class="btn btn-sm" onclick="prefillReferral('${a.id}','${cEsc(a.company)}')">🤝 Referral</button>
      <button class="btn btn-sm" onclick="navigate('mentorship')">📅 Slots</button>
    </div>`)).join('')}</div>`;
}

function messageAlumni(id) {
  navigate('chat');
  setTimeout(() => { if (typeof openChatThread === 'function') openChatThread(id); }, 400);
}

/* ══════════════ 2. MENTORSHIP & MOCK INTERVIEWS ══════════════ */
async function renderMentorship() {
  const isAlumni = currentUser && currentUser.role === 'admin';
  document.getElementById('mentorship-title').textContent = isAlumni ? 'My Mentorship Slots' : 'Mentorship & Mock Interviews';
  document.getElementById('mentorship-sub').textContent = isAlumni
    ? 'Publish free slots — students book them for guidance or mock interviews'
    : 'Book a 1:1 guidance call or a mock interview with an alumnus';
  document.getElementById('mentorship-body').innerHTML = cEmpty('Loading…');
  if (isAlumni) return renderAlumniSlots();
  return renderStudentMentorship();
}

async function renderAlumniSlots() {
  const res = await api('/mentorship.php/my');
  const slots = res.success ? res.slots : [];
  const body = document.getElementById('mentorship-body');

  body.innerHTML = `
    ${cCard(`
      <div style="font-weight:700;margin-bottom:14px">➕ Publish a new slot</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">
        <select id="slot-kind" class="inp"><option value="mentorship">Mentorship call</option><option value="mock">Mock interview</option></select>
        <input id="slot-topic" class="inp" placeholder="Topic (e.g. DSA mock, Resume review)">
        <input id="slot-company" class="inp" placeholder="Company context (optional)">
        <input id="slot-start" class="inp" type="datetime-local">
        <input id="slot-duration" class="inp" type="number" min="15" step="15" value="30" placeholder="Minutes">
        <input id="slot-link" class="inp" placeholder="Meet / Zoom link">
      </div>
      <textarea id="slot-notes" class="inp" rows="2" placeholder="Anything the student should prepare?" style="margin-top:10px;width:100%"></textarea>
      <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="createSlot()">Publish slot</button>`, 'margin-bottom:20px')}
    ${slots.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px">${slots.map(alumniSlotCard).join('')}</div>` : cEmpty('No slots yet — publish your first one above.')}`;
}

function alumniSlotCard(s) {
  return cCard(`
    <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px">
      ${cChip(s.kind === 'mock' ? '🎤 Mock interview' : '🧭 Mentorship', s.kind === 'mock' ? '#e64980' : '#7c6ff7')}
      ${cChip(s.status, C_STATUS_COLOR[s.status] || '#888')}
    </div>
    <div style="font-weight:700;font-size:15px">${cEsc(s.topic)}</div>
    <div style="font-size:12px;color:var(--tx2);margin:4px 0 10px">${cWhen(s.start_at)} • ${s.duration} min${s.company ? ' • ' + cEsc(s.company) : ''}</div>
    ${s.student ? `<div style="font-size:12px;color:var(--tx2);margin-bottom:8px">👤 Booked by <b>${cEsc(s.student.name)}</b> ${s.student.branch ? '(' + cEsc(s.student.branch) + ')' : ''}${s.student_note ? `<div style="color:var(--tx3);margin-top:4px">“${cEsc(s.student_note)}”</div>` : ''}</div>` : ''}
    ${s.feedback ? `<div style="font-size:12px;color:var(--gn);margin-bottom:8px">✅ Feedback sent</div>` : ''}
    ${s.rating ? `<div style="font-size:12px;color:var(--gd);margin-bottom:8px">⭐ ${s.rating}/5 from student</div>` : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${s.status === 'booked' ? `<button class="btn btn-sm btn-primary" onclick="giveSlotFeedback('${s.id}')">📝 Feedback</button>` : ''}
      ${s.status === 'booked' && s.student ? `<button class="btn btn-sm" onclick="messageAlumni('${s.student.id}')">💬 Message</button>` : ''}
      ${s.status === 'open' ? `<button class="btn btn-sm btn-danger" onclick="deleteSlot('${s.id}')">🗑 Remove</button>` : ''}
      ${s.status === 'booked' ? `<button class="btn btn-sm btn-danger" onclick="cancelSession('${s.id}')">Cancel</button>` : ''}
    </div>`);
}

async function createSlot() {
  const res = await api('/mentorship.php/slots', { method: 'POST', body: {
    kind: cVal('slot-kind') || (document.getElementById('slot-kind') || {}).value,
    topic: cVal('slot-topic'),
    company: cVal('slot-company'),
    start_at: cVal('slot-start'),
    duration: cVal('slot-duration'),
    meet_link: cVal('slot-link'),
    notes: cVal('slot-notes'),
  } });
  if (!res.success) { toast(res.message || 'Could not publish slot', 'error'); return; }
  toast('Slot published');
  renderAlumniSlots();
}

async function deleteSlot(id) {
  const res = await api('/mentorship.php/slots/' + id, { method: 'DELETE' });
  toast(res.message || (res.success ? 'Removed' : 'Failed'), res.success ? 'success' : 'error');
  renderAlumniSlots();
}

async function giveSlotFeedback(id) {
  const feedback = window.prompt('Feedback for the student (strengths, gaps, next steps):');
  if (feedback === null) return;
  const res = await api('/mentorship.php/slots/' + id + '/feedback', { method: 'POST', body: { feedback } });
  toast(res.message || 'Saved', res.success ? 'success' : 'error');
  renderMentorship();
}

async function renderStudentMentorship() {
  const [availRes, myRes] = await Promise.all([api('/mentorship.php/available'), api('/mentorship.php/my')]);
  const avail = availRes.success ? availRes.slots : [];
  const mine = myRes.success ? myRes.slots : [];

  document.getElementById('mentorship-body').innerHTML = `
    <div style="font-weight:700;font-size:16px;margin-bottom:12px">📅 My sessions</div>
    ${mine.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-bottom:26px">${mine.map(studentSlotCard).join('')}</div>`
      : `<div style="margin-bottom:26px">${cEmpty('No sessions booked yet.')}</div>`}
    <div style="font-weight:700;font-size:16px;margin-bottom:12px">✨ Available slots</div>
    ${avail.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px">${avail.map(openSlotCard).join('')}</div>`
      : cEmpty('No open slots right now — check back soon or message an alumnus directly.')}`;
}

function openSlotCard(s) {
  return cCard(`
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
      ${cAvatar(s.alumni, 38)}
      <div><div style="font-weight:700;font-size:14px">${cEsc(s.alumni ? s.alumni.name : 'Alumni')}</div>
      <div style="font-size:11px;color:var(--tx3)">${cEsc([s.alumni && s.alumni.job_title, s.alumni && s.alumni.company].filter(Boolean).join(' @ '))}</div></div>
    </div>
    ${cChip(s.kind === 'mock' ? '🎤 Mock interview' : '🧭 Mentorship', s.kind === 'mock' ? '#e64980' : '#7c6ff7')}
    <div style="font-weight:700;margin-top:10px">${cEsc(s.topic)}</div>
    <div style="font-size:12px;color:var(--tx2);margin:4px 0 10px">${cWhen(s.start_at)} • ${s.duration} min</div>
    ${s.notes ? `<div style="font-size:12px;color:var(--tx3);margin-bottom:10px">${cEsc(s.notes)}</div>` : ''}
    <button class="btn btn-sm btn-primary" onclick="bookSlot('${s.id}')">Book this slot</button>`);
}

function studentSlotCard(s) {
  return cCard(`
    <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px">
      ${cChip(s.kind === 'mock' ? '🎤 Mock interview' : '🧭 Mentorship', s.kind === 'mock' ? '#e64980' : '#7c6ff7')}
      ${cChip(s.status, C_STATUS_COLOR[s.status] || '#888')}
    </div>
    <div style="font-weight:700">${cEsc(s.topic)}</div>
    <div style="font-size:12px;color:var(--tx2);margin:4px 0 8px">${cWhen(s.start_at)} • ${s.duration} min • with ${cEsc(s.alumni ? s.alumni.name : 'Alumni')}</div>
    ${s.meet_link ? `<a href="${cEsc(s.meet_link)}" target="_blank" rel="noreferrer" style="font-size:12px;color:var(--cy)">🔗 Join link</a>` : ''}
    ${s.feedback ? `<div style="font-size:12px;color:var(--tx2);margin-top:10px;padding:10px;background:rgba(56,217,169,.08);border-radius:9px"><b>Mentor feedback:</b><br>${cEsc(s.feedback)}</div>` : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
      ${s.status === 'completed' && !s.rating ? `<button class="btn btn-sm btn-primary" onclick="reviewSession('${s.id}')">⭐ Rate session</button>` : ''}
      ${s.status === 'booked' ? `<button class="btn btn-sm btn-danger" onclick="cancelSession('${s.id}')">Cancel</button>` : ''}
      ${s.alumni ? `<button class="btn btn-sm" onclick="messageAlumni('${s.alumni.id}')">💬 Message</button>` : ''}
    </div>`);
}

async function bookSlot(id) {
  const note = window.prompt('What do you want help with? (optional)') || '';
  const res = await api('/mentorship.php/slots/' + id + '/book', { method: 'POST', body: { note } });
  toast(res.message || (res.success ? 'Booked' : 'Failed'), res.success ? 'success' : 'error');
  renderMentorship();
}
async function cancelSession(id) {
  const res = await api('/mentorship.php/slots/' + id + '/cancel', { method: 'POST' });
  toast(res.message || 'Cancelled', res.success ? 'success' : 'error');
  renderMentorship();
}
async function reviewSession(id) {
  const rating = window.prompt('Rate this session 1-5:');
  if (rating === null) return;
  const review = window.prompt('Any comments? (optional)') || '';
  const res = await api('/mentorship.php/slots/' + id + '/review', { method: 'POST', body: { rating, review } });
  toast(res.message || 'Thanks!', res.success ? 'success' : 'error');
  renderMentorship();
}

/* ══════════════ 3. INTERVIEW EXPERIENCE FEED ══════════════ */
let _expRoundCount = 1;

async function renderExperienceFeed() {
  const body = document.getElementById('experiences-body');
  body.innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
      <input id="exp-q" class="inp" placeholder="Search company, role or tips…" style="flex:1;min-width:200px" onkeyup="if(event.key==='Enter')loadExperiences()">
      <select id="exp-sort" class="inp" style="width:150px" onchange="loadExperiences()"><option value="new">Newest</option><option value="top">Most upvoted</option></select>
      <button class="btn btn-sm btn-primary" onclick="loadExperiences()">🔍 Search</button>
      <button class="btn btn-sm" onclick="toggleExpForm()">✍ Share experience</button>
    </div>
    <div id="exp-form" class="hidden" style="margin-bottom:18px"></div>
    <div id="exp-list">${cEmpty('Loading…')}</div>`;
  await loadExperiences();
}

function toggleExpForm() {
  const el = document.getElementById('exp-form');
  if (!el.classList.contains('hidden')) { el.classList.add('hidden'); return; }
  _expRoundCount = 1;
  el.classList.remove('hidden');
  el.innerHTML = cCard(`
    <div style="font-weight:700;margin-bottom:12px">✍ Share your interview experience</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">
      <input id="exp-company" class="inp" placeholder="Company *">
      <input id="exp-role" class="inp" placeholder="Role (e.g. SDE-1)">
      <input id="exp-year" class="inp" placeholder="Year">
      <input id="exp-ctc" class="inp" placeholder="CTC (optional)">
      <select id="exp-result" class="inp"><option value="selected">Selected</option><option value="rejected">Rejected</option><option value="in-process">In process</option></select>
      <select id="exp-difficulty" class="inp"><option>Easy</option><option selected>Medium</option><option>Hard</option><option>Very Hard</option></select>
    </div>
    <div id="exp-rounds" style="margin-top:12px">${expRoundRow(0)}</div>
    <button class="btn btn-sm" style="margin-top:8px" onclick="addExpRound()">➕ Add round</button>
    <textarea id="exp-tips" class="inp" rows="3" placeholder="Tips for juniors — what to prepare, what surprised you…" style="margin-top:12px;width:100%"></textarea>
    <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="submitExperience()">Publish</button>`);
}

function expRoundRow(i) {
  return `<div style="display:grid;grid-template-columns:180px 1fr;gap:8px;margin-bottom:8px">
    <input class="inp exp-round-name" placeholder="Round ${i + 1} name">
    <input class="inp exp-round-details" placeholder="Questions asked / how it went">
  </div>`;
}
function addExpRound() {
  document.getElementById('exp-rounds').insertAdjacentHTML('beforeend', expRoundRow(_expRoundCount++));
}

async function submitExperience() {
  const names = [...document.querySelectorAll('.exp-round-name')].map((e) => e.value.trim());
  const details = [...document.querySelectorAll('.exp-round-details')].map((e) => e.value.trim());
  const rounds = names.map((n, i) => ({ name: n, details: details[i] || '' })).filter((r) => r.name);

  const res = await api('/experiences.php', { method: 'POST', body: {
    company: cVal('exp-company'), role: cVal('exp-role'), year: cVal('exp-year'), ctc: cVal('exp-ctc'),
    result: (document.getElementById('exp-result') || {}).value,
    difficulty: (document.getElementById('exp-difficulty') || {}).value,
    rounds, tips: cVal('exp-tips'),
  } });
  if (!res.success) { toast(res.message || 'Could not publish', 'error'); return; }
  toast('Experience shared 🎉');
  document.getElementById('exp-form').classList.add('hidden');
  loadExperiences();
}

async function loadExperiences() {
  const list = document.getElementById('exp-list');
  const qs = new URLSearchParams();
  if (cVal('exp-q')) qs.set('q', cVal('exp-q'));
  const sortEl = document.getElementById('exp-sort');
  if (sortEl && sortEl.value === 'top') qs.set('sort', 'top');

  const res = await api('/experiences.php' + (qs.toString() ? '?' + qs.toString() : ''));
  if (!res.success) { list.innerHTML = cEmpty(res.message || 'Could not load feed'); return; }
  if (!res.experiences.length) { list.innerHTML = cEmpty('No experiences shared yet — be the first!'); return; }

  list.innerHTML = res.experiences.map((e) => cCard(`
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
      ${cAvatar(e.author, 40)}
      <div style="flex:1;min-width:0">
        <div style="font-weight:700">${cEsc(e.author.name)} <span style="font-size:11px;color:var(--tx3)">• ${cAgo(e.created_at)}</span></div>
        <div style="font-size:12px;color:var(--tx2)">${cEsc([e.author.job_title, e.author.company].filter(Boolean).join(' @ ') || (e.author.role === 'admin' ? 'Alumni' : 'Student'))}</div>
      </div>
      ${e.mine ? `<button class="btn btn-sm btn-danger" onclick="deleteExperience('${e.id}')">🗑</button>` : ''}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${cChip(e.company, '#4dabf7')}
      ${e.role ? cChip(e.role, '#7c6ff7') : ''}
      ${cChip(e.difficulty, '#f5c842')}
      ${cChip(e.result, e.result === 'selected' ? '#38d9a9' : e.result === 'rejected' ? '#ff6b6b' : '#ff922b')}
      ${e.year ? cChip(e.year, '#888') : ''}
      ${e.ctc ? cChip(e.ctc, '#20c997') : ''}
    </div>
    ${e.rounds.length ? `<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px">${e.rounds.map((r, i) => `
      <div style="padding:10px 12px;background:rgba(255,255,255,.04);border-radius:9px">
        <div style="font-size:12px;font-weight:700">Round ${i + 1}: ${cEsc(r.name)}</div>
        ${r.details ? `<div style="font-size:12px;color:var(--tx2);margin-top:4px;white-space:pre-wrap">${cEsc(r.details)}</div>` : ''}
      </div>`).join('')}</div>` : ''}
    ${e.tips ? `<div style="font-size:13px;color:var(--tx2);padding:10px 12px;background:rgba(56,217,169,.07);border-radius:9px;white-space:pre-wrap;margin-bottom:10px"><b>💡 Tips:</b> ${cEsc(e.tips)}</div>` : ''}
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <button class="btn btn-sm" onclick="upvoteExperience('${e.id}')">${e.upvoted ? '💜' : '🤍'} ${e.upvotes}</button>
      <button class="btn btn-sm" onclick="commentExperience('${e.id}')">💬 ${e.comments.length}</button>
      ${e.author.role === 'admin' ? `<button class="btn btn-sm" onclick="messageAlumni('${e.author.id}')">Ask ${cEsc(e.author.name.split(' ')[0])}</button>` : ''}
    </div>
    ${e.comments.length ? `<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px">${e.comments.map((c) => `
      <div style="font-size:12px;color:var(--tx2)"><b>${cEsc(c.author.name)}</b> <span style="color:var(--tx3)">${cAgo(c.created_at)}</span><br>${cEsc(c.text)}</div>`).join('')}</div>` : ''}
  `, 'margin-bottom:14px')).join('');
}

async function upvoteExperience(id) {
  const res = await api('/experiences.php/' + id + '/upvote', { method: 'POST' });
  if (!res.success) { toast(res.message || 'Failed', 'error'); return; }
  loadExperiences();
}
async function commentExperience(id) {
  const text = window.prompt('Your comment / follow-up question:');
  if (!text) return;
  const res = await api('/experiences.php/' + id + '/comment', { method: 'POST', body: { text } });
  toast(res.message || 'Added', res.success ? 'success' : 'error');
  loadExperiences();
}
async function deleteExperience(id) {
  const res = await api('/experiences.php/' + id, { method: 'DELETE' });
  toast(res.message || 'Deleted', res.success ? 'success' : 'error');
  loadExperiences();
}

/* ══════════════ 4. REFERRAL REQUESTS ══════════════ */
async function renderReferrals() {
  const isAlumni = currentUser && currentUser.role === 'admin';
  document.getElementById('referrals-title').textContent = isAlumni ? 'Referral Requests' : 'My Referral Requests';
  document.getElementById('referrals-sub').textContent = isAlumni
    ? 'Students asking you for a referral at your company'
    : 'Ask alumni to refer you for open roles at their company';

  const body = document.getElementById('referrals-body');
  body.innerHTML = cEmpty('Loading…');

  const res = await api('/referrals.php');
  const list = res.success ? res.referrals : [];

  const form = isAlumni ? '' : cCard(`
    <div style="font-weight:700;margin-bottom:12px">🤝 Request a referral</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">
      <select id="ref-alumni" class="inp"><option value="">Select alumnus…</option></select>
      <input id="ref-company" class="inp" placeholder="Company *">
      <input id="ref-role" class="inp" placeholder="Role / Job ID *">
      <input id="ref-job" class="inp" placeholder="Job posting link">
      <input id="ref-resume" class="inp" placeholder="Resume link (Drive/GitHub)">
    </div>
    <textarea id="ref-message" class="inp" rows="3" placeholder="Why are you a good fit? Keep it short and specific." style="margin-top:10px;width:100%"></textarea>
    <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="submitReferral()">Send request</button>`, 'margin-bottom:20px');

  body.innerHTML = form + (list.length
    ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">${list.map((r) => referralCard(r, isAlumni)).join('')}</div>`
    : cEmpty(isAlumni ? 'No referral requests yet.' : 'No requests yet — send your first one above.'));

  if (!isAlumni) {
    const alumniRes = await api('/alumni.php?referral=1');
    const sel = document.getElementById('ref-alumni');
    if (sel && alumniRes.success) {
      sel.innerHTML = '<option value="">Select alumnus…</option>' + alumniRes.alumni.map((a) =>
        `<option value="${a.id}" data-company="${cEsc(a.company)}">${cEsc(a.name)}${a.company ? ' — ' + cEsc(a.company) : ''}</option>`).join('');
      sel.onchange = () => {
        const opt = sel.options[sel.selectedIndex];
        const co = opt && opt.getAttribute('data-company');
        if (co && !cVal('ref-company')) document.getElementById('ref-company').value = co;
      };
      if (window._referralPrefill) {
        sel.value = window._referralPrefill.id;
        if (window._referralPrefill.company) document.getElementById('ref-company').value = window._referralPrefill.company;
        window._referralPrefill = null;
      }
    }
  }
}

function prefillReferral(id, company) {
  window._referralPrefill = { id, company };
  navigate('referrals');
}

function referralCard(r, isAlumni) {
  const other = isAlumni ? r.student : r.alumni;
  return cCard(`
    <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:10px">
      <div style="font-weight:700">${cEsc(other.name)}</div>
      ${cChip(r.status, C_STATUS_COLOR[r.status] || '#888')}
    </div>
    <div style="font-size:12px;color:var(--tx2);margin-bottom:8px">${cEsc(r.role)} @ ${cEsc(r.company)} • ${cAgo(r.created_at)}</div>
    ${isAlumni && r.student.branch ? `<div style="font-size:11px;color:var(--tx3);margin-bottom:8px">${cEsc(r.student.branch)}${r.student.roll_no ? ' • ' + cEsc(r.student.roll_no) : ''}${r.student.cgpa ? ' • CGPA ' + r.student.cgpa : ''}</div>` : ''}
    ${r.message ? `<div style="font-size:12px;color:var(--tx2);margin-bottom:8px;white-space:pre-wrap">${cEsc(r.message)}</div>` : ''}
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
      ${r.job_link ? `<a href="${cEsc(r.job_link)}" target="_blank" rel="noreferrer" style="font-size:12px;color:var(--cy)">🔗 Job link</a>` : ''}
      ${r.resume_link ? `<a href="${cEsc(r.resume_link)}" target="_blank" rel="noreferrer" style="font-size:12px;color:var(--cy)">📄 Resume</a>` : ''}
    </div>
    ${r.response_note ? `<div style="font-size:12px;color:var(--tx2);padding:9px;background:rgba(255,255,255,.04);border-radius:8px;margin-bottom:10px"><b>Reply:</b> ${cEsc(r.response_note)}</div>` : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${isAlumni && r.status === 'pending' ? `
        <button class="btn btn-sm btn-primary" onclick="setReferralStatus('${r.id}','accepted')">✅ Accept</button>
        <button class="btn btn-sm btn-danger" onclick="setReferralStatus('${r.id}','declined')">✕ Decline</button>` : ''}
      ${isAlumni && r.status === 'accepted' ? `<button class="btn btn-sm btn-primary" onclick="setReferralStatus('${r.id}','referred')">🚀 Mark referred</button>` : ''}
      <button class="btn btn-sm" onclick="messageAlumni('${other.id}')">💬 Message</button>
    </div>`);
}

async function submitReferral() {
  const res = await api('/referrals.php', { method: 'POST', body: {
    alumni: (document.getElementById('ref-alumni') || {}).value,
    company: cVal('ref-company'), role: cVal('ref-role'),
    job_link: cVal('ref-job'), resume_link: cVal('ref-resume'), message: cVal('ref-message'),
  } });
  toast(res.message || (res.success ? 'Sent' : 'Failed'), res.success ? 'success' : 'error');
  if (res.success) renderReferrals();
}

async function setReferralStatus(id, status) {
  const note = window.prompt('Add a note for the student (optional):') || '';
  const res = await api('/referrals.php/' + id + '/status', { method: 'POST', body: { status, note } });
  toast(res.message || 'Updated', res.success ? 'success' : 'error');
  renderReferrals();
}

/* ══════════════ 5. Q&A FORUM ══════════════ */
async function renderForum() {
  document.getElementById('forum-body').innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
      <input id="forum-q" class="inp" placeholder="Search questions…" style="flex:1;min-width:200px" onkeyup="if(event.key==='Enter')loadForum()">
      <label style="display:flex;gap:6px;align-items:center;font-size:12px;color:var(--tx2)"><input type="checkbox" id="forum-unanswered" onchange="loadForum()"> Unanswered only</label>
      <button class="btn btn-sm btn-primary" onclick="loadForum()">🔍 Search</button>
      <button class="btn btn-sm" onclick="toggleAskForm()">❓ Ask a question</button>
    </div>
    <div id="forum-form" class="hidden" style="margin-bottom:18px"></div>
    <div id="forum-list">${cEmpty('Loading…')}</div>`;
  await loadForum();
}

function toggleAskForm() {
  const el = document.getElementById('forum-form');
  if (!el.classList.contains('hidden')) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.innerHTML = cCard(`
    <div style="font-weight:700;margin-bottom:12px">❓ Ask the alumni network</div>
    <input id="ask-title" class="inp" placeholder="Your question in one line *" style="width:100%">
    <textarea id="ask-body" class="inp" rows="3" placeholder="Add details — what you tried, your year, target role…" style="margin-top:10px;width:100%"></textarea>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:10px">
      <input id="ask-company" class="inp" placeholder="Company (optional)">
      <input id="ask-tags" class="inp" placeholder="Tags, comma separated">
    </div>
    <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="submitQuestion()">Post question</button>`);
}

async function submitQuestion() {
  const res = await api('/forum.php', { method: 'POST', body: {
    title: cVal('ask-title'), body: cVal('ask-body'), company: cVal('ask-company'),
    tags: cVal('ask-tags').split(',').map((t) => t.trim()).filter(Boolean),
  } });
  if (!res.success) { toast(res.message || 'Could not post', 'error'); return; }
  toast('Question posted');
  document.getElementById('forum-form').classList.add('hidden');
  loadForum();
}

async function loadForum() {
  const list = document.getElementById('forum-list');
  const qs = new URLSearchParams();
  if (cVal('forum-q')) qs.set('q', cVal('forum-q'));
  if (cChecked('forum-unanswered')) qs.set('unanswered', '1');

  const res = await api('/forum.php' + (qs.toString() ? '?' + qs.toString() : ''));
  if (!res.success) { list.innerHTML = cEmpty(res.message || 'Could not load forum'); return; }
  if (!res.questions.length) { list.innerHTML = cEmpty('No questions yet — ask the first one!'); return; }

  list.innerHTML = res.questions.map((q) => cCard(`
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
      ${cAvatar(q.author, 36)}
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:var(--tx2)"><b>${cEsc(q.author.name)}</b> • ${cAgo(q.created_at)}</div>
      </div>
      ${q.solved ? cChip('Solved', '#38d9a9') : ''}
      ${q.mine ? `<button class="btn btn-sm btn-danger" onclick="deleteQuestion('${q.id}')">🗑</button>` : ''}
    </div>
    <div style="font-weight:700;font-size:15px;margin-bottom:6px">${cEsc(q.title)}</div>
    ${q.body ? `<div style="font-size:13px;color:var(--tx2);white-space:pre-wrap;margin-bottom:10px">${cEsc(q.body)}</div>` : ''}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      ${q.company ? cChip(q.company, '#4dabf7') : ''}${q.tags.map((t) => cChip(t, '#7c6ff7')).join('')}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
      <button class="btn btn-sm" onclick="upvoteQuestion('${q.id}')">${q.upvoted ? '💜' : '🤍'} ${q.upvotes}</button>
      <button class="btn btn-sm btn-primary" onclick="answerQuestion('${q.id}')">✍ Answer (${q.answers.length})</button>
    </div>
    ${q.answers.length ? `<div style="display:flex;flex-direction:column;gap:10px">${q.answers.map((a) => `
      <div style="padding:11px 13px;background:${a.accepted ? 'rgba(56,217,169,.08)' : 'rgba(255,255,255,.04)'};border-radius:10px">
        <div style="font-size:12px;color:var(--tx2);margin-bottom:5px"><b>${cEsc(a.author.name)}</b>${a.author.role === 'admin' ? ' 🎓' : ''} ${a.author.company ? '• ' + cEsc(a.author.company) : ''} • ${cAgo(a.created_at)} ${a.accepted ? '• ✅ Accepted' : ''}</div>
        <div style="font-size:13px;white-space:pre-wrap">${cEsc(a.text)}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn btn-sm" onclick="upvoteAnswer('${q.id}','${a.id}')">${a.upvoted ? '💜' : '🤍'} ${a.upvotes}</button>
          ${q.mine && !a.accepted ? `<button class="btn btn-sm" onclick="acceptAnswer('${q.id}','${a.id}')">✅ Accept</button>` : ''}
        </div>
      </div>`).join('')}</div>` : ''}
  `, 'margin-bottom:14px')).join('');
}

async function answerQuestion(id) {
  const text = window.prompt('Your answer:');
  if (!text) return;
  const res = await api('/forum.php/' + id + '/answer', { method: 'POST', body: { text } });
  toast(res.message || 'Posted', res.success ? 'success' : 'error');
  loadForum();
}
async function upvoteQuestion(id) { await api('/forum.php/' + id + '/upvote', { method: 'POST' }); loadForum(); }
async function upvoteAnswer(qid, aid) { await api('/forum.php/' + qid + '/answer/' + aid + '/upvote', { method: 'POST' }); loadForum(); }
async function acceptAnswer(qid, aid) {
  const res = await api('/forum.php/' + qid + '/answer/' + aid + '/accept', { method: 'POST' });
  toast(res.message || 'Accepted', res.success ? 'success' : 'error');
  loadForum();
}
async function deleteQuestion(id) {
  const res = await api('/forum.php/' + id, { method: 'DELETE' });
  toast(res.message || 'Deleted', res.success ? 'success' : 'error');
  loadForum();
}

/* ══════════════ PROFILE ADD-ON (alumni & student connect fields) ══════════════ */
// Injected into the existing Profile page by legacy-app.js → renderProfile().
async function renderConnectProfile(u) {
  const page = document.getElementById('page-profile');
  if (!page) return;
  // Right after login the in-memory user may not carry the connect fields yet.
  if (u.company === undefined && u.dream_companies === undefined) {
    const res = await api('/profile.php');
    if (res.success) { Object.assign(u, res.user); if (window.currentUser) Object.assign(window.currentUser, res.user); }
  }
  let box = document.getElementById('connect-profile');
  if (!box) {
    box = document.createElement('div');
    box.id = 'connect-profile';
    box.style.marginTop = '20px';
    page.appendChild(box);
  }

  if (u.role === 'student') {
    box.innerHTML = cCard(`
      <div style="font-weight:700;margin-bottom:12px">🎯 Placement goals</div>
      <input id="pf-dream" class="inp" style="width:100%" placeholder="Dream companies, comma separated (e.g. Zoho, Amazon)" value="${cEsc((u.dream_companies || []).join(', '))}">
      <div style="font-size:11px;color:var(--tx3);margin-top:6px">We use this to surface alumni working at these companies.</div>`);
    return;
  }

  if (u.role !== 'admin') { box.innerHTML = ''; return; }

  box.innerHTML = cCard(`
    <div style="font-weight:700;margin-bottom:12px">🎓 Alumni mentor profile</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">
      <input id="pf-company" class="inp" placeholder="Current company" value="${cEsc(u.company || '')}">
      <input id="pf-jobtitle" class="inp" placeholder="Job title" value="${cEsc(u.job_title || '')}">
      <input id="pf-exp" class="inp" type="number" min="0" placeholder="Years of experience" value="${u.experience_years == null ? '' : u.experience_years}">
      <input id="pf-linkedin" class="inp" placeholder="LinkedIn URL" value="${cEsc(u.linkedin || '')}">
    </div>
    <input id="pf-skills" class="inp" style="width:100%;margin-top:10px" placeholder="Skills you can mentor on, comma separated" value="${cEsc((u.skills || []).join(', '))}">
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:12px">
      <label style="display:flex;gap:7px;align-items:center;font-size:13px;color:var(--tx2)"><input type="checkbox" id="pf-open-mentor" ${u.open_to_mentorship !== false ? 'checked' : ''}> Open to mentorship & mock interviews</label>
      <label style="display:flex;gap:7px;align-items:center;font-size:13px;color:var(--tx2)"><input type="checkbox" id="pf-open-ref" ${u.open_to_referral !== false ? 'checked' : ''}> Open to referral requests</label>
    </div>`);
}

// Extra fields merged into the /profile.php save payload.
function connectProfileBody() {
  const body = {};
  if (document.getElementById('pf-dream')) body.dream_companies = cVal('pf-dream');
  if (document.getElementById('pf-company')) {
    body.company = cVal('pf-company');
    body.job_title = cVal('pf-jobtitle');
    body.experience_years = cVal('pf-exp');
    body.linkedin = cVal('pf-linkedin');
    body.skills = cVal('pf-skills');
    body.open_to_mentorship = cChecked('pf-open-mentor');
    body.open_to_referral = cChecked('pf-open-ref');
  }
  return body;
}
