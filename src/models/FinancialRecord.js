/**
 * Financial Record Model
 * Stores financial transactions (income/expense) with categorization
 */

const mongoose = require("mongoose");
const { RECORD_TYPES, RECORD_CATEGORIES } = require("../config/constants");

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    type: {
      type: String,
      enum: Object.values(RECORD_TYPES),
      required: [true, "Type (income/expense) is required"],
    },
    category: {
      type: String,
      enum: Object.values(RECORD_CATEGORIES),
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
financialRecordSchema.index({ date: 1 });
financialRecordSchema.index({ category: 1 });
financialRecordSchema.index({ type: 1 });
financialRecordSchema.index({ createdBy: 1 });
financialRecordSchema.index({ createdAt: -1 });

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);
