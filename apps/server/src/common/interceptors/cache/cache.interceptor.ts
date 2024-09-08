import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Redis } from 'ioredis'
import { of, tap } from 'rxjs'

/**
 * 使用拦截器，实现cache-manager提供的拦截器的效果
 * 这里还未实现缓存时间
 */
@Injectable()
export class MyCacheInterceptor implements NestInterceptor {
  @Inject('REDIS_CLIENT')
  private redisClient: Redis

  @Inject(HttpAdapterHost)
  private httpAdapterHost: HttpAdapterHost

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const key = this.httpAdapterHost.httpAdapter.getRequestUrl(request)

    const value = await this.redisClient.get(key)

    if (!value) {
      return next.handle().pipe(
        tap((res) => {
          this.redisClient.set(key, res)
        }),
      )
    } else {
      return of(value)
    }
  }
}
