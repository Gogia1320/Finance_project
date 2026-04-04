/**
 * Dashboard Service
 * Business logic for dashboard aggregations and summaries
 * Uses MongoDB aggregation pipelines for optimal performance
 */

const FinancialRecord = require("../models/FinancialRecord");

class DashboardService {
  /**
   * Get financial summary (total income, expenses, balance)
   */
  async getFinancialSummary() {
    const result = await FinancialRecord.aggregate([
      {
        $facet: {
          income: [
            { $match: { type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          expenses: [
            { $match: { type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
        },
      },
    ]);

    const summary = result[0];
    const totalIncome = summary.income[0]?.total || 0;
    const totalExpenses = summary.expenses[0]?.total || 0;

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }

  /**
   * Get category-wise breakdown
   */
  async getCategoryBreakdown() {
    const categories = await FinancialRecord.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          type: { $first: "$type" },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    return categories;
  }

  /**
   * Get monthly trends
   */
  async getMonthlyTrends(monthsBack = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const trends = await FinancialRecord.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: 1,
                },
              },
            },
          },
          income: 1,
          expenses: 1,
          netBalance: { $subtract: ["$income", "$expenses"] },
        },
      },
    ]);

    return trends;
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit = 5) {
    const records = await FinancialRecord.find()
      .sort({ date: -1 })
      .limit(limit)
      .populate("createdBy", "name email")
      .lean();

    return records;
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData() {
    const [summary, categories, monthlyTrends, recentTransactions] =
      await Promise.all([
        this.getFinancialSummary(),
        this.getCategoryBreakdown(),
        this.getMonthlyTrends(),
        this.getRecentTransactions(),
      ]);

    return {
      summary,
      categoryBreakdown: categories,
      monthlyTrends,
      recentTransactions,
    };
  }

  /**
   * Get expense breakdown by category
   */
  async getExpensesByCategory() {
    const expenses = await FinancialRecord.aggregate([
      {
        $match: { type: "expense" },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    return expenses;
  }

  /**
   * Get income breakdown by category
   */
  async getIncomeByCategory() {
    const income = await FinancialRecord.aggregate([
      {
        $match: { type: "income" },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    return income;
  }

  /**
   * Get date-wise summary
   */
  async getDailySummary(startDate, endDate) {
    const summary = await FinancialRecord.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          income: 1,
          expenses: 1,
          netBalance: { $subtract: ["$income", "$expenses"] },
          count: 1,
        },
      },
    ]);

    return summary;
  }
}

module.exports = new DashboardService();
