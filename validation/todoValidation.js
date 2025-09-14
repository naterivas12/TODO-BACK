const Joi = require('joi');

const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 1 character long',
    'string.max': 'Title must be less than 200 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(1000).allow('').optional().messages({
    'string.max': 'Description must be less than 1000 characters'
  }),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium').messages({
    'any.only': 'Priority must be one of: low, medium, high'
  })
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 1 character long',
    'string.max': 'Title must be less than 200 characters'
  }),
  description: Joi.string().max(1000).allow('').optional().messages({
    'string.max': 'Description must be less than 1000 characters'
  }),
  completed: Joi.boolean().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high'
  })
});

const validateCreateTodo = (req, res, next) => {
  const { error, value } = createTodoSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};

const validateUpdateTodo = (req, res, next) => {
  const { error, value } = updateTodoSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};

module.exports = {
  validateCreateTodo,
  validateUpdateTodo
};
