import React, { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import axios from "axios";
import Modal from "../components/Modal"; // Import the Modal component
import EditTaskModal from "../components/EditTaskModal"; // Import the EditTaskModal component
// import Navbar from "../components/Navbar"; // Import the Navbar

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Set false by default so form is not open initially
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [taskToDelete, setTaskToDelete] = useState(null); // Store task ID for deletion
  const [isEditing, setIsEditing] = useState(false); // State for edit modal visibility
  const [currentTask, setCurrentTask] = useState(null); // Store the current task being edited
  const token = localStorage.getItem("authToken");

  // Dummy tasks to show when user has no tasks
  const dummyTasks = [
    {
      _id: "dummy1",
      title: "Dummy card 1",
      description: "Start by adding your first task!",
      status: "Not Started",
      priority: "Low",
      dueDate: "N/A",
      tags: ["Getting Started"],
    },
    {
      _id: "dummy2",
      title: "Dummy card 2",
      description: "Click the 'Add Task' button to get started.",
      status: "Not Started",
      priority: "Medium",
      dueDate: "N/A",
      tags: ["Tutorial"],
    },
    {
      _id: "dummy3",
      title: "Dummy card 3",
      description: "Organize your tasks by priority, status, and more.",
      status: "Not Started",
      priority: "High",
      dueDate: "N/A",
      tags: ["Tips"],
    },
  ];

  // Fetch tasks on page load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAddTask = (newTask) => {
    // Update tasks state with the new task
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setIsModalOpen(true); // Open the modal for confirmation
  };

  const confirmDeleteTask = () => {
    axios
      .delete(`http://localhost:5000/api/tasks/${taskToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskToDelete)
        );
        setIsModalOpen(false); // Close the modal
        setTaskToDelete(null); // Clear the task ID
      })
      .catch(console.error);
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Close the modal
    setTaskToDelete(null); // Clear the task ID
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsEditing(true); // Open the edit modal
  };

  const handleSaveTask = (updatedTask) => {
    axios
      .put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? response.data : task
          )
        );
        setIsEditing(false); // Close the edit modal
        setCurrentTask(null); // Clear the current task
      })
      .catch(console.error);
  };

  const cancelEdit = () => {
    setIsEditing(false); // Close the edit modal
    setCurrentTask(null); // Clear the current task
  };

  return (
    <div className="container mx-auto p-4">
      {/* Pass the user info and logout handler to Navbar */}

      <h1 className=" flex justify-center text-4xl font-bold text-black-600 mb-6 drop-shadow-lg  ">
        Your Tasks
      </h1>

      {/* Flex container to display tasks in a row */}
      <div className="flex flex-wrap justify-start gap-4">
        {/* Display real tasks if available, otherwise show dummy tasks */}
        {tasks.length > 0
          ? tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          : dummyTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={null} // Dummy tasks don't have edit functionality
                onDelete={null} // Dummy tasks can't be deleted
              />
            ))}
      </div>

      {/* Conditionally render TaskForm or Add Task button */}
      {isAdding ? (
        <TaskForm
          onSubmit={handleAddTask} // Pass handleAddTask as the onSubmit prop
          onClose={() => setIsAdding(false)} // Pass onClose to handle form close
        />
      ) : (
        <div className="flex justify-center items-center">
          <button
            onClick={() => setIsAdding(true)} // Set isAdding to true when clicked
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 mt-4"
          >
            Add Task
          </button>
        </div>
      )}

      {/* Modal for task deletion */}
      <Modal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteTask}
        message="Are you sure you want to delete this task?"
      />

      {/* Modal for task editing */}
      <EditTaskModal
        isOpen={isEditing}
        onClose={cancelEdit}
        task={currentTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskPage;
