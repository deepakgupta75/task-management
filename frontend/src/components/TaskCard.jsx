import React from "react";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case "pending":
        return "bg-yellow-400"; // Color for Pending
      case "in progress":
        return "bg-blue-400"; // Color for In Progress
      case "completed":
        return "bg-green-400"; // Color for Completed
      default:
        return "bg-gray-400"; // Default color
    }
  };
  return (
    <div className="border p-4 rounded-lg shadow-lg mb-4 bg-black bg-opacity-10 backdrop-blur-md border-gray-200">
      <h3 className="font-bold text-xl mb-2">{task.title}</h3>
      <p className="mb-2">{task.description}</p>

      <p className="mb-2">
        <strong>Status:</strong>
        <span
          className={`inline-block px-2 py-1 rounded ${getStatusColor()} text-black ml-2`}
        >
          {task.status}
        </span>
      </p>
      <p className="mb-2">
        <strong>Priority:</strong> {task.priority}
      </p>
      <p className="mb-2">
        <strong>Due Date:</strong> {task.dueDate}
      </p>

      {/* Tags Section */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-4">
          <strong>Tags: </strong>
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2 inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons: Edit and Delete */}
      <div className="flex justify-center  space-x-4 mt-4">
        <button onClick={() => onEdit(task)} className="px-4 py-2">
          <img src="/edit.png" alt="Edit Task" className="w-6 h-6" />
        </button>
        <button onClick={() => onDelete(task._id)} className="px-4 py-2">
          <img src="/delete.png" alt="Delete Task" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
