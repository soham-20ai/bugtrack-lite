const request = require("supertest");
const app = require("../server");
const { resetBugs } = require("../src/bugService");

beforeEach(() => resetBugs());

describe("Bug API - integration tests", () => {
  test("GET /api/bugs returns bugs", async () => {
    const response = await request(app).get("/api/bugs");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(3);
  });
  test("POST /api/bugs rejects invalid priority", async () => {
  const response = await request(app)
    .post("/api/bugs")
    .send({
      title: "Invalid priority bug",
      description: "Testing invalid priority",
      priority: "Urgent",
      status: "Open",
      assignee: "QA Team"
    });

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("Invalid priority");
});

test("POST /api/bugs rejects invalid status", async () => {
  const response = await request(app)
    .post("/api/bugs")
    .send({
      title: "Invalid status bug",
      description: "Testing invalid status",
      priority: "High",
      status: "Pending",
      assignee: "QA Team"
    });

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("Invalid status");
});

test("PATCH /api/bugs/:id updates bug status", async () => {
  const response = await request(app)
    .patch("/api/bugs/1")
    .send({
      status: "Resolved"
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe("Resolved");
});

test("PATCH /api/bugs/:id returns 404 for nonexistent bug", async () => {
  const response = await request(app)
    .patch("/api/bugs/999")
    .send({
      status: "Resolved"
    });

  expect(response.statusCode).toBe(404);
});

  test("POST /api/bugs creates a bug through the API", async () => {
    const response = await request(app)
      .post("/api/bugs")
      .send({
        title: "API test failure",
        description: "The endpoint returns an unexpected response.",
        priority: "Critical",
        status: "Open",
        assignee: "QA Team"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("API test failure");
  });

  test("POST /api/bugs rejects invalid input", async () => {
    const response = await request(app)
      .post("/api/bugs")
      .send({ title: "", priority: "High", status: "Open", assignee: "QA Team" });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Title is required");
  });

  test("DELETE /api/bugs/:id removes a bug", async () => {
    const response = await request(app).delete("/api/bugs/1");

    expect(response.statusCode).toBe(204);

    const list = await request(app).get("/api/bugs");
    expect(list.body).toHaveLength(2);
  });
});