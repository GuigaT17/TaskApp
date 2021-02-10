const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Task = require('../src/models/task');
const {userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Create task success', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
    .send({
        description: 'A description'
    })
    .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
});

test('Get tasks', async() => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200);

    expect(response.body.length).toBe(2);
});

test('Delete task failure', async() => {
    const response = await request(app)
    .delete('/tasks/'+taskOne._id)
    .set('Authorization', 'Bearer ' + userTwo.tokens[0].token)
    .send()
    .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});