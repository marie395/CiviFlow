export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route non trouvée : ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Identifiant invalide";
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = `Valeur en double pour le champ : ${Object.keys(err.keyValue).join(", ")}`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
