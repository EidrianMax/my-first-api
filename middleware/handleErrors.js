module.exports = (err, req, res, next) => {
    console.error(err)

    if (err.name === 'CastError') return res.status(400).json({ error: 'id is malformed' })
    res.status(500).end()
}
