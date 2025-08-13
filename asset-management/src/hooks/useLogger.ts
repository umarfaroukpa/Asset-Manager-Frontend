/**
 * Custom React hook for logging
 * Provides logging functionality 
 */
import { useCallback, useMemo } from 'react';
import { logger, createCustomLogger, LoggerConfig } from '../utils/logger';

// Hook for using the default logger
export const useLogger = () => {
  const logInfo = useCallback((message: string, data?: any) => {
    logger.info(message, data);
  }, []);

  const logWarn = useCallback((message: string, data?: any) => {
    logger.warn(message, data);
  }, []);

  const logError = useCallback((message: string, error?: any) => {
    logger.error(message, error);
  }, []);

  const logDebug = useCallback((message: string, data?: any) => {
    logger.debug(message, data);
  }, []);

  const logAuth = useCallback((message: string, data?: any) => {
    logger.auth(message, data);
  }, []);

  const logAPI = useCallback((message: string, data?: any) => {
    logger.api(message, data);
  }, []);

  const logFirebase = useCallback((message: string, data?: any) => {
    logger.firebase(message, data);
  }, []);

  const startTimer = useCallback((label: string) => {
    logger.time(label);
  }, []);

  const endTimer = useCallback((label: string) => {
    logger.timeEnd(label);
  }, []);

  return {
    logInfo,
    logWarn,
    logError,
    logDebug,
    logAuth,
    logAPI,
    logFirebase,
    startTimer,
    endTimer
  };
};

// Hook for creating custom logger with specific configuration
export const useCustomLogger = (config?: Partial<LoggerConfig>) => {
  const customLogger = useMemo(() => {
    if (config) {
      const fullConfig = {
        isDevelopment: import.meta.env.DEV,
        isDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
        ...config
      };
      return createCustomLogger(fullConfig);
    }
    return logger;
  }, [config]);

  const logInfo = useCallback((message: string, data?: any) => {
    customLogger.info(message, data);
  }, [customLogger]);

  const logWarn = useCallback((message: string, data?: any) => {
    customLogger.warn(message, data);
  }, [customLogger]);

  const logError = useCallback((message: string, error?: any) => {
    customLogger.error(message, error);
  }, [customLogger]);

  const logDebug = useCallback((message: string, data?: any) => {
    customLogger.debug(message, data);
  }, [customLogger]);

  const logAuth = useCallback((message: string, data?: any) => {
    customLogger.auth(message, data);
  }, [customLogger]);

  const logAPI = useCallback((message: string, data?: any) => {
    customLogger.api(message, data);
  }, [customLogger]);

  const logFirebase = useCallback((message: string, data?: any) => {
    customLogger.firebase(message, data);
  }, [customLogger]);

  const startTimer = useCallback((label: string) => {
    customLogger.time(label);
  }, [customLogger]);

  const endTimer = useCallback((label: string) => {
    customLogger.timeEnd(label);
  }, [customLogger]);

  return {
    logInfo,
    logWarn,
    logError,
    logDebug,
    logAuth,
    logAPI,
    logFirebase,
    startTimer,
    endTimer,
    config: customLogger.config
  };
};

// Hook for component-specific logging with automatic context
export const useComponentLogger = (componentName: string) => {
  const logger = useLogger();

  const logInfo = useCallback((message: string, data?: any) => {
    logger.logInfo(`[${componentName}] ${message}`, data);
  }, [componentName, logger]);

  const logWarn = useCallback((message: string, data?: any) => {
    logger.logWarn(`[${componentName}] ${message}`, data);
  }, [componentName, logger]);

  const logError = useCallback((message: string, error?: any) => {
    logger.logError(`[${componentName}] ${message}`, error);
  }, [componentName, logger]);

  const logDebug = useCallback((message: string, data?: any) => {
    logger.logDebug(`[${componentName}] ${message}`, data);
  }, [componentName, logger]);

  return {
    logInfo,
    logWarn,
    logError,
    logDebug,
    logAuth: logger.logAuth,
    logAPI: logger.logAPI,
    logFirebase: logger.logFirebase,
    startTimer: logger.startTimer,
    endTimer: logger.endTimer
  };
};