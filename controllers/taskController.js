const Task = require('../models/Task');

// Helper function to format the due date as dd/mm/yyyy
const formatDueDate = (date) => {
    if (!date) return null;
    const day = (`0${date.getDate()}`).slice(-2);  // Get day, padded with leading zero if necessary
    const month = (`0${date.getMonth() + 1}`).slice(-2);  // Get month (getMonth() is zero-based)
    const year = date.getFullYear();  // Get full year
    return `${day}/${month}/${year}`;  // Return formatted date as dd/mm/yyyy
};

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, status, priority, dueDate, tags } = req.body;
    try {
        // Create a new Task with all fields
        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            tags,
            user: req.userId  // Assuming req.userId is populated from authentication middleware
        });

        // Save the task to the database
        await task.save();

        // Format the due date before sending the response
        const formattedTask = {
            ...task.toObject(),
            dueDate: formatDueDate(task.dueDate)  // Format due date
        };

        // Respond with the created task
        res.status(201).json(formattedTask);
    } catch (error) {
        // Handle errors and send a 500 status code
        res.status(500).json({ error: 'Server error' });
        console.log(error);
    }
};

// Get tasks for the authenticated user
exports.getTasks = async (req, res) => {
    try {
        // Find tasks associated with the authenticated user
        const tasks = await Task.find({ user: req.userId });

        // Format the due dates for all tasks before sending the response
        const formattedTasks = tasks.map(task => ({
            ...task.toObject(),
            dueDate: formatDueDate(task.dueDate)  // Format due date
        }));

        // Respond with the list of tasks
        res.json(formattedTasks);
    } catch (error) {
        // Handle errors and send a 500 status code
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        // Find and update the task associated with the authenticated user
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Format the due date before sending the response
        const formattedTask = {
            ...task.toObject(),
            dueDate: formatDueDate(task.dueDate)  // Format due date
        };

        // Respond with the updated task
        res.json(formattedTask);
    } catch (error) {
        // Handle errors and send a 500 status code
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        // Find and delete the task associated with the authenticated user
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Respond with a success message
        res.json({ message: 'Task deleted' });
    } catch (error) {
        // Handle errors and send a 500 status code
        res.status(500).json({ error: 'Server error' });
    }
};
