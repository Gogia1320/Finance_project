/**
 * User Service
 * Business logic for user management operations
 */

const jwt = require("jwt-simple");
const User = require("../models/User");

class UserService {
  /**
   * Register a new user
   */
  async register(userData) {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    return user;
  }

  /**
   * Login user and generate JWT token
   */
  async login(email, password) {
    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Parse JWT_EXPIRY (e.g., "7d" or "24h")
    const expiryStr = process.env.JWT_EXPIRY || "7d";
    const expiryMs = this.parseExpiry(expiryStr);
    const expiry = Math.floor(Date.now() / 1000) + expiryMs / 1000;

    tokenData.exp = expiry;

    const token = jwt.encode(tokenData, process.env.JWT_SECRET);

    return {
      token,
      user: user.toJSON(),
    };
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user (role, status)
   */
  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Parse expiry string (e.g., "7d", "24h")
   */
  parseExpiry(expiryStr) {
    const match = expiryStr.match(/^(\d+)([dhms])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

    const value = parseInt(match[1]);
    const unit = match[2];

    const units = {
      d: 24 * 60 * 60 * 1000,
      h: 60 * 60 * 1000,
      m: 60 * 1000,
      s: 1000,
    };

    return value * units[unit];
  }
}

module.exports = new UserService();
