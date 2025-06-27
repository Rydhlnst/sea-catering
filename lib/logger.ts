import pino from "pino"

const isEdge = process.env.NEXT_RUNTIME === "edge"
const isProduction = process.env.NODE_ENV === "production"

const logger = isEdge
  ? console // ⛔️ Pino tidak dipakai di Edge Runtime
  : pino({
      level: process.env.LOG_LEVEL || "info",
      ...(isProduction
        ? {}
        : {
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
                ignore: "pid,hostname",
                translateTime: "SYS:standard",
              },
            },
          }),
      formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    })

export default logger
