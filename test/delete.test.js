"use strict";

const dbHandler = require('./db-handler');
const createTasks = require('./seed');
const model = require("../model/task.model");
const repository = require("../repository/task.repository");

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.startFastify();
    await dbHandler.connectDatabase();
});

/**
 * Seed the database.
 */
beforeEach(async () => {
    await createTasks();
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
    await dbHandler.closeDatabase();
    dbHandler.closeFastify();
});

describe('server test', () => {
  afterAll(() => {
    fastify.close();
  });

  test('existing id delete', async (done) => {
    let newTask = await new model({
      name : "New unit test",
    }).save();

    const response = await dbHandler.fs.inject({
      method: 'DELETE',
      url: '/tasks/' + newTask._id      
    });
    const doesTaskExist = await model.exists({ _id: newTask._id  });
    expect(doesTaskExist).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.payload).toBe("{\"deleted_id\":\""+ newTask._id +"\"}");
    const deletedTask = await model.findById({ _id: newTask._id  });
    expect(deletedTask.deleted).toBe(true);
    done();
  });

  test('unexisting id delete', async (done) => {
    let newTask = await new model({
      name : "New unit test",
    });
    const response = await dbHandler.fs.inject({
      method: 'DELETE',
      url: '/tasks/'+ newTask._id,
    });
    const doesTaskExist = await model.exists({ _id: newTask._id });
    expect(doesTaskExist).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(response.payload).toBe("{\"error\":\"invalid id\"}");
    done();
  });

  test('empty id delete', async (done) => {
    const response = await dbHandler.fs.inject({
      method: 'DELETE',
      url: '/tasks/',
    });

    expect(response.statusCode).toBe(400);
    expect(response.payload).toBe("{\"error\":\"invalid id\"}");
    done();
  });

  test('special characters id delete', async (done) => {
    const response = await dbHandler.fs.inject({
      method: 'DELETE',
      url: '/tasks/dasdn!dk.,.?@',
    });

    expect(response.statusCode).toBe(400);
    expect(response.payload).toBe("{\"error\":\"invalid id\"}");
    done();
  });

});