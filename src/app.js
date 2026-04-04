/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const userRoutes = require("./routes/userRoutes");
const financialRoutes = require("./routes/financialRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Request logging
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
  );
}

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROUTES
// ============================================

/**
 * Authentication & User Management
 * Base: /api/users
 */
app.use("/api/users", userRoutes);

/**
 * Financial Records
 * Base: /api/records
 */
app.use("/api/records", financialRoutes);

/**
 * Dashboard & Analytics
 * Base: /api/dashboard
 */
app.use("/api/dashboard", dashboardRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

module.exports = app;
