const mongoose = require('mongoose')
const request = require('supertest')
const { app, server } = require('../../index')
const User = require('../../models/User')

const api = request(app)

beforeEach(async () => {
    await User.deleteMany({})
})

describe('GET api/users', () => {
    describe('Should succed', () => {
        test('when get all users', async () => {
            await api
                .get('/api/users')
                .expect(200)
        })
    })
})

describe('POST api/users', () => {
    const newUser = {
        username: 'newuser',
        password: 'newpassword'
    }

    describe('Should succed', () => {
        test('when create a new user', async () => {
            const usersDbStart = await User.find()
            const usersAtStart = usersDbStart.map(user => user.toJSON())

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)

            const usersDbEnd = await User.find()
            const usersAtEnd = usersDbEnd.map(user => user.toJSON())

            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
            const usernames = usersAtEnd.map(user => user.username)

            expect(usernames).toContain(newUser.username)
        })
    })

    describe('Should fail', () => {
        test('when try to create an existent user', async () => {
            const _newUser = new User(newUser)

            await _newUser.save()

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
        })
    })
})

afterAll(() => {
    mongoose.disconnect()
    server.close()
})
