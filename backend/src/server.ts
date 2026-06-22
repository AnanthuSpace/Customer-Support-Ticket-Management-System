import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

    process.on(
      "unhandledRejection",
      (err: Error) => {
        console.error(err);

        server.close(() =>
          process.exit(1)
        );
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:"
    );
    console.error(error);
  }
};

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION");
  console.error(err);
});

startServer();