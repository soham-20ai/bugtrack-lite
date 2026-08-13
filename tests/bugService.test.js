jest.mock("../src/notificationService", () => ({
  notifyBugCreated: jest.fn()
}));
const {
  createBug,
  updateBug,
  deleteBug,
  listBugs,
  resetBugs
} = require("../src/bugService");

beforeEach(() => {
  resetBugs();
  jest.clearAllMocks();
});

describe("Bug service - unit tests", () => {
  test("creates a valid bug", () => {
    const bug = createBug({
      title: "Broken search",
      description: "Search returns no results",
      priority: "High",
      status: "Open",
      assignee: "Soham"
    });

    expect(bug.id).toBe(4);
    expect(bug.title).toBe("Broken search");
    expect(bug.priority).toBe("High");
  });
  test("notifies when a bug is created", () => {
  const { notifyBugCreated } = require("../src/notificationService");

  const bug = createBug({
    title: "Payment failure",
    description: "Payment button does not work",
    priority: "Critical",
    status: "Open",
    assignee: "Soham"
  });

  expect(notifyBugCreated).toHaveBeenCalledTimes(1);
  expect(notifyBugCreated).toHaveBeenCalledWith(bug);
});

  test("rejects a bug without a title", () => {
    expect(() => createBug({
      title: "",
      priority: "High",
      status: "Open",
      assignee: "Soham"
    })).toThrow("Title is required");
  });

  test("rejects an invalid priority", () => {
    expect(() => createBug({
      title: "Broken search",
      priority: "Urgent",
      status: "Open",
      assignee: "Soham"
    })).toThrow("Invalid priority");
  });

  test("updates bug status", () => {
    const bug = updateBug(1, { status: "Resolved" });
    expect(bug.status).toBe("Resolved");
  });

  test("filters bugs by priority", () => {
    const result = listBugs({ priority: "High" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain("Login");
  });

  test("deletes an existing bug", () => {
    expect(deleteBug(1)).toBe(true);
    expect(listBugs()).toHaveLength(2);
  });
  test("rejects an invalid status", () => {
  expect(() => createBug({
    title: "Broken search",
    priority: "High",
    status: "Pending",
    assignee: "Soham"
  })).toThrow("Invalid status");
});

test("returns null when updating a nonexistent bug", () => {
  expect(updateBug(999, { status: "Resolved" })).toBeNull();
});

test("returns false when deleting a nonexistent bug", () => {
  expect(deleteBug(999)).toBe(false);
});
test("rejects invalid priority when updating a bug", () => {
  expect(() =>
    updateBug(1, { priority: "Urgent" })
  ).toThrow("Invalid priority");
});

test("rejects invalid status when updating a bug", () => {
  expect(() =>
    updateBug(1, { status: "Closed" })
  ).toThrow("Invalid status");
});
test("updates all bug fields", () => {
  const bug = updateBug(1, {
    title: "Updated login issue",
    description: "Updated description",
    priority: "Critical",
    status: "In Progress",
    assignee: "Soham"
  });

  expect(bug.title).toBe("Updated login issue");
  expect(bug.description).toBe("Updated description");
  expect(bug.priority).toBe("Critical");
  expect(bug.status).toBe("In Progress");
  expect(bug.assignee).toBe("Soham");
});

test("searches bugs by title", () => {
  const result = listBugs({ search: "Login" });

  expect(result).toHaveLength(1);
  expect(result[0].title).toContain("Login");
});

test("searches bugs by description", () => {
  const result = listBugs({ search: "five seconds" });

  expect(result).toHaveLength(1);
  expect(result[0].title).toBe("Dashboard loads slowly");
});

test("searches bugs by assignee", () => {
  const result = listBugs({ search: "Kabir" });

  expect(result).toHaveLength(1);
  expect(result[0].assignee).toBe("Kabir");
});

test("filters bugs by status", () => {
  const result = listBugs({ status: "Resolved" });

  expect(result).toHaveLength(1);
  expect(result[0].title).toContain("Typo");
});

test("filters bugs by status and priority", () => {
  const result = listBugs({
    status: "Open",
    priority: "High"
  });

  expect(result).toHaveLength(1);
  expect(result[0].title).toContain("Login");
});
});