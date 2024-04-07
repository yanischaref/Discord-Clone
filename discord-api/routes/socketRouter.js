const socketIo = require('socket.io');

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming messages
    socket.on('sendMessage', (newMessage) => {
      const sender_id = newMessage.sender_id
      const receiver_id = newMessage.receiver_id
      const dm_body = newMessage.dm_body
      fetch(`http://localhost:5000/add-dm/${sender_id}/${receiver_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id, receiver_id, dm_body })
      })
        .catch((err) => console.log("Error adding dm to DB from socket.io", err))

      // Then broadcast the message to all connected clients
      socket.broadcast.emit('newMessage', newMessage);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = initializeSocket;
