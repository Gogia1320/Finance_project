/**
 * Dashboard Routes
 * Analytics and data aggregation endpoints
 */

const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

// All routes require authentication
router.use(auth);

/**
 * GET /api/dashboard
 * Get complete dashboard data
 * @requires authentication
 * Accessible to: Viewer, Analyst, Admin
 */
router.get(
  "/",
  authorize("dashboard", "summary"),
  dashboardController.getDashboardData,
);

/**
 * GET /api/dashboard/summary
 * Get financial summary (total income, expenses, balance)
 * @requires authentication
 * Accessible to: Viewer, Analyst, Admin
 */
router.get(
  "/summary",
  authorize("dashboard", "summary"),
  dashboardController.getSummary,
);

/**
 * GET /api/dashboard/category-breakdown
 * Get category-wise breakdown of all transactions
 * @requires authentication
 * Accessible to: Analyst, Admin
 */
router.get(
  "/category-breakdown",
  authorize("dashboard", "category"),
  dashboardController.getCategoryBreakdown,
);

/**
 * GET /api/dashboard/expenses-by-category
 * Get expenses breakdown by category
 * @requires authentication
 * Accessible to: Analyst, Admin
 */
router.get(
  "/expenses-by-category",
  authorize("dashboard", "category"),
  dashboardController.getExpensesByCategory,
);

/**
 * GET /api/dashboard/income-by-category
 * Get income breakdown by category
 * @requires authentication
 * Accessible to: Analyst, Admin
 */
router.get(
  "/income-by-category",
  authorize("dashboard", "category"),
  dashboardController.getIncomeByCategory,
);

/**
 * GET /api/dashboard/monthly-trends
 * Get monthly trends (last 12 months by default)
 * @requires authentication
 * @queryParams months (optional, default: 12)
 * Accessible to: Analyst, Admin
 */
router.get(
  "/monthly-trends",
  authorize("dashboard", "trends"),
  dashboardController.getMonthlyTrends,
);

/**
 * GET /api/dashboard/recent-transactions
 * Get recent transactions (last 5 by default)
 * @requires authentication
 * @queryParams limit (optional)
 * Accessible to: Viewer, Analyst, Admin
 */
router.get(
  "/recent-transactions",
  authorize("dashboard", "recent"),
  dashboardController.getRecentTransactions,
);

/**
 * GET /api/dashboard/daily-summary
 * Get daily summary for a date range
 * @requires authentication
 * @queryParams startDate, endDate (required)
 * Accessible to: Analyst, Admin
 */
router.get(
  "/daily-summary",
  authorize("dashboard", "daily"),
  dashboardController.getDailySummary,
);

module.exports = router;
