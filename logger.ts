export type ConsoleMethod = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  constructor(private readonly metadata: any = {}) {}

  verbose(message: string): void;
  verbose(message: string, meta: any): void;
  verbose(message: string, error: Error, meta?: any): void;
  verbose(message: string, ...args: any[]): void {
    this.log('debug', message, args);
  }

  debug(message: string): void;
  debug(message: string, meta: any): void;
  debug(message: string, error: Error, meta?: any): void;
  debug(message: string, ...args: any[]): void {
    this.log('debug', message, args);
  }

  info(message: string): void;
  info(message: string, meta: any): void;
  info(message: string, error: Error, meta?: any): void;
  info(message: string, ...args: any[]): void {
    this.log('info', message, args);
  }

  warn(message: string): void;
  warn(message: string, meta: any): void;
  warn(message: string, error: Error, meta?: any): void;
  warn(message: string, ...args: any[]): void {
    this.log('warn', message, args);
  }

  error(message: string): void;
  error(message: string, meta: any): void;
  error(message: string, error: Error, meta?: any): void;
  error(message: string, ...args: any[]): void {
    this.log('error', message, args);
  }

  private log(method: ConsoleMethod, message: string, args: any[] = []) {
    let error: Error | undefined = undefined;
    let meta;

    if (args.length >= 1) {
      if (args[0] instanceof Error) {
        error = args[0];
        if (args.length >= 2) {
          meta = args[1];
        }
      } else {
        meta = args[0];
      }
    }

    const extra = {
      ...this.metadata,
      ...meta,
    };

    console[method](
      JSON.stringify({
        level: method,
        message,
        extra: Object.keys(extra).length > 0 ? extra : undefined,
      }),
    );
  }
}
