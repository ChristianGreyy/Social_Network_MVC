const { createServer } = require("http");
const { Server } = require("socket.io");
const logger = require("./logger");
const config = require("./config");

let io;

module.exports = {
  init: (app) => {
    const httpServer = createServer(app);

    io = new Server(httpServer, {
      cors: {
        origin: "https://localhost:8080",
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("user connection");

      socket.once("close", () => {
        console.log("socket::close");
      });
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
    });

    httpServer.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  },
  getIo: () => {
    return io;
  },
};
