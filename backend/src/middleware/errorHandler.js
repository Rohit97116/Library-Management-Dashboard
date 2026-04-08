function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || "Something went wrong.",
    ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
  });
}

module.exports = {
  errorHandler,
  notFound,
};
