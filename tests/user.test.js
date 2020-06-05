const request = require('supertest');
const app = require('../source/app');
const User = require('../source/models/user');
const { userOne, userOneId, setupTestDatabase } = require('./fixtures/db');

beforeEach(setupTestDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Esteban',
            email: 'me@example.com',
            password: 'kame123'
        })
        .expect(201)
})

test('Should log in user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await User.findById(userOneId)
    
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not log in. Non-existent user.', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'batz@example.com',
            password: 'example123'
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete profile of authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Aang'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Aang')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Seoul'
        })
        .expect(400)
})