const request = require('supertest')
const { app, server } = require('../index')
const mongoose = require('mongoose')
const Note = require('../models/Note')

const api = request(app)

const initialNotes = [
    {
        content: 'Note one for testing',
        important: true,
        date: new Date()
    },
    {
        content: 'Note two for testing',
        important: true,
        date: new Date()
    }
]

beforeEach(async () => {
    await Note.deleteMany({})

    const newNote = new Note(initialNotes[0])
    await newNote.save()

    const newNote2 = new Note(initialNotes[1])
    await newNote2.save()
})

describe('GET api/notes', () => {
    describe('Happy Path', () => {
        test('should respond with a 200 status code', async () => {
            await api
                .get('/api/notes')
                .expect(200)
        })

        test('should respond with a application/json', async () => {
            await api
                .get('/api/notes')
                .expect('Content-Type', /application\/json/)
        })

        test('should be a some notes', async () => {
            const res = await api.get('/api/notes')

            expect(res.body).toBeInstanceOf(Array)
            expect(res.body).toHaveLength(initialNotes.length)
            expect(res.body).toBeDefined()

            res.body.forEach(note => {
                expect(note.content).toBeDefined()
                expect(typeof note.content).toBe('string')
                expect(note.date).toBeDefined()
                expect(typeof note.date).toBe('string')
                expect(note.important).toBeDefined()
                expect(typeof note.important).toBe('boolean')
            })
        })
    })
})

describe('POST api/notes', () => {
    describe('Happy Path', () => {
        const newNote = {
            content: 'Happy Path Note Post',
            date: new Date(),
            important: true
        }

        test('should respond with a 201 status code', async () => {
            await api
                .post('/api/notes')
                .send(newNote)
                .expect(201)
        })

        test('should respond with a application/json', async () => {
            await api
                .post('/api/notes')
                .send(newNote)
                .expect('Content-Type', /application\/json/)
        })

        test('should succed when create a new note', async () => {
            await api
                .post('/api/notes')
                .send(newNote)

            const res = await api.get('/api/notes')
            expect(res.body).toHaveLength(initialNotes.length + 1)

            const noteContents = res.body.map(note => note.content)
            expect(noteContents).toContain(newNote.content)
        })

        describe('Unhappy Path', () => {
            test('should fail when doesnt send a note', async () => {
                await api
                    .post('/api/notes')
                    .send({})
                    .expect(400)
            })
        })
    })
})

describe('PUT api/notes', () => {
    const modifyNote = {
        content: 'This is a modification',
        important: true
    }

    describe('Happy Path', () => {
        test('should succed when modify a note', async () => {
            const res = await api
                .get('/api/notes')

            await Promise.all(
                res.body.map(async note => {
                    await api
                        .put(`/api/notes/${note.id}`)
                        .send(modifyNote)
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
                })
            )
        })
    })

    describe('Unhappy Path', () => {
        test('should fail when no there note', async () => {
            const res = await api
                .get('/api/notes')

            await Promise.all(
                res.body.map(async note => {
                    await api
                        .put(`/api/notes/${note.id}`)
                        .send({})
                        .expect(400, {
                            error: 'No there note to modify'
                        })
                })
            )
        })
    })

    describe('DELETE /api/notes', () => {
        describe('Happy Path', () => {
            test('should succed when deleting a note', async () => {
                const res = await api
                    .get('/api/notes')

                await Promise.all(
                    res.body.map(async note => {
                        const res = await api
                            .delete(`/api/notes/${note.id}`)
                            .expect(200)

                        expect(res.body.content).toBe(note.content)
                        expect(res.body.data).toBe(note.data)
                        expect(res.body.important).toBe(note.important)
                        expect(res.body.id).toBe(note.id)
                    })
                )
            })
        })

        describe('Unhappy Path', () => {
            test('should fail when the id is malformed', async () => {
                const res = await api
                    .get('/api/notes')

                await Promise.all(
                    res.body.map(async note => {
                        await api
                            .delete(`/api/notes/${note.id}9`)
                            .expect(400, { error: 'id is malformed' })
                    })
                )
            })
        })
    })
})

afterAll(() => {
    mongoose.disconnect()
    server.close()
})
