/**
 * Input Validation Schemas
 * Using Joi for input validation
 */

const Joi = require("joi");
const {
  ROLES,
  RECORD_TYPES,
  RECORD_CATEGORIES,
} = require("../config/constants");

// User Validation
const userRegisterSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  role: Joi.string().valid(...Object.values(ROLES)),
  status: Joi.string().valid("active", "inactive"),
}).min(1);

// Financial Record Validation
const financialRecordCreateSchema = Joi.object({
  amount: Joi.number().required().min(0),
  type: Joi.string()
    .valid(...Object.values(RECORD_TYPES))
    .required(),
  category: Joi.string()
    .valid(...Object.values(RECORD_CATEGORIES))
    .required(),
  date: Joi.date().required(),
  notes: Joi.string().max(500),
});

const financialRecordUpdateSchema = Joi.object({
  amount: Joi.number().min(0),
  type: Joi.string().valid(...Object.values(RECORD_TYPES)),
  category: Joi.string().valid(...Object.values(RECORD_CATEGORIES)),
  date: Joi.date(),
  notes: Joi.string().max(500),
}).min(1);

// Query Validation
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const filterRecordsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  startDate: Joi.date(),
  endDate: Joi.date(),
  category: Joi.string(),
  type: Joi.string().valid(...Object.values(RECORD_TYPES)),
  sortBy: Joi.string().valid("date", "amount").default("date"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

/**
 * Validation middleware
 * @param {object} schema - Joi schema object
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details,
      });
    }

    // Replace body with validated values
    req.body = value;
    next();
  };
};

/**
 * Query validation middleware
 * @param {object} schema - Joi schema object
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details,
      });
    }

    // Replace query with validated values
    req.query = value;
    next();
  };
};

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
  financialRecordCreateSchema,
  financialRecordUpdateSchema,
  paginationSchema,
  filterRecordsSchema,
  validate,
  validateQuery,
};
