const taskController = require('../controllers/task.controller');
const Joi = require('@hapi/joi');

const routes = [
  {
    method: 'GET',
    url: '/tasks',
    schema: Joi.array().items(
      Joi.object({
        deleted: Joi.boolean(),
        id: Joi.string(),
        name: Joi.string(),
        is_completed: Joi.boolean(),
        created_at: Joi.date()
      })
    ),
    handler: taskController.getAllTasks
  },
  {
    method: 'POST',
    url: '/tasks',
    schema: {
      body: Joi.object({
        id: Joi.string(),
        name: Joi.string()
          .min(2)
          .required(),
        is_completed: Joi.bool()
      })
    },
    schemaCompiler: schema => data => schema.validate(data),
    handler: taskController.save
  },
  {
    method: 'DELETE',
    url: '/tasks/:id',
    schema: {
      description: 'DELETE a todo',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Task id'
          }
        }
      }
    },
    handler: taskController.deleteTaskById
  },
  {
    method: 'GET',
    url: '/tasks/:id',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            is_completed: { type: 'boolean' },
            deleted: { type: 'boolean' },
            created_at: { type: 'string' }
          }
        }
      }
    },
    schema: Joi.object({
      deleted: Joi.boolean(),
      id: Joi.string(),
      name: Joi.string(),
      is_completed: Joi.boolean(),
      created_at: Joi.date()
    }),
    handler: taskController.getTaskById
  },
  {
    /*
    method: "PUT",
    url: "/tasks/:id",
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            completed: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: taskController.completeTodoById,
    */
    method: 'PUT',
    url: '/tasks/:id',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            completed: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
      },
    },
    handler: taskController.completeTodoById
  }
];

module.exports = routes;
