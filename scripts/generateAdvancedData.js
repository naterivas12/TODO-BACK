/* Generador avanzado de datos ficticios con diferentes escenarios */
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

// Datos más extensos y realistas
const projectTypes = ['Web App', 'Mobile App', 'API', 'Dashboard', 'E-commerce', 'Blog', 'CRM', 'ERP'];
const technologies = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP'];
const departments = ['Frontend', 'Backend', 'DevOps', 'QA', 'Design', 'Product'];

const taskTemplates = [
  {
    title: 'Implementar {feature} en {project}',
    description: 'Desarrollar la funcionalidad de {feature} utilizando {tech} para el proyecto {project}',
    priority: 'medium'
  },
  {
    title: 'Corregir bug en {component}',
    description: 'Resolver el problema reportado en {component} que afecta la experiencia del usuario',
    priority: 'high'
  },
  {
    title: 'Optimizar rendimiento de {feature}',
    description: 'Mejorar la velocidad y eficiencia de {feature} para reducir tiempo de carga',
    priority: 'medium'
  },
  {
    title: 'Crear documentación para {feature}',
    description: 'Escribir documentación técnica completa para {feature} incluyendo ejemplos de uso',
    priority: 'low'
  },
  {
    title: 'Configurar {tech} en {project}',
    description: 'Instalar y configurar {tech} para su uso en el proyecto {project}',
    priority: 'medium'
  },
  {
    title: 'Revisar código de {department}',
    description: 'Hacer code review del trabajo realizado por el equipo de {department}',
    priority: 'high'
  },
  {
    title: 'Actualizar {tech} a última versión',
    description: 'Migrar {tech} a su versión más reciente y resolver incompatibilidades',
    priority: 'low'
  },
  {
    title: 'Diseñar interfaz para {feature}',
    description: 'Crear mockups y prototipos para la nueva funcionalidad de {feature}',
    priority: 'medium'
  }
];

const features = [
  'autenticación', 'dashboard', 'reportes', 'notificaciones', 'chat', 'pagos', 
  'búsqueda', 'filtros', 'exportación', 'importación', 'configuración', 'perfil',
  'calendario', 'tareas', 'comentarios', 'archivos', 'estadísticas', 'backup'
];

const components = [
  'header', 'sidebar', 'modal', 'formulario', 'tabla', 'gráfico', 
  'navegación', 'footer', 'carousel', 'dropdown', 'tooltip', 'accordion'
];

// Función para reemplazar placeholders
function fillTemplate(template, replacements) {
  let result = template;
  Object.keys(replacements).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, replacements[key]);
  });
  return result;
}

// Generar fecha con distribución realista
function generateRealisticDate() {
  const now = new Date();
  const scenarios = [
    // 30% tareas de esta semana
    { weight: 0.3, daysBack: () => Math.floor(Math.random() * 7) },
    // 40% tareas del mes pasado
    { weight: 0.4, daysBack: () => 7 + Math.floor(Math.random() * 23) },
    // 20% tareas de hace 2-3 meses
    { weight: 0.2, daysBack: () => 30 + Math.floor(Math.random() * 60) },
    // 10% tareas más antiguas
    { weight: 0.1, daysBack: () => 90 + Math.floor(Math.random() * 180) }
  ];
  
  const random = Math.random();
  let cumulative = 0;
  
  for (const scenario of scenarios) {
    cumulative += scenario.weight;
    if (random <= cumulative) {
      const daysBack = scenario.daysBack();
      const date = new Date(now);
      date.setDate(date.getDate() - daysBack);
      return date;
    }
  }
  
  return new Date();
}

