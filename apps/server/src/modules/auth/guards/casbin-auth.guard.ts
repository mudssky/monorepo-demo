import { DatabaseException } from '@/common/exceptions'
import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import * as casbin from 'casbin'
import { PrismaAdapter } from 'casbin-prisma-adapter'
import { Request } from 'express'
import { JwtUser } from '../types'
import { checkIsPublic } from './jwt-auth/jwt-auth.guard'

/**
 * 这个guard要放在jwt鉴权之后执行，因为鉴权后可以拿到jwt token中的用户信息
 */
@Injectable()
export class CasbinAuthGuard implements CanActivate {
  constructor(
    private logger: GlobalLoggerService,
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    console.log('casbin auth')

    if (checkIsPublic(context, this.reflector)) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const userPlayload = request.user as JwtUser
    const currentUser = await this.prismaService.user.findUnique({
      where: {
        id: userPlayload.userId,
      },
    })
    if (!currentUser) {
      throw new DatabaseException('用户不存在')
    }
    const casbinModalPath = this.configService.get('CASBIN_MODAL_PATH')
    const a = await PrismaAdapter.newAdapter()
    const e = await casbin.newEnforcer(casbinModalPath, a)
    const canPass = await e.enforce(
      currentUser.role,
      request.url,
      request.method,
    )
    return canPass
  }
}
