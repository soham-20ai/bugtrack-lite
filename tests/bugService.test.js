const {
  createBug,
  updateBug,
  deleteBug,
  listBugs,
  resetBugs
} = require("../src/bugService");

beforeEach(() => resetBugs());

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
});