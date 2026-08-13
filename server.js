const express = require("express");
const path = require("path");
const { createBug, updateBug, deleteBug, listBugs } = require("./src/bugService");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/bugs", (req, res) => {
  const { status, priority, search } = req.query;
  res.json(listBugs({ status, priority, search }));
});

app.post("/api/bugs", (req, res) => {
  try {
    const bug = createBug(req.body);
    res.status(201).json(bug);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch("/api/bugs/:id", (req, res) => {
  const bug = updateBug(Number(req.params.id), req.body);
  if (!bug) return res.status(404).json({ error: "Bug not found" });
  res.json(bug);
});

app.delete("/api/bugs/:id", (req, res) => {
  const deleted = deleteBug(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: "Bug not found" });
  res.status(204).send();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BugTrack Lite running at http://localhost:${PORT}`);
  });
}

module.exports = app;