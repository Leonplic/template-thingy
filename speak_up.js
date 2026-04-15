let posts = [
  {
    id: 1,
    type: "experience",
    school: "Prefer not to say",
    title: "Group chat exclusion, it really hurt more than I expected",
    body: "My classmates made a separate group chat without me and would openly talk about plans in front of me. For months I thought maybe it was a mistake. It wasn't. I finally told my adviser and things started to get better. If you're going through this — please talk to someone.",
    name: "Maria S.",
    anonymous: false,
    bullyType: "Cyberbullying",
    date: "2025-04-12",
    supports: 24,
    supported: false,
  },
  {
    id: 2,
    type: "report",
    school: "Philippine Science High School",
    title: "Physical intimidation near the canteen that needs school action",
    body: "A group of Grade 10 students has been blocking and intimidating Grade 8 students during recess. This has happened at least four times this month. I am formally reporting this and requesting the school guidance office to investigate.",
    name: "",
    anonymous: true,
    bullyType: "Physical",
    date: "2025-04-10",
    supports: 18,
    supported: false,
  },
  {
    id: 3,
    type: "witness",
    school: "Quezon City Science High School",
    title: "Saw a classmate being mocked during PE class",
    body: "During our PE class a student was continuously mocked for their weight by two others. The teacher didn't seem to notice. I stood up for them but I think the school needs to address this more formally.",
    name: "J. Reyes",
    anonymous: false,
    bullyType: "Verbal",
    date: "2025-04-08",
    supports: 31,
    supported: false,
  },
];
let nextId = 4,
  editingId = null,
  anonOn = false,
  currentFilter = "all";

function initials(n) {
  if (!n) return "?";
  return n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function badgeClass(t) {
  return t === "experience"
    ? "badge-experience"
    : t === "report"
      ? "badge-report"
      : "badge-witness";
}
function badgeLabel(t) {
  return t === "experience"
    ? "My experience"
    : t === "report"
      ? "Formal report"
      : "Witnessed";
}

function showPage(page, btn) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  if (btn) btn.classList.add("active");
  if (page === "feed") renderPosts();
}

function filterPosts(type, el) {
  currentFilter = type;
  document
    .querySelectorAll(".filter-chip")
    .forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
  renderPosts();
}

function renderPosts() {
  const filtered =
    currentFilter === "all"
      ? posts
      : posts.filter((p) => p.type === currentFilter);
  document.getElementById("stats-grid").innerHTML = `
    <div class="stat-card"><div class="stat-number">${posts.length}</div><div class="stat-label">Total posts</div></div>
    <div class="stat-card"><div class="stat-number">${posts.filter((p) => p.type === "report").length}</div><div class="stat-label">Formal reports</div></div>
    <div class="stat-card"><div class="stat-number">${posts.reduce((a, p) => a + p.supports, 0)}</div><div class="stat-label">Support given</div></div>`;
  const c = document.getElementById("posts-container");
  if (!filtered.length) {
    c.innerHTML =
      '<div class="empty-state"><p style="font-size:15px;font-weight:500;color:var(--color-text-primary);margin-bottom:6px;">No posts yet</p><p style="font-size:13px;">Be the first to share in this category.</p></div>';
    return;
  }
  c.innerHTML = filtered
    .map(
      (post) => `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="post-meta">
          <div class="avatar ${post.anonymous ? "avatar-anon" : "avatar-user"}">${post.anonymous ? "?" : initials(post.name)}</div>
          <div><div class="poster-name">${post.anonymous ? "Anonymous" : post.name || "Anonymous"}</div><div class="post-date">${fmtDate(post.date)}</div></div>
          <span class="post-school">${post.school}</span>
          <span class="post-type-badge ${badgeClass(post.type)}">${badgeLabel(post.type)}</span>
          <span style="font-size:11px;background:var(--gray-50);color:var(--gray-400);padding:2px 8px;border-radius:var(--border-radius-md);">${post.bullyType}</span>
        </div>
      </div>
      <div class="post-title">${post.title}</div>
      <div class="post-body">${post.body}</div>
      <div class="post-footer">
        <div class="post-actions">
          <button class="support-btn ${post.supported ? "active" : ""}" onclick="toggleSupport(${post.id})">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10.5C6 10.5 1 7.5 1 4.5C1 3.1 2.1 2 3.5 2C4.4 2 5.2 2.5 6 3.3C6.8 2.5 7.6 2 8.5 2C9.9 2 11 3.1 11 4.5C11 7.5 6 10.5 6 10.5Z" stroke="currentColor" stroke-width="1.2" fill="${post.supported ? "currentColor" : "none"}"/></svg>
            ${post.supports} support
          </button>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn-edit" onclick="openEdit(${post.id})">Edit</button>
          <button class="btn-danger" onclick="deletePost(${post.id})">Delete</button>
        </div>
      </div>
    </div>`,
    )
    .join("");
}

function toggleSupport(id) {
  const p = posts.find((p) => p.id === id);
  if (!p) return;
  p.supported = !p.supported;
  p.supports += p.supported ? 1 : -1;
  renderPosts();
}

function submitPost() {
  const type = document.getElementById("post-type").value;
  const school = document.getElementById("post-school").value.trim();
  const title = document.getElementById("post-title").value.trim();
  const body = document.getElementById("post-body").value.trim();
  const name = document.getElementById("poster-name").value.trim();
  const bullyType = document.getElementById("bully-type").value;
  if (!school || !title || !body) {
    showToast("Please fill in school name, title, and story.", true);
    return;
  }
  posts.unshift({
    id: nextId++,
    type,
    school,
    title,
    body,
    name,
    anonymous: anonOn,
    bullyType,
    date: new Date().toISOString().slice(0, 10),
    supports: 0,
    supported: false,
  });
  clearForm();
  showPage("feed", document.querySelectorAll(".nav-btn")[0]);
  document.querySelectorAll(".nav-btn")[1].classList.remove("active");
  showToast("Your post has been shared. Thank you for speaking up.");
}

function clearForm() {
  ["post-school", "post-title", "post-body", "poster-name"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("post-type").value = "experience";
  document.getElementById("bully-type").value = "Physical";
  document.getElementById("ai-preview-area").innerHTML = "";
  if (anonOn) toggleAnon();
}

function toggleAnon() {
  anonOn = !anonOn;
  document.getElementById("anon-toggle").classList.toggle("on", anonOn);
  document.getElementById("anon-label").textContent = anonOn
    ? "Posting anonymously"
    : "Post anonymously";
  const n = document.getElementById("poster-name");
  n.disabled = anonOn;
  n.style.opacity = anonOn ? ".4" : "1";
}

function openEdit(id) {
  const p = posts.find((p) => p.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById("edit-title").value = p.title;
  document.getElementById("edit-body").value = p.body;
  document.getElementById("edit-school").value = p.school;
  document.getElementById("edit-ai-area").innerHTML = "";
  document.getElementById("edit-modal-wrap").classList.add("open");
}

function closeModal() {
  document.getElementById("edit-modal-wrap").classList.remove("open");
  editingId = null;
}

function saveEdit() {
  const p = posts.find((p) => p.id === editingId);
  if (!p) return;
  p.title = document.getElementById("edit-title").value.trim();
  p.body = document.getElementById("edit-body").value.trim();
  p.school = document.getElementById("edit-school").value.trim();
  closeModal();
  renderPosts();
  showToast("Post updated successfully.");
}

function deletePost(id) {
  posts = posts.filter((p) => p.id !== id);
  renderPosts();
  showToast("Post removed.");
}

function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.background = isError ? "#A32D2D" : "#0F6E56";
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

renderPosts();
