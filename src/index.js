const path = require("path")
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
  console.log('new websocket connect')

  socket.on('submitRoom',(room)=>{
    socket.join(room)
    console.log(io.sockets.adapter.rooms.get(room).size)
    
    if(io.sockets.adapter.rooms.get(room).size == 2){
      const [first,second] = io.sockets.adapter.rooms.get(room)
    
      io.to(first).emit("selectPlayerOne");

      io.to(second).emit("selectPlayerTwo");
    }
  })
  socket.on('oneNameSubmit',(room,name)=>{
    console.log(name+"onee")
    const [first,second] = io.sockets.adapter.rooms.get(room)
    io.to(second).emit("playerOneName",name);
  })

  socket.on('twoNameSubmit',(room,name)=>{
    console.log(name+"twoo")
    const [first,second] = io.sockets.adapter.rooms.get(room)
    io.to(first).emit("playerTwoName",name);
  })

  socket.on('playerOneTeamSubmit',(room,c1,c2,c3,c4)=>{
  
    const [first,second] = io.sockets.adapter.rooms.get(room)
    io.to(second).emit("playerOneTeam",c1,c2,c3,c4);
  })
  socket.on('playerTwoTeamSubmit',(room,c1,c2,c3,c4)=>{
  
    const [first,second] = io.sockets.adapter.rooms.get(room)
    io.to(first).emit("playerTwoTeam",c1,c2,c3,c4);
  })

  socket.on('startGame',(room)=>{
  
    const [first,second] = io.sockets.adapter.rooms.get(room)
    io.to(first).emit("start");
    //io.to(second).emit("start");
  })

  socket.on('gameSubmitone',(room,game)=>{
  
    const [first,second] = io.sockets.adapter.rooms.get(room)
    //io.to(first).emit("game",game);
    io.to(second).emit("game",game);
  })
  socket.on('gameSubmittwo',(room,game)=>{
  
    const [first,second] = io.sockets.adapter.rooms.get(room)
    io.to(first).emit("game",game);
    //io.to(second).emit("game",game);
  })

  socket.on('gameOverSubmit',(room,name)=>{
  
    const [first,second] = io.sockets.adapter.rooms.get(room)
    io.to(first).emit("gameOver",name);
    io.to(second).emit("gameOver",name);
  })

})


server.listen(port,()=>{
  console.log('server running on ' + port)
})

app.get('', async (req,res)=>{
  res.send('helo')
})