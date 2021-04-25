const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require("socket.io")(http)

const templating = require('consolidate')
const handlebars = require('handlebars')
templating.requires.handlebars = handlebars

app.engine('hbs', templating.handlebars)
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
http.listen(3000, () => {
    console.log('Server listening on 3000 port.');
})

//listen on every connection
io.on('connection', (socket) => {
    let users = []
    socket.onAny((event, ...args) => {
        console.log(event, args);
      });
	//default username
	socket.username = "Anonymous"
    socket.join('socket.username')
    // users.push(socket.username)
    // console.log(users)

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
        users.push(socket.username)
        socket.emit('users', users.length)
        console.log(users)
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})