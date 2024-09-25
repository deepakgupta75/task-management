import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ onSubmit, existingTask, onClose }) => {
  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(
    existingTask?.description || ""
  );
  const [status, setStatus] = useState(existingTask?.status || "pending");
  const [priority, setPriority] = useState(existingTask?.priority || "medium");
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || "");
  const [tags, setTags] = useState(existingTask?.tags || []);
  const [tagInput, setTagInput] = useState(""); // To handle the input for individual tag

  // Add tag to the tags array when user presses Enter
  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      if (!tags.includes(tagInput)) {
        setTags([...tags, tagInput]);
      }
      setTagInput(""); // Clear the input after adding tag
    }
  };

  // Remove tag from the list
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!title || !description) {
      alert("Title and Description are required.");
      return;
    }

    // Retrieve and validate token from local storage
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return; // Stop submission if no token is found
    }

    const newTask = { title, description, status, priority, dueDate, tags };

    try {
      // Make POST request to the API with token in headers
      const response = await axios.post(
        "https://task-management-ev3y.onrender.com/api/tasks",
        newTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach token
          },
        }
      );

      // Notify the parent component (TaskPage) of the new task
      onSubmit(response.data);
      onClose(); // Close the form after adding the task
    } catch (error) {
      console.error("Error while saving the task:", error);
      if (error.response && error.response.status === 401) {
        alert("Authorization failed. Please log in again.");
      } else {
        alert("An error occurred while saving the task.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="block w-full mb-4 p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="block w-full mb-4 p-2 border rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      >
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        value={dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""} // Formats the date to YYYY-MM-DD
        onChange={(e) => setDueDate(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      />

      {/* Tags input */}
      <div className="mb-4">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagKeyPress} // Handle enter press to add tag
          placeholder="Enter a tag and press Enter"
          className="block w-full mb-2 p-2 border rounded"
        />
        <div className="flex flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-sm text-red-400"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-evenly">
        <button
          type="submit" // Change to type="submit" for form submission
          className="bg-blue-600 text-white w-1/3 py-2 rounded"
        >
          Save Task
        </button>
        <button
          type="button" // Set type to "button" to avoid form submission
          onClick={onClose} // Trigger onClose when "Cancel" is clicked
          className="bg-red-500 text-white w-1/3 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
