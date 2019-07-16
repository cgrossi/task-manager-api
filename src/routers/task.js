const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)

  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    const result = await task.save()
    res.status(201).send(result)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    // const task = await Task.findById(_id)
    const task = await Task.findOne({ _id, owner: req.user._id})

    if(!task) {
      return res.status(400).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

// GET tasks/?completed=true
// use limit and skip for pagination
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if(req.query.sortBy) {
    const sortArray = req.query.sortBy.split(':')
    sort[sortArray[0]] = sortArray[1] === 'desc' ? -1 : 1
  }

  if(req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id })
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})


router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every(update => {
    return allowedUpdates.includes(update)
  })

  if(!isValidUpdate) {
    return res.status(400).send('You must enter a valid update!')
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
    // const task = await Task.findById(req.params.id)
    if(!task) {
      return res.status(404).send()
    }
    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

    if(!task) {
      return res.status(404).send('Task not found')
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router