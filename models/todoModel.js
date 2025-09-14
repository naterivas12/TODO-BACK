const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

class TodoModel {
  constructor() {
    this.dataFile = path.join(__dirname, '../data/todos.json');
    this.ensureDataFile();
  }

  async ensureDataFile() {
    try {
      const dataDir = path.dirname(this.dataFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      try {
        await fs.access(this.dataFile);
      } catch {
        await fs.writeFile(this.dataFile, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error ensuring data file:', error);
    }
  }

  async getAllTodos() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading todos:', error);
      return [];
    }
  }

  async saveTodos(todos) {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(todos, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving todos:', error);
      return false;
    }
  }

  async createTodo(todoData) {
    const todos = await this.getAllTodos();
    const newTodo = {
      id: uuidv4(),
      title: todoData.title,
      description: todoData.description || '',
      completed: false,
      priority: todoData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    const saved = await this.saveTodos(todos);
    return saved ? newTodo : null;
  }

  async getTodoById(id) {
    const todos = await this.getAllTodos();
    return todos.find(todo => todo.id === id);
  }

  async updateTodo(id, updateData) {
    const todos = await this.getAllTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return null;
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    todos[todoIndex] = updatedTodo;
    const saved = await this.saveTodos(todos);
    return saved ? updatedTodo : null;
  }

  async deleteTodo(id) {
    const todos = await this.getAllTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return false;
    }

    todos.splice(todoIndex, 1);
    return await this.saveTodos(todos);
  }

  async getCompletedTodos() {
    const todos = await this.getAllTodos();
    return todos.filter(todo => todo.completed);
  }

  async getPendingTodos() {
    const todos = await this.getAllTodos();
    return todos.filter(todo => !todo.completed);
  }
}

module.exports = new TodoModel();
