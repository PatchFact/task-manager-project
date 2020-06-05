const request = require('supertest')
const app = require('../source/app')
const Task = require('../source/models/task')
const { userOne,
        userOneId,
        userTwo, 
        userTwoId,
        taskOne,
        taskTwo,
        taskThree,
        setupTestDatabase 
    } = require('./fixtures/db');

beforeEach(setupTestDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test running...'
        })
        .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should get tasks for a logged in user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toBe(2);
})

test('Should not allow second user to delete first user\'s tasks', async () => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

