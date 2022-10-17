exports.success = function (statusCode, message, results) {
  return {
    error: false,
    status_code: statusCode,
    message,
    results,
  };
};

exports.error = function (message, statusCode) {
  const codes = [200, 201, 400, 401, 412, 404, 403, 422, 500];
  const findCode = codes.find((code) => code == statusCode);
  if (!findCode) statusCode = 500;
  else statusCode = findCode;
  return {
    error: false,
    status_code: statusCode,
    message,
    results: {},
  };
};

exports.validation = (message, errors) => {
  return {
    error: true,
    error_code: 422,
    message: message,
    errors,
  };
};
