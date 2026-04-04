/**
 * Financial Record Routes
 * CRUD operations for financial records
 */

const express = require("express");
const router = express.Router();

const financialController = require("../controllers/financialController");
const auth = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const {
  validate,
  validateQuery,
  financialRecordCreateSchema,
  financialRecordUpdateSchema,
  filterRecordsSchema,
} = require("../utils/validators");

// All routes require authentication
router.use(auth);

/**
 * POST /api/records
 * Create a new financial record
 * @requires authentication
 * @requires admin role
 */
router.post(
  "/",
  authorize("records", "create"),
  validate(financialRecordCreateSchema),
  financialController.createRecord,
);

/**
 * GET /api/records
 * Get all financial records with filters and pagination
 * @requires authentication
 * @requires analyst or admin role
 * @queryParams page, limit, startDate, endDate, category, type, sortBy, sortOrder
 */
router.get(
  "/",
  authorize("records", "read"),
  validateQuery(filterRecordsSchema),
  financialController.getAllRecords,
);

/**
 * GET /api/records/recent
 * Get recent transactions (last 5)
 * @requires authentication
 * @requires analyst or admin role
 */
router.get(
  "/recent",
  authorize("records", "read"),
  financialController.getRecentRecords,
);

/**
 * GET /api/records/:id
 * Get a specific record by ID
 * @requires authentication
 * @requires analyst or admin role
 */
router.get(
  "/:id",
  authorize("records", "read"),
  financialController.getRecordById,
);

/**
 * PUT /api/records/:id
 * Update a financial record
 * @requires authentication
 * @requires admin role
 */
router.put(
  "/:id",
  authorize("records", "update"),
  validate(financialRecordUpdateSchema),
  financialController.updateRecord,
);

/**
 * DELETE /api/records/:id
 * Delete a financial record
 * @requires authentication
 * @requires admin role
 */
router.delete(
  "/:id",
  authorize("records", "delete"),
  financialController.deleteRecord,
);

module.exports = router;
