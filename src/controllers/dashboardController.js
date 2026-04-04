/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard data and analytics
 * Uses MongoDB aggregation pipelines for performance
 */

const dashboardService = require("../services/dashboardService");
const { sendSuccess, sendError } = require("../utils/responseHandler");

class DashboardController {
  /**
   * Get financial summary (total income, expenses, balance)
   */
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getFinancialSummary();
      sendSuccess(res, summary, "Financial summary retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category-wise breakdown
   */
  async getCategoryBreakdown(req, res, next) {
    try {
      const breakdown = await dashboardService.getCategoryBreakdown();
      sendSuccess(res, breakdown, "Category breakdown retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get monthly trends
   */
  async getMonthlyTrends(req, res, next) {
    try {
      const monthsBack = req.query.months || 12;
      const trends = await dashboardService.getMonthlyTrends(monthsBack);
      sendSuccess(res, trends, "Monthly trends retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(req, res, next) {
    try {
      const limit = req.query.limit || 5;
      const transactions = await dashboardService.getRecentTransactions(limit);
      sendSuccess(
        res,
        transactions,
        "Recent transactions retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData(req, res, next) {
    try {
      const data = await dashboardService.getDashboardData();
      sendSuccess(res, data, "Dashboard data retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expenses by category
   */
  async getExpensesByCategory(req, res, next) {
    try {
      const expenses = await dashboardService.getExpensesByCategory();
      sendSuccess(res, expenses, "Expenses by category retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get income by category
   */
  async getIncomeByCategory(req, res, next) {
    try {
      const income = await dashboardService.getIncomeByCategory();
      sendSuccess(res, income, "Income by category retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get daily summary for a date range
   */
  async getDailySummary(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return sendError(
          res,
          "startDate and endDate query parameters are required",
          400,
        );
      }

      const summary = await dashboardService.getDailySummary(
        startDate,
        endDate,
      );
      sendSuccess(res, summary, "Daily summary retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
