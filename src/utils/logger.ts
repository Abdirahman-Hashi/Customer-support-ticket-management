type LogLevel = "info" | "error" | "warn" | "debug";

function log(level: LogLevel, msg: string, meta?: Record<string, unknown>) {
  const entry = {
    level,
    msg,
    time: new Date().toISOString(),
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("error", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => log("debug", msg, meta),
};
