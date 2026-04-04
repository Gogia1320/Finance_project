/**
 * Response Handler Utility
 * Standardized response formatting for consistency
 */

const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (
  res,
  message = "Error",
  statusCode = 400,
  details = null,
) => {
  const response = {
    success: false,
    message,
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
