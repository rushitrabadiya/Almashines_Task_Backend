exports.sendResponse = (res, data, code = 200, message = "Success") => {
  return res.status(code).json({
    data,
    code,
    message,
  });
};
