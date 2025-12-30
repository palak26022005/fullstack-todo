const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory data store
let todos = [{ id: 1, text: "Welcome Palak!", done: false }];

// Routes
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text required" });
  }
  const todo = { id: Date.now(), text: text.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const { text, done } = req.body;
  if (text !== undefined) todos[idx].text = text;
  if (done !== undefined) todos[idx].done = !!done;
  res.json(todos[idx]);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === before) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
