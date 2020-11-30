import { format, createLogger, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = createLogger({
  format: combine(label({ label: 'Space API' }), timestamp(), logFormat),
  level: 'debug',
  transports: [new transports.Console()],
});
