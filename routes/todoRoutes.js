const express = require('express');
const router = express.Router();
const todoModel = require('../models/todoModel');
const { validateCreateTodo, validateUpdateTodo } = require('../validation/todoValidation');

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;
    let todos = await todoModel.getAllTodos();
    
    // Filter by completion status
    if (status === 'completed') {
      todos = todos.filter(todo => todo.completed);
    } else if (status === 'pending') {
      todos = todos.filter(todo => !todo.completed);
    }
    
    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      todos = todos.filter(todo => todo.priority === priority);
    }
    
    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todos',
      message: error.message
    });
  }
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.getTodoById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: `Todo with id ${id} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todo',
      message: error.message
    });
  }
});

// POST /api/todos - Create a new todo
router.post('/', validateCreateTodo, async (req, res) => {
  try {
    const newTodo = await todoModel.createTodo(req.validatedData);
    
    if (!newTodo) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create todo',
        message: 'Could not save todo to database'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create todo',
      message: error.message
    });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', validateUpdateTodo, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await todoModel.updateTodo(id, req.validatedData);
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: `Todo with id ${id} does not exist`
      });
    }
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update todo',
      message: error.message
    });
  }
});

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.getTodoById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: `Todo with id ${id} does not exist`
      });
    }
    
    const updatedTodo = await todoModel.updateTodo(id, { completed: !todo.completed });
    
    res.json({
      success: true,
      message: `Todo marked as ${updatedTodo.completed ? 'completed' : 'pending'}`,
      data: updatedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle todo',
      message: error.message
    });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.getTodoById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: `Todo with id ${id} does not exist`
      });
    }
    
    const deleted = await todoModel.deleteTodo(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete todo',
        message: 'Could not delete todo from database'
      });
    }
    
    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: { id, title: todo.title }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete todo',
      message: error.message
    });
  }
});

// GET /api/todos/stats/summary - Get todo statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const todos = await todoModel.getAllTodos();
    const completed = todos.filter(todo => todo.completed).length;
    const pending = todos.filter(todo => !todo.completed).length;
    const byPriority = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length
    };
    
    res.json({
      success: true,
      data: {
        total: todos.length,
        completed,
        pending,
        completionRate: todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0,
        byPriority
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

module.exports = router;
