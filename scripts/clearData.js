/* Script para limpiar todos los datos de la base de datos */
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

async function clearAllData() {
  try {
    await connectDB();
    
    const Todo = mongoose.models.Todo;
    
    console.log('🗑️  Limpiando todos los datos...');
    
    const result = await Todo.deleteMany({});
    
    console.log(`✅ Eliminados ${result.deletedCount} documentos`);
    console.log('🧹 Base de datos limpia');
    
  } catch (error) {
    console.error('❌ Error limpiando datos:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

clearAllData();
