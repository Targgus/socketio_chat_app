const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord Bot'

// run when a client connects
io.on('connection', (socket) => {

    // Welcome current user - sends to client 
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'))

    // broadcast when a user connects
    // sends to all clients except client connecting
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'))


    // runs when client disconnects
    socket.on('disconnect', () => {
        // sends to all clients in general
        io.emit('message', formatMessage(botName, 'A user has left the chat'))
    })

    // listen for message from main.js 
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg))
    })
})

const PORT = 3001 || process.env.PORT



server.listen(PORT, () => console.log(`Server running on port ${PORT}`))