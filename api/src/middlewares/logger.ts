import { pinoLogger } from "hono-pino";
import pino from "pino";

function consoleLogger() {
  return pino({
    name: "console-logger",
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss",
        space: 2,
        colorizeObjects: true,
      },
    },
  });
}

export function logger() {
  return pinoLogger({ pino: consoleLogger() });
}
