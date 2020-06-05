const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../source/models/user')
const Task = require('../../source/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Test Pilot #1',
    email: 'test1@example.com',
    password: 'kame123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Test Pilot #2',
    email: 'test2@example.com',
    password: 'kame123',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is the test task #1',
    completed: false,
    author: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is the test task #2',
    completed: true,
    author: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is the test task #3',
    completed: false,
    author: userTwoId
}

const setupTestDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();

    await new User(userOne).save();
    await new User(userTwo).save();

    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupTestDatabase,
}