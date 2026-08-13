const { notifyBugCreated } = require("./notificationService");
let nextId = 4;

let bugs = [
  {
    id: 1,
    title: "Login button does not respond",
    description: "Clicking login with valid credentials produces no response.",
    priority: "High",
    status: "Open",
    assignee: "Aarav",
    createdAt: "2026-08-10T09:00:00.000Z"
  },
  {
    id: 2,
    title: "Dashboard loads slowly",
    description: "Dashboard takes more than five seconds to load.",
    priority: "Medium",
    status: "In Progress",
    assignee: "Riya",
    createdAt: "2026-08-11T11:30:00.000Z"
  },
  {
    id: 3,
    title: "Typo in profile page",
    description: "The profile page contains an incorrect heading.",
    priority: "Low",
    status: "Resolved",
    assignee: "Kabir",
    createdAt: "2026-08-12T14:15:00.000Z"
  }
];

const allowedPriorities = ["Low", "Medium", "High", "Critical"];
const allowedStatuses = ["Open", "In Progress", "Resolved"];

function validateBugInput(data) {
  if (!data.title || !data.title.trim()) throw new Error("Title is required");
  if (!allowedPriorities.includes(data.priority)) throw new Error("Invalid priority");
  if (!allowedStatuses.includes(data.status)) throw new Error("Invalid status");
  if (!data.assignee || !data.assignee.trim()) throw new Error("Assignee is required");
}

function createBug(data) {
  validateBugInput(data);

  const bug = {
    id: nextId++,
    title: data.title.trim(),
    description: (data.description || "").trim(),
    priority: data.priority,
    status: data.status,
    assignee: data.assignee.trim(),
    createdAt: new Date().toISOString()
  };

  bugs.unshift(bug);
  notifyBugCreated(bug);
  return bug;
}

function updateBug(id, changes) {
  const bug = bugs.find(item => item.id === id);
  if (!bug) return null;

  if (changes.priority && !allowedPriorities.includes(changes.priority)) {
    throw new Error("Invalid priority");
  }
  if (changes.status && !allowedStatuses.includes(changes.status)) {
    throw new Error("Invalid status");
  }

  Object.assign(bug, {
    ...(changes.title !== undefined && { title: changes.title.trim() }),
    ...(changes.description !== undefined && { description: changes.description.trim() }),
    ...(changes.priority !== undefined && { priority: changes.priority }),
    ...(changes.status !== undefined && { status: changes.status }),
    ...(changes.assignee !== undefined && { assignee: changes.assignee.trim() })
  });

  return bug;
}

function deleteBug(id) {
  const index = bugs.findIndex(item => item.id === id);
  if (index === -1) return false;
  bugs.splice(index, 1);
  return true;
}

function listBugs(filters = {}) {
  const search = (filters.search || "").toLowerCase();

  return bugs.filter(bug => {
    const statusMatch = !filters.status || filters.status === "All" || bug.status === filters.status;
    const priorityMatch = !filters.priority || filters.priority === "All" || bug.priority === filters.priority;
    const searchMatch =
      !search ||
      bug.title.toLowerCase().includes(search) ||
      bug.description.toLowerCase().includes(search) ||
      bug.assignee.toLowerCase().includes(search);

    return statusMatch && priorityMatch && searchMatch;
  });
}

function resetBugs() {
  bugs = [
    {
      id: 1,
      title: "Login button does not respond",
      description: "Clicking login with valid credentials produces no response.",
      priority: "High",
      status: "Open",
      assignee: "Aarav",
      createdAt: "2026-08-10T09:00:00.000Z"
    },
    {
      id: 2,
      title: "Dashboard loads slowly",
      description: "Dashboard takes more than five seconds to load.",
      priority: "Medium",
      status: "In Progress",
      assignee: "Riya",
      createdAt: "2026-08-11T11:30:00.000Z"
    },
    {
      id: 3,
      title: "Typo in profile page",
      description: "The profile page contains an incorrect heading.",
      priority: "Low",
      status: "Resolved",
      assignee: "Kabir",
      createdAt: "2026-08-12T14:15:00.000Z"
    }
  ];
  nextId = 4;
}

module.exports = {
  createBug,
  updateBug,
  deleteBug,
  listBugs,
  validateBugInput,
  resetBugs
};