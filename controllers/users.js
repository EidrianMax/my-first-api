const userRouters = require('express').Router()
const User = require('../models/User')

userRouters.post('/', async (req, res) => {
    const { body } = req
    const { username, name, password } = body

    const user = new User({
        username,
        name,
        passwordHash: password
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = userRouters
