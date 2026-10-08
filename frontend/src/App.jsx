import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    dueDate: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");

  // Load tasks from MongoDB
  useEffect(() => {
    setLoading(true);
    setErrorMessage("");

    fetch("http://localhost:5000/api/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((data) => {
        const formattedTasks = data.map((task) => ({
          ...task,
          id: String(task._id),
        }));

        setTasks(formattedTasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);

        setErrorMessage(
          "Unable to load tasks. Please check the backend connection."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add new task or update existing task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim() === "") {
      alert("Please enter a task title.");
      return;
    }

    if (formData.category === "") {
      alert("Please select a category.");
      return;
    }

    if (formData.priority === "") {
      alert("Please select a priority.");
      return;
    }

    try {
      // Update existing task
      if (editingTaskId) {
        const response = await fetch(
          `http://localhost:5000/api/tasks/${editingTaskId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        const updatedTask = await response.json();

        const formattedTask = {
          ...updatedTask,
          id: String(updatedTask._id),
        };

        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === String(editingTaskId)
              ? formattedTask
              : task
          )
        );

        setEditingTaskId(null);
      }

      // Add new task
      else {
        const newTask = {
          ...formData,
          status: "Pending",
        };

        const response = await fetch(
          "http://localhost:5000/api/tasks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create task");
        }

        const savedTask = await response.json();

        const formattedTask = {
          ...savedTask,
          id: String(savedTask._id),
        };

        setTasks((previousTasks) => [
          ...previousTasks,
          formattedTask,
        ]);
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        dueDate: "",
      });

      setSelectedDate("");
      setShowForm(false);
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task.");
    }
  };

  // Mark task as completed
  const handleComplete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      const formattedTask = {
        ...updatedTask,
        id: String(updatedTask._id),
      };

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === String(id) ? formattedTask : task
        )
      );
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Failed to mark task as completed.");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.id !== String(id)
        )
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  // Edit task
  const handleEdit = (id) => {
    const taskToEdit = tasks.find(
      (task) => task.id === String(id)
    );

    if (!taskToEdit) {
      console.error("Task not found:", id);
      return;
    }

    setEditingTaskId(String(taskToEdit.id));

    setFormData({
      title: taskToEdit.title || "",
      description: taskToEdit.description || "",
      category: taskToEdit.category || "",
      priority: taskToEdit.priority || "",
      dueDate: taskToEdit.dueDate || "",
    });

    setSelectedDate(taskToEdit.dueDate || "");
    setShowForm(true);

    // Open the month of the existing due date
    if (taskToEdit.dueDate) {
      const date = new Date(taskToEdit.dueDate);

      setCalendarDate(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        )
      );
    }
  };

  // Cancel form
  const handleCancel = () => {
    setEditingTaskId(null);

    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "",
      dueDate: "",
    });

    setSelectedDate("");
    setShowForm(false);
  };

  // Open Add Task form
  const handleAddTask = () => {
    setEditingTaskId(null);

    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "",
      dueDate: "",
    });

    setSelectedDate("");
    setShowForm(true);
  };

  // Due date message
  const getDueDateMessage = (task) => {
    if (!task.dueDate || task.status === "Completed") {
      return "";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const difference = dueDate - today;

    const daysRemaining = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0) {
      return "Overdue";
    }

    if (daysRemaining === 0) {
      return "Due Today - Last day is today";
    }

    if (daysRemaining === 1) {
      return "1 day remaining";
    }

    return `${daysRemaining} days remaining`;
  };

  // Statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  // Filter tasks
  const filteredTasks = tasks
    .filter((task) =>
      task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((task) =>
      priorityFilter === "All"
        ? true
        : task.priority === priorityFilter
    )
    .filter((task) =>
      statusFilter === "All"
        ? true
        : task.status === statusFilter
    );

  // Calendar
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const monthName = calendarDate.toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  // Change year
  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);

    if (
      !Number.isNaN(newYear) &&
      newYear >= 1 &&
      newYear <= 9999
    ) {
      setCalendarDate(
        new Date(newYear, month, 1)
      );
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Student Task Manager</h1>
        <p>Manage your study tasks easily</p>
      </header>

      <main className="container">
        {/* Welcome */}
        <section className="welcome">
          <h2>Welcome, Student 👋</h2>

          <p>
            Stay organized and keep track of your
            university work.
          </p>
        </section>

        {/* Statistics */}
        <section className="stats">
          <div className="card">
            <h3>Total Tasks</h3>
            <p className="number">
              {totalTasks}
            </p>
          </div>

          <div className="card">
            <h3>Completed Tasks</h3>
            <p className="number">
              {completedTasks}
            </p>
          </div>

          <div className="card">
            <h3>Pending Tasks</h3>
            <p className="number">
              {pendingTasks}
            </p>
          </div>
        </section>

        {/* Add Task Button */}
        <button
          type="button"
          className="add-button"
          onClick={handleAddTask}
        >
          + Add New Task
        </button>

        {/* Add / Edit Task Form */}
        {showForm && (
          <section className="task-form">
            <h2>
              {editingTaskId
                ? "Edit Task"
                : "Add New Task"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Task Title */}
              <label>Task Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
              />

              {/* Description */}
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />

              {/* Category */}
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select Category
                </option>

                <option value="Assignment">
                  Assignment
                </option>

                <option value="Exam">
                  Exam
                </option>

                <option value="Practical">
                  Practical
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {/* Priority */}
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">
                  Select Priority
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>

              {/* Due Date */}
              <label>Due Date</label>

              <div className="calendar">
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav"
                    onClick={() =>
                      setCalendarDate(
                        new Date(
                          year,
                          month - 1,
                          1
                        )
                      )
                    }
                  >
                    ◀
                  </button>

                  <div className="calendar-title">
                    <h3>{monthName}</h3>

                    <input
                      type="number"
                      className="year-input"
                      min="1"
                      max="9999"
                      value={year}
                      onChange={handleYearChange}
                      aria-label="Calendar year"
                    />
                  </div>

                  <button
                    type="button"
                    className="calendar-nav"
                    onClick={() =>
                      setCalendarDate(
                        new Date(
                          year,
                          month + 1,
                          1
                        )
                      )
                    }
                  >
                    ▶
                  </button>
                </div>

                <div className="calendar-days">
                  {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map((day) => (
                    <div
                      key={day}
                      className="day-name"
                    >
                      {day}
                    </div>
                  ))}

                  {Array.from({
                    length: firstDay,
                  }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="empty-day"
                    ></div>
                  ))}

                  {Array.from({
                    length: daysInMonth,
                  }).map((_, index) => {
                    const day = index + 1;

                    const dateString = `${year}-${String(
                      month + 1
                    ).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(
                      2,
                      "0"
                    )}`;

                    const today = new Date();

                    today.setHours(
                      0,
                      0,
                      0,
                      0
                    );

                    const currentDate = new Date(
                      year,
                      month,
                      day
                    );

                    currentDate.setHours(
                      0,
                      0,
                      0,
                      0
                    );

                    const isPast =
                      currentDate < today;

                    const isToday =
                      currentDate.getTime() ===
                      today.getTime();

                    return (
                      <button
                        type="button"
                        key={day}
                        disabled={isPast}
                        className={
                          selectedDate ===
                          dateString
                            ? "selected-day"
                            : isToday
                            ? "today-day"
                            : "day"
                        }
                        onClick={() => {
                          setSelectedDate(
                            dateString
                          );

                          setFormData({
                            ...formData,
                            dueDate: dateString,
                          });
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <p className="selected-date">
                  Selected Date: {selectedDate}
                </p>
              )}

              {/* Form Buttons */}
              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingTaskId
                    ? "Update Task"
                    : "Add Task"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Task List */}
        <section className="tasks">
          <h2>My Tasks</h2>

          {/* Search */}
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {/* Priority Filter */}
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="All">
              All Priorities
            </option>

            <option value="Low">Low</option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">High</option>
          </select>

          {/* Status Filter */}
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

          {/* Loading */}
          {loading ? (
            <div className="message-box">
              <p>Loading tasks...</p>
            </div>
          ) : errorMessage ? (
            /* Error */
            <div className="message-box error-message">
              <p>{errorMessage}</p>
            </div>
          ) : tasks.length === 0 ? (
            /* No tasks */
            <div className="empty">
              <p>No tasks available.</p>

              <p>
                Add your first task to get
                started!
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            /* No matching result */
            <div className="empty">
              <p>No matching tasks found.</p>

              <p>
                Try changing your search or
                filters.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div
                  className="task-item"
                  key={task.id}
                >
                  {/* Title */}
                  <h3>{task.title}</h3>

                  {/* Description */}
                  <p>
                    {task.description}
                  </p>

                  {/* Category */}
                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {task.category}
                  </p>

                  {/* Priority */}
                  <p>
                    <strong>
                      Priority:
                    </strong>{" "}
                    <span
                      className={`priority-badge ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </p>

                  {/* Due Date */}
                  <p>
                    <strong>
                      Due Date:
                    </strong>{" "}
                    {task.dueDate
                      ? task.dueDate
                      : "No date"}

                    {getDueDateMessage(
                      task
                    ) && (
                      <span
                        className={
                          getDueDateMessage(
                            task
                          ) === "Overdue" ||
                          getDueDateMessage(
                            task
                          ).includes(
                            "Due Today"
                          )
                            ? "overdue-badge"
                            : "remaining-badge"
                        }
                      >
                        {getDueDateMessage(
                          task
                        )}
                      </span>
                    )}
                  </p>

                  {/* Status */}
                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {task.status}
                  </p>

                  {/* Complete Button */}
                  {task.status ===
                    "Pending" && (
                    <button
                      type="button"
                      className="complete-button"
                      onClick={() =>
                        handleComplete(
                          task.id
                        )
                      }
                    >
                      ✓ Mark as Completed
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      handleEdit(task.id)
                    }
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(task.id)
                    }
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App; 