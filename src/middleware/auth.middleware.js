import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError("Access token is required", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError("Invalid access token", 401));
    }

    if (error.name === "TokenExpiredError") {
      return next(createError("Access token expired", 401));
    }

    next(error);
  }
};

export default authMiddleware;