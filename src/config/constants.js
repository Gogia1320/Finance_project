/**
 * Application Constants
 */

const ROLES = {
  VIEWER: "viewer",
  ANALYST: "analyst",
  ADMIN: "admin",
};

const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

const RECORD_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
};

const RECORD_CATEGORIES = {
  SALARY: "salary",
  BONUS: "bonus",
  INVESTMENT: "investment",
  FOOD: "food",
  TRANSPORT: "transport",
  UTILITIES: "utilities",
  ENTERTAINMENT: "entertainment",
  HEALTHCARE: "healthcare",
  EDUCATION: "education",
  OTHER: "other",
};

const PERMISSIONS = {
  [ROLES.VIEWER]: {
    users: ["readProfile"],
    records: [],
    dashboard: ["summary", "recent"], // limited access
  },
  [ROLES.ANALYST]: {
    users: ["readProfile"],
    records: ["read"],
    dashboard: ["summary", "recent", "category", "trends", "daily"],
  },
  [ROLES.ADMIN]: {
    users: ["create", "read", "update", "delete"],
    records: ["create", "read", "update", "delete"],
    dashboard: ["summary", "recent", "category", "trends", "daily"],
  },
};

module.exports = {
  ROLES,
  USER_STATUS,
  RECORD_TYPES,
  RECORD_CATEGORIES,
  PERMISSIONS,
};
