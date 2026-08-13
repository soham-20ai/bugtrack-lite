const bugList = document.getElementById("bugList");
const stats = document.getElementById("stats");
const modal = document.getElementById("modal");
const form = document.getElementById("bugForm");
const views = {
  dashboard: document.getElementById("dashboardView"),
  issues: document.getElementById("issuesView"),
  testing: document.getElementById("testingView")
};

let currentBugs = [];

async function fetchBugs() {
  const params = new URLSearchParams({
    search: document.getElementById("search")?.value || "",
    status: document.getElementById("statusFilter")?.value || "All",
    priority: document.getElementById("priorityFilter")?.value || "All"
  });
  const response = await fetch(`/api/bugs?${params}`);
  currentBugs = await response.json();
  renderIssues(currentBugs);
  renderDashboard(currentBugs);
}

function renderDashboard(bugs) {
  const total = bugs.length;
  const open = bugs.filter(b => b.status === "Open").length;
  const critical = bugs.filter(b => b.priority === "Critical").length;
  const resolved = bugs.filter(b => b.status === "Resolved").length;
  const resolution = total ? Math.round((resolved / total) * 100) : 0;

  stats.innerHTML = [
    statCard("Total Issues", total, "Tracked issues", "blue"),
    statCard("Open", open, "Need attention", "orange"),
    statCard("Critical", critical, "Highest priority", "red"),
    statCard("Resolution", `${resolution}%`, "Resolved issues", "green")
  ].join("");

  const bars = [
    ["Open", open, total],
    ["In Progress", bugs.filter(b => b.status === "In Progress").length, total],
    ["Resolved", resolved, total]
  ];
  document.getElementById("healthBars").innerHTML = bars.map(([name, value, max]) => `
    <div class="bar-row"><div><span>${name}</span><b>${value}</b></div>
    <div class="bar"><i style="width:${max ? Math.max((value/max)*100, value ? 8 : 0) : 0}%"></i></div></div>
  `).join("");

  document.getElementById("recentIssues").innerHTML = bugs.slice(0, 4).map(issueRow).join("") ||
    `<div class="empty">No issues to display.</div>`;
}

function statCard(label, value, detail, tone) {
  return `<div class="stat-card"><div class="stat-top"><span class="stat-icon ${tone}"></span><span class="stat-detail">${detail}</span></div><strong>${value}</strong><span>${label}</span></div>`;
}

function issueRow(bug) {
  return `<div class="issue-row">
    <div class="issue-id">#${String(bug.id).padStart(3, "0")}</div>
    <div class="issue-info"><strong>${escapeHtml(bug.title)}</strong><span>${escapeHtml(bug.assignee)} · ${new Date(bug.createdAt).toLocaleDateString()}</span></div>
    <span class="priority ${bug.priority.toLowerCase()}">${bug.priority}</span>
    <span class="status ${bug.status.toLowerCase().replace(" ", "-")}">${bug.status}</span>
  </div>`;
}

function renderIssues(bugs) {
  if (!bugList) return;
  bugList.innerHTML = bugs.map(bug => `
    <article class="bug-card">
      <div class="bug-main">
        <div class="issue-top"><span class="issue-id">#${String(bug.id).padStart(3, "0")}</span><span class="priority ${bug.priority.toLowerCase()}">${bug.priority}</span><span class="status ${bug.status.toLowerCase().replace(" ", "-")}">${bug.status}</span></div>
        <h3>${escapeHtml(bug.title)}</h3>
        <p>${escapeHtml(bug.description || "No description provided.")}</p>
        <div class="meta"><span>Assigned to <b>${escapeHtml(bug.assignee)}</b></span><span>•</span><span>${new Date(bug.createdAt).toLocaleDateString()}</span></div>
      </div>
      <div class="actions">
        <select aria-label="Change status" onchange="changeStatus(${bug.id}, this.value)">
          ${["Open","In Progress","Resolved"].map(s => `<option ${s === bug.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        <button class="danger" onclick="removeBug(${bug.id})">Delete</button>
      </div>
    </article>`).join("") || `<div class="empty">No issues match your filters.</div>`;
}

async function changeStatus(id, status) {
  await fetch(`/api/bugs/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({status}) });
  fetchBugs();
}

async function removeBug(id) {
  if (!confirm("Delete this issue?")) return;
  await fetch(`/api/bugs/${id}`, { method: "DELETE" });
  fetchBugs();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function openModal() {
  modal.classList.remove("hidden");
  document.getElementById("title").focus();
}
function closeModal() { modal.classList.add("hidden"); }

document.getElementById("newBugBtn").onclick = openModal;
document.getElementById("newBugBtn2").onclick = openModal;
document.getElementById("closeModal").onclick = closeModal;
modal.onclick = e => { if (e.target === modal) closeModal(); };

form.onsubmit = async e => {
  e.preventDefault();
  const error = document.getElementById("formError");
  error.textContent = "";
  const response = await fetch("/api/bugs", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      status: document.getElementById("status").value,
      assignee: document.getElementById("assignee").value
    })
  });
  if (!response.ok) {
    error.textContent = (await response.json()).error;
    return;
  }
  form.reset();
  closeModal();
  fetchBugs();
};

["search","statusFilter","priorityFilter"].forEach(id => {
  document.getElementById(id).addEventListener("input", fetchBugs);
  document.getElementById(id).addEventListener("change", fetchBugs);
});

function switchView(view) {
  Object.entries(views).forEach(([name, element]) => element.classList.toggle("hidden", name !== view));
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  document.getElementById("pageTitle").textContent = view === "dashboard" ? "QA Dashboard" : view === "issues" ? "Issue Management" : "Test Suites";
}
document.querySelectorAll(".nav-item").forEach(btn => btn.onclick = () => switchView(btn.dataset.view));
document.querySelectorAll("[data-view-link]").forEach(btn => btn.onclick = () => switchView(btn.dataset.viewLink));

document.getElementById("today").textContent = new Date().toLocaleDateString(undefined, {weekday:"short", month:"short", day:"numeric", year:"numeric"});
fetchBugs();