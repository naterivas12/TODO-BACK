# Todo List Backend API

Un backend completo en Node.js para una aplicación de lista de tareas (Todo List) con API RESTful.

## 🚀 Características

- ✅ API RESTful completa para gestión de tareas
- 📝 CRUD operations (Create, Read, Update, Delete)
- 🔍 Filtrado por estado y prioridad
- ✨ Validación de datos con Joi
- 📊 Estadísticas de tareas
- 🗄️ Almacenamiento en archivo JSON
- 🌐 CORS habilitado
- 🛡️ Manejo de errores robusto

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm o yarn

## 🛠️ Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:

```bash
npm install
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📚 API Endpoints

### Health Check
- **GET** `/api/health` - Verificar estado del servidor

### Todos

#### Obtener todas las tareas
- **GET** `/api/todos`
- **Query Parameters:**
  - `status`: `completed` | `pending`
  - `priority`: `low` | `medium` | `high`

**Ejemplo:**
```bash
GET /api/todos?status=pending&priority=high
```

#### Obtener una tarea específica
- **GET** `/api/todos/:id`

#### Crear nueva tarea
- **POST** `/api/todos`
- **Body:**
```json
{
  "title": "Título de la tarea",
  "description": "Descripción opcional",
  "priority": "medium"
}
```

#### Actualizar tarea
- **PUT** `/api/todos/:id`
- **Body:**
```json
{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "completed": true,
  "priority": "high"
}
```

#### Alternar estado de completado
- **PATCH** `/api/todos/:id/toggle`

#### Eliminar tarea
- **DELETE** `/api/todos/:id`

#### Obtener estadísticas
- **GET** `/api/todos/stats/summary`

## 📊 Estructura de Datos

### Todo Object
```json
{
  "id": "uuid-string",
  "title": "Título de la tarea",
  "description": "Descripción de la tarea",
  "completed": false,
  "priority": "medium",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Mensaje opcional",
  "data": {},
  "count": 0
}
```

## 🗂️ Estructura del Proyecto

```
back-todo/
├── data/
│   └── todos.json          # Almacenamiento de datos
├── models/
│   └── todoModel.js        # Modelo de datos
├── routes/
│   └── todoRoutes.js       # Rutas de la API
├── validation/
│   └── todoValidation.js   # Validaciones con Joi
├── package.json
├── server.js               # Servidor principal
└── README.md
```

## 🔧 Configuración

### Variables de Entorno
- `PORT`: Puerto del servidor (default: 3000)

### Personalización
- Los datos se almacenan en `data/todos.json`
- Puedes modificar las validaciones en `validation/todoValidation.js`
- Para cambiar a base de datos, modifica `models/todoModel.js`

## 🧪 Ejemplos de Uso

### Crear una tarea
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Completar proyecto",
    "description": "Terminar el backend de la aplicación",
    "priority": "high"
  }'
```

### Obtener todas las tareas pendientes
```bash
curl http://localhost:3000/api/todos?status=pending
```

### Marcar tarea como completada
```bash
curl -X PATCH http://localhost:3000/api/todos/{id}/toggle
```

### Obtener estadísticas
```bash
curl http://localhost:3000/api/todos/stats/summary
```

## 🛡️ Validaciones

- **title**: Requerido, 1-200 caracteres
- **description**: Opcional, máximo 1000 caracteres
- **priority**: `low`, `medium`, `high` (default: `medium`)
- **completed**: Boolean (default: `false`)

## 📝 Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request (errores de validación)
- `404` - Not Found
- `500` - Internal Server Error

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Paginación
- [ ] Búsqueda de texto
- [ ] Fechas de vencimiento
- [ ] Categorías/etiquetas
- [ ] Tests unitarios

## 📄 Licencia

ISC License
