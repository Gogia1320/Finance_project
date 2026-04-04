/**
 * Financial Service
 * Business logic for financial record management and operations
 */

const FinancialRecord = require("../models/FinancialRecord");

class FinancialService {
  /**
   * Create a new financial record
   */
  async createRecord(recordData, userId) {
    const record = new FinancialRecord({
      ...recordData,
      createdBy: userId,
    });

    await record.save();
    await record.populate("createdBy", "name email");

    return record;
  }

  /**
   * Get all financial records with pagination and filters
   */
  async getAllRecords(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    // Category filter
    if (filters.category) {
      query.category = filters.category;
    }

    // Type filter
    if (filters.type) {
      query.type = filters.type;
    }

    // Sorting
    const sortField = filters.sortBy === "amount" ? "amount" : "date";
    const sortOrder = filters.sortOrder === "asc" ? 1 : -1;

    const [records, total] = await Promise.all([
      FinancialRecord.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder })
        .populate("createdBy", "name email"),
      FinancialRecord.countDocuments(query),
    ]);

    return {
      records,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get record by ID
   */
  async getRecordById(recordId) {
    const record = await FinancialRecord.findById(recordId).populate(
      "createdBy",
      "name email",
    );

    if (!record) {
      const error = new Error("Record not found");
      error.statusCode = 404;
      throw error;
    }

    return record;
  }

  /**
   * Update financial record
   */
  async updateRecord(recordId, updateData) {
    const record = await FinancialRecord.findByIdAndUpdate(
      recordId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).populate("createdBy", "name email");

    if (!record) {
      const error = new Error("Record not found");
      error.statusCode = 404;
      throw error;
    }

    return record;
  }

  /**
   * Delete financial record
   */
  async deleteRecord(recordId) {
    const record = await FinancialRecord.findByIdAndDelete(recordId);

    if (!record) {
      const error = new Error("Record not found");
      error.statusCode = 404;
      throw error;
    }

    return record;
  }

  /**
   * Get records for dashboard (recent transactions)
   */
  async getRecentRecords(limit = 5) {
    const records = await FinancialRecord.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("createdBy", "name email");

    return records;
  }
}

module.exports = new FinancialService();
