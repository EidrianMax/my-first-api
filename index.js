require('dotenv').config()
require('./mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const Note = require('./models/Note')
const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')

app.get('/api/notes', (req, res, next) => {
    Note.find()
        .then(notes => res.json(notes))
        .catch(next)
})

app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id

    Note.findById(id)
        .then(note => {
            if (note) res.json(note)
            else res.status(404).end()
        })
        .catch(next)
})

app.post('/api/notes', (req, res, next) => {
    const note = req.body

    if (!note.content) return res.status(400).end()

    const newNote = new Note({
        content: note.content,
        date: new Date(),
        important: note.important || false
    })

    newNote.save()
        .then(note => res.status(201).json(note))
        .catch(next)
})

app.put('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    const note = req.body

    if (!note.content && !note.important) {
        return res.status(400).json({
            error: 'No there note to modify'
        })
    }

    const newNote = {
        content: note.content || '',
        important: note.important || false
    }

    Note.findByIdAndUpdate(id, newNote, { new: true })
        .then(updateNote => res.status(200).json(updateNote))
        .catch(next)
})

app.delete('/api/notes/:id', (req, res, next) => {
    const id = req.params.id

    Note.findByIdAndDelete(id)
        .then(note => {
            if (note) return res.status(200).json(note)
            res.status(404).end()
        })
        .catch(next)
})

app.use(handleErrors)

app.use(notFound)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
