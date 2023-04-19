import { createLogger, format, transports, Logger } from 'winston';
import { consoleFormat } from 'winston-console-format';
import { EnvEnum } from '../../general-types';

const fileBaseOptions = {
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  colorize: false,
};

const getDate = () => new Date().toISOString().split('T')[0];
const options = (component: string) => {
  return {
    combinedFile: {
      filename: `./logs/${getDate()}/${component}/combined_logs.log`,
      ...fileBaseOptions,
    },
    errorFile: {
      level: 'error',
      filename: `./logs/${getDate()}/${component}/error_logs.log`,
      ...fileBaseOptions,
    },
    console:
      process.env.NODE_ENV !== EnvEnum.DEV
        ? { level: 'debug', handleExceptions: true }
        : {
            level: 'debug',
            handleExceptions: true,
            format: format.combine(
              format.colorize({ all: true }),
              format.padLevels(),
              consoleFormat({
                showMeta: true,
                metaStrip: ['timestamp'],
                inspectOptions: {
                  depth: Infinity,
                  colors: true,
                  maxArrayLength: Infinity,
                  breakLength: 120,
                  compact: Infinity,
                },
              })
            ),
          },
  };
};

const createLoggerForSpecificModule = (component: string): Logger => {
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { component },
    transports: [
      ...(process.env.NODE_ENV === EnvEnum.DEV
        ? [
            new transports.File(options(component).combinedFile),
            new transports.File(options(component).errorFile),
          ]
        : []),
      new transports.Console(options(component).console),
    ],
    exitOnError: false,
  });

  return logger;
};

export default createLoggerForSpecificModule;
