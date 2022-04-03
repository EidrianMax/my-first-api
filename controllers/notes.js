const notesRouters = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouters.get('/', (req, res, next) => {
    Note.find().populate('user', { notes: 0 })
        .then(notes => res.json(notes))
        .catch(next)
})

notesRouters.get('/:id', (req, res, next) => {
    const id = req.params.id

    Note.findById(id)
        .then(note => {
            if (note) res.json(note)
            else res.status(404).end()
        })
        .catch(next)
})

notesRouters.post('/', (req, res, next) => {
    const { content, important, user: userId } = req.body

    if (!content) return res.status(400).end()

    User.findById(userId)
        .then(user => {
            const newNote = new Note({
                content: content,
                date: new Date(),
                important: important || false,
                user: user._id
            })

            newNote.save()
                .then(note => {
                    user.notes = user.notes.concat(note._id)

                    user.save()
                        .then()
                        .catch(next)

                    res.status(201).json(note)
                })
                .catch(next)
        })
        .catch(next)
})

notesRouters.put('/:id', (req, res, next) => {
    const id = req.params.id
    const { content, important } = req.body

    if (!content && !important) {
        return res.status(400).json({
            error: 'No there note to modify'
        })
    }

    const newNote = {
        content: content || '',
        important: important || false
    }

    Note.findByIdAndUpdate(id, newNote, { new: true })
        .then(updateNote => res.status(200).json(updateNote))
        .catch(next)
})

notesRouters.delete('/:id', (req, res, next) => {
    const id = req.params.id

    Note.findByIdAndDelete(id)
        .then(note => {
            if (note) return res.status(200).json(note)
            res.status(404).end()
        })
        .catch(next)
})

module.exports = notesRouters
