const { response } = require('express');
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

  let users = {};

  io.on('connection', (socket) => {
    // Listen for incoming messages
    function getSocketIdByUserId(userId) {
      return Object.keys(users).find(key => users[key] === userId);
    }

    // When a user logs in, store their Socket ID
    socket.on('login', (userId) => {
      console.log("a user loged in: ", userId)
      users[userId] = socket.id;
    });

    socket.on('sendMessage', (newMessage) => {
      const sender_id = newMessage.sender_id
      const receiver_id = newMessage.receiver_id
      const dm_body = newMessage.dm_body
      fetch(`http://localhost:5000/add-dm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id, receiver_id, dm_body })
      })
        .catch((err) => console.log("Error adding dm to DB from socket.io", err))

      const receiverSocketId = users[receiver_id];
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit('newMessage', newMessage);
      }
    });

    socket.on('deleteMessage', (toDeleteMessage) => {
      const sender_id = toDeleteMessage.sender_id
      const dm_id = toDeleteMessage.dm_id

      fetch(`http://localhost:5000/delete-dm`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id, dm_id })
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok')
          return response.json();
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error))
      socket.broadcast.emit('deletedMessageId', toDeleteMessage.dm_id);
    });

    socket.on('addFriend', (senderData, receiverData,) => {
      const sender_id = senderData.user_id
      const receiver_id = receiverData.user_id
      var toSendData = senderData
      toSendData['state'] = 'pending'

      fetch('http://localhost:5000/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senderId: sender_id, receiverId: receiver_id })
      })
        .then(response => response.json())
        .catch(error => console.error('Error adding friend:', error))

      const receiverSocketId = users[receiver_id];

      if (receiverSocketId) {
        console.log("about to emit data to reciever.. ", receiverSocketId)
        socket.to(receiverSocketId).emit('recieveNewFriendData', toSendData);
      }
    });

    socket.on('deleteFriend', (senderId, receiverId) => {
      fetch('http://localhost:5000/delete-friend', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({ userId: senderId, friendId: receiverId })
      })
        .then(response => response.json())
        .then(data => console.log('friend deleted successfully from socket io: ', data))
        .catch(error => console.error('Error deleting friend:', error))

      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        console.log("about to emit deleting data to reciever.. ", receiverSocketId)
        socket.to(receiverSocketId).emit('recieveDeletedFriendId', senderId);
      }
    });

    socket.on('acceptFriend', (senderId, receiverId) => {
      fetch('http://localhost:5000/accept-friend', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({ userId, receiverId })
      })
        .then(response => response.json())
        .then(data => console.log('friend accepted successfully from socket io: ', data))
        .catch(error => console.error('Error accepting friend:', error))

      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        console.log("about to emit accepting data to reciever.. ", receiverSocketId)
        socket.to(receiverSocketId).emit('recieveAcceptedFriendId', senderId);
      }
    })

    socket.on('disconnect', () => {
      // Remove the user from the mapping when they disconnect
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
}

module.exports = initializeSocket;
