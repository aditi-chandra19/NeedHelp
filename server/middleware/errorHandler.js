export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  console.error("Unhandled backend error:", error);
  response.status(500).json({
    message: "Something went wrong on the server.",
  });
}
