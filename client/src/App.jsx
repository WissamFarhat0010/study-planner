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
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.substring(0, 10),
      status: task.status,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
    });

    setEditingId(task._id);
  };

  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
      priority: "Medium",
      estimatedHours: 1,
    });
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📚 Study Planner</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Task description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

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
          {editingId ? "Update Task ✏️" : "Add New Task ➕"}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancel Edit ❌
          </button>
        )}
      </form>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Estimated hours: {task.estimatedHours}</p>

              <button onClick={() => handleEdit(task)}>Edit Task ✏️</button>
              <button onClick={() => handleDelete(task._id)}>Delete Task 🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;