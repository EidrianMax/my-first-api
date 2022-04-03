require('dotenv').config()
require('./mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')

const notesRouters = require('./controllers/notes')
const usersRouters = require('./controllers/users')

app.use('/api/notes', notesRouters)

app.use('/api/users', usersRouters)

app.use(handleErrors)

app.use(notFound)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
