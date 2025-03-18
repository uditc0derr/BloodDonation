const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Your React frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
    },
  });

  let users = {}; // Store connected users

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store user ID when they join
    socket.on("join", ({ userId }) => {
      users[userId] = socket.id;
      console.log(`User joined: ${userId}`);
    });

    // Handle blood request
    socket.on("sendRequest", ({ requesterId, donorId, requestData }) => {
      if (users[donorId]) {
        io.to(users[donorId]).emit("receiveRequest", { requesterId, requestData });
      }
    });

    // Accept request
    socket.on("acceptRequest", ({ donorId, requesterId, response }) => {
      if (users[requesterId]) {
        io.to(users[requesterId]).emit("requestAccepted", { donorId, response });
      }
    });

    // Handle real-time chat
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      if (users[receiverId]) {
        io.to(users[receiverId]).emit("receiveMessage", { senderId, message });
      }
    });

    // Handle disconnection
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
