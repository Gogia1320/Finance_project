/**
 * User Routes
 * Authentication and user management endpoints
 */

const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const {
  validate,
  validateQuery,
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
  paginationSchema,
} = require("../utils/validators");

// Public routes
/**
 * POST /api/users/register
 * Register a new user
 * @public
 */
router.post("/register", validate(userRegisterSchema), userController.register);

/**
 * POST /api/users/login
 * Login user and get JWT token
 * @public
 */
router.post("/login", validate(userLoginSchema), userController.login);

// Protected routes
/**
 * GET /api/users/profile
 * Get current user profile
 * @requires authentication
 */
router.get("/profile", auth, userController.getProfile);

/**
 * GET /api/users
 * Get all users with pagination
 * @requires authentication
 * @requires admin role
 */
router.get(
  "/",
  auth,
  authorize("users", "read"),
  validateQuery(paginationSchema),
  userController.getAllUsers,
);

/**
 * GET /api/users/:id
 * Get user by ID
 * @requires authentication
 * @requires admin role
 */
router.get(
  "/:id",
  auth,
  authorize("users", "read"),
  userController.getUserById,
);

/**
 * PUT /api/users/:id
 * Update user (role, status)
 * @requires authentication
 * @requires admin role
 */
router.put(
  "/:id",
  auth,
  authorize("users", "update"),
  validate(userUpdateSchema),
  userController.updateUser,
);

/**
 * DELETE /api/users/:id
 * Delete user
 * @requires authentication
 * @requires admin role
 */
router.delete(
  "/:id",
  auth,
  authorize("users", "delete"),
  userController.deleteUser,
);

module.exports = router;
