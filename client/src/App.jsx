import { useEffect, useState } from "react";
import axios from "axios";
import "./TodoApp.css";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const loadTodos = async () => {
    const res = await axios.get(`${API_BASE}/api/todos`);
    setTodos(res.data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await axios.post(`${API_BASE}/api/todos`, { text });
    setTodos([res.data, ...todos]);
    setText("");
  };

  const toggleDone = async (id, done) => {
    const res = await axios.patch(`${API_BASE}/api/todos/${id}`, { done: !done });
    setTodos(todos.map(t => (t.id === id ? res.data : t)));
  };

  const removeTodo = async (id) => {
    await axios.delete(`${API_BASE}/api/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="container">
      <h1>🌞 Palak's Todo App</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t.id, t.done)}
            />
            <span className={t.done ? "done" : ""}>{t.text}</span>
            <button className="delete-btn" onClick={() => removeTodo(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
