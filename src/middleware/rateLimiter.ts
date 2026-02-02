import rateLimit from "express-rate-limit";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000); // 15 minutes
const max = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100); // requests per window per IP

export const apiLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  // Disable in test environment and bypass docs endpoints
  skip: (req) =>
    process.env.NODE_ENV === "test" || req.path === "/docs.json" || req.path.startsWith("/docs"),
});
