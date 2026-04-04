/**
 * Server Entry Point
 * Initializes the server and connects to MongoDB
 */

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Connect to MongoDB
connectDB().then(() => {
  // Start server
  const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║       Finance Data Processing & Access Control System     ║
║                                                            ║
║  ✓ Server running on http://localhost:${PORT}          ║
║  ✓ Environment: ${NODE_ENV}                                  ║
║  ✓ Database: Connected                                    ║
║                                                            ║
║  📚 API Documentation:                                     ║
║     /api/users      - User Management                     ║
║     /api/records    - Financial Records                   ║
║     /api/dashboard  - Analytics & Dashboard               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
  });

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
});
