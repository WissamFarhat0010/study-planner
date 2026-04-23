import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

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

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

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
          placeholder="Description"
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

        <button type="submit">Add Task</button>
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

              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;