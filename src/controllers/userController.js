/**
 * User Controller
 * Handles HTTP requests for user management
 */

const userService = require("../services/userService");
const { sendSuccess, sendError } = require("../utils/responseHandler");

class UserController {
  /**
   * Register a new user
   */
  async register(req, res, next) {
    try {
      const user = await userService.register(req.body);
      sendSuccess(res, user.toJSON(), "User registered successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      sendSuccess(res, result, "Login successful", 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req, res, next) {
    try {
      sendSuccess(res, req.user.toJSON(), "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const result = await userService.getAllUsers(page, limit);
      sendSuccess(res, result, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID (Admin only)
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      sendSuccess(res, user.toJSON(), "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user (Admin only)
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      sendSuccess(res, user.toJSON(), "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      sendSuccess(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
