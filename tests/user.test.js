const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId, userOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Signup success', async () => {
    const response = await request(app).post('/users').send({
        name: 'Guiga',
        email: 'guiga@ex.com',
        password: '123456789'
    }).expect(201);
    // Database changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // About the result
    expect(response.body).toMatchObject({
        user: {
            name: 'Guiga',
            email: 'guiga@ex.com'
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe('123456789');
});

test('Login success', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Login failure', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'fakePass'
    }).expect(400);
});

test('Profile user get success', async () => {
    await request(app).get('/users/me').set('Authorization', 'Bearer ' + userOne.tokens[0].token).send().expect(200);
});

test('Profile user get failure', async () => {
    await request(app).get('/users/me').send().expect(401);
});

test('Delete user success', async () => {
    await request(app).delete('/users/me').set('Authorization', 'Bearer ' + userOne.tokens[0].token).send().expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Delete user failure', async () => {
    await request(app).delete('/users/me').send().expect(401);
});

test('Upload avatar success', async () => {
    await request(app).post('/users/me/avatar')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Update user success', async () => {
    const req = await request(app).patch('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
    .send({
        name: 'Lip'
    })
    .expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toBe('Lip');
});

test('Update user failure', async () => {
    const req = await request(app).patch('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
    .send({
        location: 'Lip'
    })
    .expect(400);
});