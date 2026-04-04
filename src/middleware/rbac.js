/**
 * Role-Based Access Control (RBAC) Middleware
 * Controls access to resources based on user role and required permissions
 */

const { PERMISSIONS } = require("../config/constants");

/**
 * Check if user has required permission
 * @param {string} resource - Resource name (users, records, dashboard)
 * @param {string} action - Action name (read, create, update, delete)
 */
const authorize = (resource, action) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      const userPermissions = PERMISSIONS[userRole];

      // Check if user has access to resource
      if (!userPermissions || !userPermissions[resource]) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Resource not available for your role.",
        });
      }

      // Check if user has required action permission
      if (!userPermissions[resource].includes(action)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have permission to ${action} ${resource}.`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization error",
        error: error.message,
      });
    }
  };
};

module.exports = { authorize };
