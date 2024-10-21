exports.handleError = (
  res,
  error,
  code = 500,
  message = "Internal server error"
) => {
  console.error(message, error);
  return res.status(code).json({
    data: null,
    code,
    message,
  });
};
