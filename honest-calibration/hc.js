(function () {
 var PHASE_NAMES = {
 1: 'Honest Ground',
 2: 'Honest Name',
 3: 'Honest Push',
 4: 'Honest Saturate',
 5: 'Honest Actions'
 };

 function hcTrack(name, params) {
 if (typeof window.hcTrack === 'function' && window.hcTrack !== hcTrack) {
 window.hcTrack(name, params || {});
 return;
 }
 if (typeof gtag === 'function') {
 var p = params || {};
 if (!p.page_path) p.page_path = '/honest-calibration/';
 gtag('event', name, p);
 }
 }
 // Prefer global helper defined in <head>
 var track = typeof window.hcTrack === 'function' ? window.hcTrack.bind(window) : hcTrack;

 const OUTCOMES = {
 senior: {
 label: "Inhabit the senior role",
 blurb: "Take the seat for real. Identity, authority, and the human passage of succession, not just the title.",
 nextWeek: "Name one visible leadership move that proves the new seat this week (a decision, a conversation, or a boundary) and say it out loud to a peer before Monday gets loud.",
 checks: {
 d30: { title: "Seat check", body: "Did the named move happen? Where did the old role still run the calendar? Recalibrate identity without theater." },
 d60: { title: "Authority under pressure", body: "When the org pushed, did you lead from the new seat or the old one? Peer honesty on what’s performing vs. adopted." },
 d90: { title: "Passage or relapse", body: "Is the succession sticky? Double down on the behaviors that held. or redesign the support around the seat change." }
 }
 },
 change: {
 label: "Convert the investment",
 blurb: "Turn programs, assessments, or transformation spend into lived adoption that survives the busy week, not another kickoff.",
 nextWeek: "Pick the one change behavior that must survive a packed calendar. Schedule it as a non-negotiable; tell one peer what ‘done’ looks like by Friday.",
 checks: {
 d30: { title: "Did adoption start?", body: "Did the behavior happen more than once? What got in the way. capacity, politics, or unclear ownership?" },
 d60: { title: "Holding under load", body: "Under real pressure, is the change practiced or performed? Name the gap without blame." },
 d90: { title: "Stick or redesign", body: "What’s stuck in the business? Scale what works or redesign the adoption loop. don’t add another program." }
 }
 },
 capabilities: {
 label: "Capabilities into a team / network",
 blurb: "Move a capability (a skill, practice, or standard) into a team or across a network so it isn’t trapped in one hero.",
 nextWeek: "Transfer one capability artifact (decision rule, ritual, or standard) to two people who didn’t invent it. and watch them use it once without you in the room.",
 checks: {
 d30: { title: "Transfer happened?", body: "Who else can run it now? Where is it still stuck in the originator?" },
 d60: { title: "Network or bottleneck", body: "Is the capability traveling across the network, or bouncing back to the same few people?" },
 d90: { title: "Owned by the system", body: "Can the team/network run it without the original owner? Codify or kill what’s still theater." }
 }
 },
 collaborate: {
 label: "Collaborate across silos",
 blurb: "Cross-boundary work after team shifts or transformation. Honesty between peers, not more meetings that protect turf.",
 nextWeek: "Have one cross-boundary conversation you’ve been avoiding. Open with what’s true for you; ask what’s true for them; leave with one shared next move.",
 checks: {
 d30: { title: "Honest contact", body: "Did the conversation happen? What got named that usually stays polite?" },
 d60: { title: "Shared ownership", body: "Are decisions joint under pressure, or reverting to silos? Peer check without scorekeeping." },
 d90: { title: "New working agreement", body: "What collaboration habit stuck? Formalize it. or name why it didn’t and recalibrate." }
 }
 }
 };

 const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const grid = document.getElementById("outcome-grid");
 const dyn = document.getElementById("outcome-dynamic");
 const nextCopy = document.getElementById("next-week-copy");
 const checkGrid = document.getElementById("checkin-grid");
 let currentOutcome = "change";

 Object.entries(OUTCOMES).forEach(function ([key, o]) {
 const btn = document.createElement("button");
 btn.type = "button";
 btn.className = "outcome-btn" + (key === currentOutcome ? " active" : "");
 btn.dataset.outcome = key;
 btn.setAttribute("aria-pressed", key === currentOutcome ? "true" : "false");
 btn.innerHTML = "<strong>" + o.label + "</strong><span>" + o.blurb + "</span>";
 btn.addEventListener("click", function () { selectOutcome(key); });
 grid.appendChild(btn);
 });

 function selectOutcome(key) {
 var o = OUTCOMES[key];
 track('outcome_path_select', {
 event_category: 'honest_calibration',
 section_id: 'phases',
 outcome: key,
 label: o ? o.label : key,
 event_label: key
 });
 currentOutcome = key;
 document.querySelectorAll(".outcome-btn").forEach(function (b) {
 const on = b.dataset.outcome === key;
 b.classList.toggle("active", on);
 b.setAttribute("aria-pressed", on ? "true" : "false");
 });
 if (reduceMotion) {
 renderOutcome(key);
 return;
 }
 dyn.classList.add("is-fading");
 setTimeout(function () {
 renderOutcome(key);
 dyn.classList.remove("is-fading");
 }, 200);
 }

 function renderOutcome(key) {
 const o = OUTCOMES[key];
 nextCopy.textContent = o.nextWeek;
 checkGrid.innerHTML = "";
 [["d30", "30 days"], ["d60", "60 days"], ["d90", "90 days"]].forEach(function (pair) {
 const k = pair[0], label = pair[1];
 const c = o.checks[k];
 const card = document.createElement("div");
 card.className = "check-card";
 card.tabIndex = 0;
 card.setAttribute("role", "button");
 card.setAttribute("aria-expanded", "false");
 card.dataset.checkin = k;
 card.innerHTML =
 '<span class="chev" aria-hidden="true">▾</span>' +
 '<div class="when">' + label + "</div>" +
 "<h4>" + c.title + "</h4>" +
 '<div class="detail"><span>' + c.body + "</span></div>";
 function toggle() {
 const open = !card.classList.contains("open");
 document.querySelectorAll(".check-card").forEach(function (x) {
 if (x !== card) {
 x.classList.remove("open");
 x.setAttribute("aria-expanded", "false");
 }
 });
 card.classList.toggle("open", open);
 card.setAttribute("aria-expanded", open ? "true" : "false");
 track('checkin_toggle', {
 event_category: 'honest_calibration',
 section_id: 'phases',
 checkin: k,
 label: label,
 open: open,
 outcome: currentOutcome,
 event_label: k + (open ? '_open' : '_close')
 });
 }
 card.addEventListener("click", toggle);
 card.addEventListener("keydown", function (e) {
 if (e.key === "Enter" || e.key === " ") {
 e.preventDefault();
 toggle();
 }
 });
 checkGrid.appendChild(card);
 });
 }
 renderOutcome(currentOutcome);

 const panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));
 const tabs = Array.prototype.slice.call(document.querySelectorAll(".phase-rail [data-phase]"));
 const jumpBtns = Array.prototype.slice.call(document.querySelectorAll(".phase-nav [data-jump]"));

 function showPhase(n, source) {
 var name = PHASE_NAMES[n] || ('phase_' + n);
 track('phase_select', {
 event_category: 'honest_calibration',
 section_id: 'phases',
 phase: String(n),
 phase_name: name,
 label: name,
 source: source || 'rail',
 event_label: 'phase_' + n
 });
 tabs.forEach(function (t) {
 const on = t.dataset.phase === String(n);
 t.classList.toggle("active", on);
 t.setAttribute("aria-selected", on ? "true" : "false");
 t.tabIndex = on ? 0 : -1;
 });
 panels.forEach(function (p) {
 const on = p.dataset.panel === String(n);
 p.hidden = !on;
 if (on) {
 p.classList.remove("is-enter");
 void p.offsetWidth;
 p.classList.add("is-enter");
 }
 });
 jumpBtns.forEach(function (b, i) {
 b.classList.toggle("active", i === n - 1);
 });
 }

 tabs.forEach(function (t) {
 t.addEventListener("click", function () {
 showPhase(Number(t.dataset.phase), 'rail');
 });
 t.addEventListener("keydown", function (e) {
 const idx = tabs.indexOf(t);
 let next = null;
 if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(idx + 1) % tabs.length];
 if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(idx - 1 + tabs.length) % tabs.length];
 if (e.key === "Home") next = tabs[0];
 if (e.key === "End") next = tabs[tabs.length - 1];
 if (next) {
 e.preventDefault();
 next.focus();
 showPhase(Number(next.dataset.phase), 'keyboard');
 }
 });
 });

 jumpBtns.forEach(function (b) {
 b.addEventListener("click", function () {
 showPhase(Number(b.getAttribute("data-jump").split("-")[1]), 'nav');
 document.getElementById("phases").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
 });
 });

 const progress = document.getElementById("progress");
 function updateProgress() {
 const h = document.documentElement;
 const max = h.scrollHeight - h.clientHeight;
 progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
 }
 window.addEventListener("scroll", updateProgress, { passive: true });
 updateProgress();

 /* ── CTA clicks ───────────────────────────────────────── */
 document.querySelectorAll('[data-cta-id]').forEach(function (el) {
 el.addEventListener('click', function () {
 var ctaId = el.getAttribute('data-cta-id') || 'unknown';
 var href = el.getAttribute('href') || '';
 track('cta_click', {
 event_category: 'honest_calibration',
 cta_id: ctaId,
 label: (el.textContent || '').trim().slice(0, 80),
 link_url: href,
 event_label: ctaId
 });
 if (href.indexOf('/book') !== -1) {
 track('inquire_click', {
 event_category: 'honest_calibration',
 cta_id: ctaId,
 label: (el.textContent || '').trim().slice(0, 80),
 link_url: href,
 event_label: ctaId
 });
 }
 });
 });

 /* Catch any /book link without data-cta-id */
 document.querySelectorAll('a[href="/book"], a[href*="/book"]').forEach(function (a) {
 if (a.getAttribute('data-cta-id')) return;
 a.addEventListener('click', function () {
 track('inquire_click', {
 event_category: 'honest_calibration',
 cta_id: 'book_link',
 label: (a.textContent || '').trim().slice(0, 80),
 link_url: a.getAttribute('href'),
 event_label: 'book_link'
 });
 });
 });

 /* ── Section views (once each via IntersectionObserver) ─ */
 var SECTION_NAMES = {
 hero: 'Hero',
 narrative: 'Not sage on the stage',
 convergence: 'From many rooms to one calibration',
 phases: 'Five phases',
 proof: 'Where this work has already run',
 rooms: 'How Honest Calibration sounded',
 who: 'Buyers who need adoption',
 practice: 'Practice behind the room',
 faq: 'FAQ',
 footer_cta: 'Footer CTA'
 };
 function trackSectionView(sectionId) {
 if (!sectionId || window.__hcSectionSeen[sectionId]) return;
 window.__hcSectionSeen[sectionId] = true;
 track('section_view', {
 event_category: 'honest_calibration',
 section_id: sectionId,
 section_name: SECTION_NAMES[sectionId] || sectionId,
 event_label: sectionId
 });
 }
 function bindSection(el, sectionId) {
 if (!el || !sectionId) return;
 if (!('IntersectionObserver' in window)) {
 trackSectionView(sectionId);
 return;
 }
 var ob = new IntersectionObserver(function (entries) {
 entries.forEach(function (en) {
 if (en.isIntersecting && en.intersectionRatio >= 0.35) {
 trackSectionView(sectionId);
 ob.disconnect();
 }
 });
 }, { threshold: [0, 0.35, 0.5] });
 ob.observe(el);
 }
 document.querySelectorAll('[data-hc-section]').forEach(function (el) {
 bindSection(el, el.getAttribute('data-hc-section'));
 });
})();
