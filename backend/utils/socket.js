const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
    },
  });

  let users = {}; 

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", ({ userId }) => {
      users[userId] = socket.id;
      console.log(`User joined: ${userId}`);
    });

    socket.on("sendRequest", ({ requesterId, donorId, requestData }) => {
      if (users[donorId]) {
        io.to(users[donorId]).emit("receiveRequest", { requesterId, requestData });
      }
    });

    socket.on("acceptRequest", ({ donorId, requesterId, response }) => {
      if (users[requesterId]) {
        io.to(users[requesterId]).emit("requestAccepted", { donorId, response });
      }
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      if (users[receiverId]) {
        io.to(users[receiverId]).emit("receiveMessage", { senderId, message });
      }
    });

    socket.on("disconnect", () => {
      Object.keys(users).forEach((userId) => {
        if (users[userId] === socket.id) {
          delete users[userId];
        }
      });
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
