/* Generador de datos ficticios para pruebas de rendimiento */
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

// Datos base para generar contenido realista
const taskTitles = [
  'Completar documentación del proyecto',
  'Revisar código del frontend', 
  'Configurar CI/CD pipeline',
  'Optimizar consultas de base de datos',
  'Actualizar dependencias npm',
  'Implementar tests unitarios',
  'Diseñar interfaz de usuario',
  'Corregir bugs reportados',
  'Refactorizar componentes legacy',
  'Configurar monitoreo de aplicación',
  'Implementar autenticación JWT',
  'Crear documentación de API',
  'Optimizar rendimiento del servidor',
  'Configurar backup automático',
  'Implementar notificaciones push',
  'Revisar seguridad de endpoints',
  'Actualizar diseño responsive',
  'Configurar entorno de staging',
  'Implementar cache de Redis',
  'Crear dashboard de métricas'
];

const descriptions = [
  'Escribir la documentación técnica completa del sistema',
  'Hacer code review de los componentes principales',
  'Implementar pipeline de integración continua con GitHub Actions',
  'Mejorar el rendimiento de las consultas más frecuentes',
  'Revisar y actualizar todas las dependencias del proyecto',
  'Crear suite de tests para todos los endpoints de la API',
  'Crear mockups y wireframes para la aplicación web',
  'Resolver los issues reportados por el equipo de QA',
  'Modernizar el código legacy siguiendo buenas prácticas',
  'Configurar alertas y métricas de rendimiento',
  'Implementar sistema de autenticación seguro',
  'Documentar todos los endpoints de la API REST',
  'Analizar y optimizar los cuellos de botella',
  'Configurar respaldos automáticos de la base de datos',
  'Implementar sistema de notificaciones en tiempo real',
  'Auditar la seguridad de todos los endpoints',
  'Mejorar la experiencia en dispositivos móviles',
  'Preparar entorno de pruebas para el equipo',
  'Implementar sistema de cache para mejorar velocidad',
  'Crear dashboard para visualizar métricas importantes'
];

const priorities = ['low', 'medium', 'high'];
const categories = ['desarrollo', 'testing', 'documentación', 'infraestructura', 'diseño'];

// Función para generar fecha aleatoria en los últimos 6 meses
function randomDate() {
  const start = new Date();
  start.setMonth(start.getMonth() - 6);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Función para generar un todo ficticio
function generateFakeTodo() {
  const titleIndex = Math.floor(Math.random() * taskTitles.length);
  const descIndex = Math.floor(Math.random() * descriptions.length);
  
  return {
    title: taskTitles[titleIndex] + ` #${Math.floor(Math.random() * 1000)}`,
    description: descriptions[descIndex],
    completed: Math.random() < 0.4, // 40% completadas
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    createdAt: randomDate(),
    updatedAt: randomDate()
  };
}

async function generateFakeData(count = 1000) {
  try {
    await connectDB();
    
    const Todo = mongoose.models.Todo;
    
    console.log(`🚀 Generando ${count} todos ficticios...`);
    
    // Limpiar datos existentes
    await Todo.deleteMany({});
    console.log('✅ Datos existentes eliminados');
    
    // Generar datos en lotes para mejor rendimiento
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
      const currentBatchSize = Math.min(batchSize, count - i);
      
      for (let j = 0; j < currentBatchSize; j++) {
        batch.push(generateFakeTodo());
      }
      
      await Todo.insertMany(batch);
      totalInserted += batch.length;
      
      // Mostrar progreso
      const progress = Math.round((totalInserted / count) * 100);
      console.log(`📊 Progreso: ${totalInserted}/${count} (${progress}%)`);
    }
    
    console.log(`✅ Generación completada: ${totalInserted} todos creados`);
    
    // Mostrar estadísticas
    const stats = await Todo.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]);
    
    if (stats.length > 0) {
      const stat = stats[0];
      console.log('\n📈 ESTADÍSTICAS GENERADAS:');
      console.log(`   Total: ${stat.total}`);
      console.log(`   Completadas: ${stat.completed} (${Math.round(stat.completed/stat.total*100)}%)`);
      console.log(`   Pendientes: ${stat.pending} (${Math.round(stat.pending/stat.total*100)}%)`);
      console.log(`   Alta prioridad: ${stat.highPriority}`);
      console.log(`   Media prioridad: ${stat.mediumPriority}`);
      console.log(`   Baja prioridad: ${stat.lowPriority}`);
    }
    
  } catch (error) {
    console.error('❌ Error generando datos:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

// Leer parámetro de línea de comandos para cantidad
const count = parseInt(process.argv[2]) || 1000;

console.log(`🎯 Iniciando generación de ${count} todos ficticios...`);
generateFakeData(count);
