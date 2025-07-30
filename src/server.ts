import app from "./app";
import "dotenv/config";
import { Server } from "http";
import mongoose from "mongoose";

const port = process.env.PORT;
const url = process.env.MONGODB_CONNECTION_STRING;
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(url as string);
    console.log("connected to mongoDB...");

    server = app.listen(port, () => {
      console.log(`server running on port: ${port}`);
    });
  } catch (error) {
    console.log("error on starting server...");
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
