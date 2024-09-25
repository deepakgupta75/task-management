const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();
const taskController = require('../controllers/taskController');



// router.post('/',authenticate, taskController.createTask);
// router.post('/', taskController.getTasks);
// router.post('/:id', taskController.updateTask);
// router.post('/id', taskController.deleteTask);


router.post('/', authenticate, createTask);    // POST /api/tasks
router.get('/', authenticate, getTasks);       // GET /api/tasks
router.put('/:id', authenticate, updateTask);  // PUT /api/tasks/:id
router.delete('/:id', authenticate, deleteTask); // DELETE /api/tasks/:id

module.exports = router;
