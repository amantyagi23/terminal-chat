import pino from "pino";
import path from "path";
import { isProduction } from "../../config";

// HTTP Transport (access logs)
const httpTransport = pino.transport({
  target: "pino-roll",
  options: {
    file: path.join("logs", "access.log"),
    frequency: 432000000, // 5 days
    maxSize: "50MB",
    mkdir: true,
    compress: true,
    limit: { count: 5 },
    retain: 5,
  },
});

export const httpLogger = pino(
  {
    base: null,
    level: "info",
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      },
    },
  },
  httpTransport
);

const appTransport = pino.transport({
  target: "pino-roll",
  options: {
    file: path.join("logs", "errors.log"),
    frequency: 604800000, // 7 days
    maxSize: "50MB",
    mkdir: true,
    compress: true,
    limit: { count: 5 },
    retain: 5,
  },
});

const consoleTransport = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname",
    singleLine: true,
  },
});

// Application Logger
export const appLogger = pino(
  {
    base: null,
    level: "info",
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      },
    },
  },
  isProduction ? appTransport : consoleTransport
);
