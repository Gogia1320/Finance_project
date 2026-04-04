/**
 * Financial Controller
 * Handles HTTP requests for financial record management
 */

const financialService = require("../services/financialService");
const { sendSuccess, sendError } = require("../utils/responseHandler");

class FinancialController {
  /**
   * Create a new financial record (Admin only)
   */
  async createRecord(req, res, next) {
    try {
      const record = await financialService.createRecord(
        req.body,
        req.user._id,
      );
      sendSuccess(res, record, "Financial record created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all financial records with filters
   */
  async getAllRecords(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const filters = {};
      if (req.query.startDate) filters.startDate = req.query.startDate;
      if (req.query.endDate) filters.endDate = req.query.endDate;
      if (req.query.category) filters.category = req.query.category;
      if (req.query.type) filters.type = req.query.type;
      if (req.query.sortBy) filters.sortBy = req.query.sortBy;
      if (req.query.sortOrder) filters.sortOrder = req.query.sortOrder;

      const result = await financialService.getAllRecords(page, limit, filters);
      sendSuccess(res, result, "Records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get record by ID
   */
  async getRecordById(req, res, next) {
    try {
      const record = await financialService.getRecordById(req.params.id);
      sendSuccess(res, record, "Record retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update financial record (Admin only)
   */
  async updateRecord(req, res, next) {
    try {
      const record = await financialService.updateRecord(
        req.params.id,
        req.body,
      );
      sendSuccess(res, record, "Record updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete financial record (Admin only)
   */
  async deleteRecord(req, res, next) {
    try {
      await financialService.deleteRecord(req.params.id);
      sendSuccess(res, null, "Record deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent transactions (for dashboard)
   */
  async getRecentRecords(req, res, next) {
    try {
      const limit = req.query.limit || 5;
      const records = await financialService.getRecentRecords(limit);
      sendSuccess(res, records, "Recent records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FinancialController();