// Generar estado completado basado en fecha y prioridad
function generateCompletedStatus(createdAt, priority) {
  const daysSinceCreated = (new Date() - createdAt) / (1000 * 60 * 60 * 24);
  
  let baseChance = 0.3; // 30% base de completado
  
  // Más probabilidad de estar completado si es más antiguo
  if (daysSinceCreated > 30) baseChance += 0.3;
  else if (daysSinceCreated > 7) baseChance += 0.2;
  
  // Prioridad alta tiene más chance de estar completada
  if (priority === 'high') baseChance += 0.2;
  else if (priority === 'low') baseChance -= 0.1;
  
  return Math.random() < Math.min(baseChance, 0.8);
}

function generateAdvancedTodo() {
  const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
  const createdAt = generateRealisticDate();
  
  const replacements = {
    feature: features[Math.floor(Math.random() * features.length)],
    project: projectTypes[Math.floor(Math.random() * projectTypes.length)],
    tech: technologies[Math.floor(Math.random() * technologies.length)],
    component: components[Math.floor(Math.random() * components.length)],
    department: departments[Math.floor(Math.random() * departments.length)]
  };
  
  const title = fillTemplate(template.title, replacements);
  const description = fillTemplate(template.description, replacements);
  const priority = template.priority;
  const completed = generateCompletedStatus(createdAt, priority);
  
  // Si está completado, generar fecha de actualización posterior
  let updatedAt = createdAt;
  if (completed) {
    const completionDelay = Math.floor(Math.random() * 14) + 1; // 1-14 días después
    updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + completionDelay);
  }
  
  return {
    title,
    description,
    completed,
    priority,
    createdAt,
    updatedAt
  };
}

async function generateAdvancedData(count = 5000) {
  try {
    await connectDB();
    
    const Todo = mongoose.models.Todo;
    
    console.log(`🚀 Generando ${count} todos avanzados con datos realistas...`);
    
    // Limpiar datos existentes
    await Todo.deleteMany({});
    console.log('✅ Datos existentes eliminados');
    
    // Generar datos en lotes
    const batchSize = 200;
    let totalInserted = 0;
    
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
      const currentBatchSize = Math.min(batchSize, count - i);
      
      for (let j = 0; j < currentBatchSize; j++) {
        batch.push(generateAdvancedTodo());
      }
      
      await Todo.insertMany(batch);
      totalInserted += batch.length;
      
      const progress = Math.round((totalInserted / count) * 100);
      process.stdout.write(`\r📊 Progreso: ${totalInserted}/${count} (${progress}%)`);
    }
    
    console.log(`\n✅ Generación completada: ${totalInserted} todos creados`);
    
    // Estadísticas detalladas
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
    
    // Estadísticas por fecha
    const dateStats = await Todo.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    
    if (stats.length > 0) {
      const stat = stats[0];
      console.log('\n📈 ESTADÍSTICAS GENERADAS:');
      console.log(`   Total: ${stat.total.toLocaleString()}`);
      console.log(`   Completadas: ${stat.completed.toLocaleString()} (${Math.round(stat.completed/stat.total*100)}%)`);
      console.log(`   Pendientes: ${stat.pending.toLocaleString()} (${Math.round(stat.pending/stat.total*100)}%)`);
      console.log(`   Alta prioridad: ${stat.highPriority.toLocaleString()}`);
      console.log(`   Media prioridad: ${stat.mediumPriority.toLocaleString()}`);
      console.log(`   Baja prioridad: ${stat.lowPriority.toLocaleString()}`);
      
      console.log('\n📅 DISTRIBUCIÓN POR FECHA:');
      dateStats.forEach(d => {
        console.log(`   ${d._id.year}-${d._id.month.toString().padStart(2, '0')}: ${d.count.toLocaleString()} todos`);
      });
    }
    
    console.log('\n🎯 DATOS LISTOS PARA PRUEBAS DE RENDIMIENTO');
    
  } catch (error) {
    console.error('\n❌ Error generando datos:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

// Leer parámetros
const count = parseInt(process.argv[2]) || 5000;

console.log(`🎯 Iniciando generación avanzada de ${count.toLocaleString()} todos...`);
generateAdvancedData(count);
