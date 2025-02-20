import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Log directory
const logDirectory = process.env.LOG_DIR || "./logs";

// Define log format
const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

// Create winston logger instance
const logger = winston.createLogger({
	level: "info",
	format: logFormat,
	transports: [
		// Console transport
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
		}),

		// Error log file rotation
		new DailyRotateFile({
			filename: `${logDirectory}/error-%DATE%.log`,
			datePattern: "YYYY-MM-DD",
			level: "error",
			maxSize: "10m",
			maxFiles: "14d", // Keep logs for 14 days
			zippedArchive: true,
		}),

		// Combined log file rotation
		new DailyRotateFile({
			filename: `${logDirectory}/combined-%DATE%.log`,
			datePattern: "YYYY-MM-DD",
			maxSize: "10m",
			maxFiles: "14d",
			zippedArchive: true,
		}),
	],
});

export default logger;
