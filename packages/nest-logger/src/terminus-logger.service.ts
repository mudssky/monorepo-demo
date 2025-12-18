import { ConsoleLogger, Injectable, Logger, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.TRANSIENT })
export class TerminusLogger extends ConsoleLogger {
  private readonly logger = new Logger(TerminusLogger.name)
  constructor() {
    super()
  }
  error(message: any, stack?: string, context?: string): void
  error(message: any, ...optionalParams: any[]): void
  error(
    message: unknown,
    stack?: unknown,
    context?: unknown,
    ...rest: unknown[]
  ): void {
    // Overwrite here how error messages should be logged
    this.logger.error(message, stack, context, ...rest)
  }
}
