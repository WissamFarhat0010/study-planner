import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    priority: "Medium",
    estimatedHours: 1,
  });

  const fetchTasks = () => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`http://localhost:5000/api/tasks/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    setFormData({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
      priority: "Medium",
      estimatedHours: 1,
    });

    fetchTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setFormData(task);
    setEditingId(task._id);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📚 Study Planner</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input name="title" value={formData.title} onChange={handleChange} required />
        <input name="description" value={formData.description} onChange={handleChange} required />
        <input name="dueDate" type="date" value={formData.dueDate?.substring(0,10)} onChange={handleChange} required />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          name="estimatedHours"
          type="number"
          min="1"
          max="24"
          value={formData.estimatedHours}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {tasks.map((task) => (
        <div key={task._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>

          <button onClick={() => handleEdit(task)}>Edit</button>
          <button onClick={() => handleDelete(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;