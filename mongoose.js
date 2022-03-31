const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'development'
    ? MONGO_DB_URI
    : MONGO_DB_URI_TEST

mongoose.connect(connectionString)
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err))

process.on('uncaughtException', () => {
    mongoose.connection.close()
})
