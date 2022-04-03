const userRouters = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

userRouters.get('/', async (req, res) => {
    const users = await User.find().populate('notes', {
        user: 0
    })

    res.json(users)
})

userRouters.post('/', async (req, res) => {
    const { username, name, password } = req.body

    const saltOrRounds = 10
    const passwordHash = await bcrypt.hash(password, saltOrRounds)

    try {
        const user = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await user.save()

        res.status(201).json(savedUser)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = userRouters
