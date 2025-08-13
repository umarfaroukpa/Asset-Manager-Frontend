/**
 * Centralized logging utility for the application
 * Provides environment-aware logging with different levels
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
}

interface LoggerConfig {
  isDevelopment: boolean;
  isDebugMode: boolean;
}

// Environment configuration
const getLoggerConfig = (): LoggerConfig => ({
  isDevelopment: import.meta.env.DEV,
  isDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
});

// Helper function to create structured log entries
const createLogEntry = (
  level: LogLevel, 
  message: string, 
  data?: any, 
  context?: string
): LogEntry => ({
  level,
  message,
  data,
  context,
  timestamp: new Date().toISOString()
});

// Helper function to send errors to external service in production
const sendToErrorService = (entry: LogEntry, error?: any): void => {
    // This would send the error to an external service
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Example: Sentry.captureException(error, { extra: entry });
    console.log('Would send to error service:', { entry, error });
  }
};

// Core logging functions
const createLogger = (config: LoggerConfig = getLoggerConfig()) => {
  /**
   * Log info messages (only in development)
   */
  const info = (message: string, data?: any, context?: string): void => {
    if (config.isDevelopment) {
      const entry = createLogEntry('info', message, data, context);
      console.log(`[INFO] ${entry.message}`, data ? data : '');
    }
  };

  /**
   * Log warning messages
   */
  const warn = (message: string, data?: any, context?: string): void => {
    const entry = createLogEntry('warn', message, data, context);
    console.warn(`[WARN] ${entry.message}`, data ? data : '');
  };

  /**
   * Log error messages (always logged)
   */
  const error = (message: string, errorData?: any, context?: string): void => {
    const entry = createLogEntry('error', message, errorData, context);
    console.error(`[ERROR] ${entry.message}`, errorData ? errorData : '');
    
    // In production, send to error tracking service
    if (!config.isDevelopment) {
      sendToErrorService(entry, errorData);
    }
  };

  /**
   * Log debug messages (only when debug mode is enabled)
   */
  const debug = (message: string, data?: any, context?: string): void => {
    if (config.isDebugMode) {
      const entry = createLogEntry('debug', message, data, context);
      console.debug(`[DEBUG] ${entry.message}`, data ? data : '');
    }
  };

  /**
   * Log authentication related events
   */
  const auth = (message: string, data?: any): void => {
    info(`[AUTH] ${message}`, data, 'authentication');
  };

  /**
   * Log API related events
   */
  const api = (message: string, data?: any): void => {
    if (config.isDevelopment || config.isDebugMode) {
      info(`[API] ${message}`, data, 'api');
    }
  };

  /**
   * Log Firebase related events
   */
  const firebase = (message: string, data?: any): void => {
    info(`[FIREBASE] ${message}`, data, 'firebase');
  };

  /**
   * Performance timing utility
   */
  const time = (label: string): void => {
    if (config.isDevelopment) {
      console.time(`[PERF] ${label}`);
    }
  };

  const timeEnd = (label: string): void => {
    if (config.isDevelopment) {
      console.timeEnd(`[PERF] ${label}`);
    }
  };

  // Return logger interface
  return {
    info,
    warn,
    error,
    debug,
    auth,
    api,
    firebase,
    time,
    timeEnd,
    // Expose config for testing/debugging
    config
  };
};

// Create default logger instance
const logger = createLogger();

// Convenience exports for common use cases
export const logAuth = (message: string, data?: any) => logger.auth(message, data);
export const logAPI = (message: string, data?: any) => logger.api(message, data);
export const logFirebase = (message: string, data?: any) => logger.firebase(message, data);
export const logError = (message: string, error?: any) => logger.error(message, error);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logDebug = (message: string, data?: any) => logger.debug(message, data);

// Export logger factory for custom configurations
export const createCustomLogger = createLogger;

// Export types
export type { LogLevel, LogEntry, LoggerConfig };

// Export default logger
export { logger };
export default logger;