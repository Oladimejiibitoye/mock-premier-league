import winston from 'winston';

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize(),
            winston.format.align(),
            winston.format.printf((info) => {
              let msg = `${info.timestamp}`;
              msg = `${msg}: ${info.level}`;
              msg = `${msg}: ${info.message.trim()}`;
              return msg;
            }),
          ),
        }),
      ],
    });
  }

  private log(level: string, message: string, obj: any = null): void {
    if (obj) {
      if (obj instanceof Error) {
        const errorInfo = {
          message: obj.message,
          stack: obj.stack,
        };
        message += ': ' + JSON.stringify(errorInfo, null, 2);
      } else {
        message += ': ' + JSON.stringify(obj, null, 2);
      }
    }
    this.logger.log(level, message);
  }

  info(message: string, obj: any = null): void {
    this.log('info', message, obj);
  }

  warn(message: string, obj: any = null): void {
    this.log('warn', message, obj);
  }

  error(message: string, obj: any = null): void {
    this.log('error', message, obj);
  }

  debug(message: string, obj: any = null): void {
    this.log('debug', message, obj);
  }
}

const logger = new Logger();

export default logger;
