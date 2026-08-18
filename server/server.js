import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./db/conn.js";
import { generateSnapshot } from "./utils/snapshot.js";
import { startSnapshotCron } from "./cron/snapshot.cron.js";

const PORT = process.env.PORT || 5000;

await connectDB();

// Start the Express server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Generate/update snapshot when server starts
  await generateSnapshot();

  // Start the scheduled snapshot job
  startSnapshotCron();
});

// Gracefully shut down the server
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  // Stop accepting new requests
  server.close(async (err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
      process.exit(1);
    }

    console.log("HTTP server closed.");

    try {
      // Close the MongoDB connection
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");

      // Exit the application successfully
      process.exit(0);
    } catch (error) {
      console.error("Error closing MongoDB:", error);
      process.exit(1);
    }
  });

  // Force shutdown if the server doesn't close within 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after 10 seconds.");
    process.exit(1);
  }, 10000);
};

// Handle Ctrl+C during local development
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle shutdown signal from platforms like Render/Docker
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
