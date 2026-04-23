import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, estimatedHours } = req.body;

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      status,
      priority,
      estimatedHours,
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, estimatedHours } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        dueDate,
        status,
        priority,
        estimatedHours,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });

    res.status(200).json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task stats" });
  }
};