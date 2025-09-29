const mongoose = require('mongoose');

// Define Mongoose schema
const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 1000 },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  { timestamps: true }
);

// Transform output to match previous JSON structure
TodoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

// Keep the same public API used by routes
const todoModel = {
  async getAllTodos() {
    const docs = await Todo.find().sort({ createdAt: -1 }).lean();
    // manual transform for lean objects
    return docs.map((d) => ({
      ...d,
      id: d._id.toString(),
      _id: undefined
    }));
  },

  async createTodo(todoData) {
    const doc = await Todo.create({
      title: todoData.title,
      description: todoData.description || '',
      priority: todoData.priority || 'medium'
    });
    return doc.toJSON();
  },

  async getTodoById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await Todo.findById(id);
    return doc ? doc.toJSON() : null;
  },

  async updateTodo(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await Todo.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    );
    return doc ? doc.toJSON() : null;
  },

  async deleteTodo(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const res = await Todo.findByIdAndDelete(id);
    return !!res;
  },

  async getCompletedTodos() {
    const docs = await Todo.find({ completed: true }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: undefined }));
  },

  async getPendingTodos() {
    const docs = await Todo.find({ completed: false }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: undefined }));
  }
};

module.exports = todoModel;
