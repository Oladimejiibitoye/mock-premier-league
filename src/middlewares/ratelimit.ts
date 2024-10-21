import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Define a rate limit configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      message: 'Too many requests. Please try again later.'
    });
  },
});

export default apiLimiter;
