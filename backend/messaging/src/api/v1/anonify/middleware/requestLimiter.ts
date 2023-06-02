import rateLimiter from "express-rate-limit";
import { ErrorMessages } from "../../../errorMessages";

export const requestLimiter = rateLimiter({
	max: 3,
	windowMs: 60000,
	standardHeaders: false,
	message: {
		status: 429,
		message: ErrorMessages.RateLimited
	}
});
