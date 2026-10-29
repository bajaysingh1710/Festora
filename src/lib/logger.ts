type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const payload = {
    severity: level,
    message,
    timestamp,
    ...data,
  };

  if (level === 'ERROR') {
    console.error(`[Festora ${level}] ${message}`, payload);
  } else if (level === 'WARN') {
    console.warn(`[Festora ${level}] ${message}`, payload);
  } else {
    console.log(`[Festora ${level}] ${message}`, payload);
  }
}

export const logInfo = (msg: string, d?: Record<string, unknown>) => log('INFO', msg, d);
export const logWarn = (msg: string, d?: Record<string, unknown>) => log('WARN', msg, d);
export const logError = (msg: string, d?: Record<string, unknown>) => log('ERROR', msg, d);
