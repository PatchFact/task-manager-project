const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/authentication');
const router = new express.Router();

//TASK REALTED CRUD
router.post('/tasks', auth, async (req, res) => {    
    const task = new Task({
        ...req.body,
        author: req.user._id 
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET /tasks?completed=false
// GET /tasks?limit=10
// GET /tasks?skip=0
// GET /tasks?sort=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sort) {
        const parts = req.query.sort.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        const tasks = (req.user.tasks);

        if (!tasks) {
            return res.status(404).send();
        }

        res.send(tasks);
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    
    try {
        const task = await Task.findOne({ _id, author: req.user._id })
        
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    const _id = req.params.id;

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates.'})
    }

    try {
        const task = await Task.findOne({ _id, author: req.user._id });
        
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task)
    } catch (error) {
        res.status(400).send();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({ _id, author: req.user._id });
        
        if (!task) {
            return res.status(404).send();
        }
        
        res.send(task);
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router;