import { ConsoleLogger, Injectable, Scope } from '@nestjs/common'
import { GlobalLoggerService } from './logger.service'

@Injectable({ scope: Scope.TRANSIENT })
export class TerminusLogger extends ConsoleLogger {
  constructor(private readonly logger: GlobalLoggerService) {
    super()
    this.logger.setContext({ label: TerminusLogger.name })
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
