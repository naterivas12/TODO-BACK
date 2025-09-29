/* Seed script to import data/todos.json into MongoDB */
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

// Reuse the Todo model defined in models/todoModel.js
const todoModel = require('../models/todoModel');

async function readSeedData() {
  const file = path.join(__dirname, '..', 'data', 'todos.json');
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw);
}

async function run() {
  try {
    await connectDB();

    // Using the underlying Mongoose model from todoModel
    const Todo = mongoose.models.Todo;

    // Clear existing documents
    await Todo.deleteMany({});

    const data = await readSeedData();

    // Map file-based structure to our Mongoose schema
    const docs = data.map((t) => ({
      title: t.title,
      description: t.description || '',
      completed: !!t.completed,
      priority: t.priority || 'medium',
      // if timestamps are present, use them via setOptions({ timestamps: false })? Simpler: let Mongoose set fresh timestamps.
    }));

    const inserted = await Todo.insertMany(docs);
    console.log(`✅ Seed completed. Inserted ${inserted.length} todos.`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
