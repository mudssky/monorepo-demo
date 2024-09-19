import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common'
import { $Enums } from '@prisma/client'
import { JwtPayload } from './types'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

/**
 * 从请求中提取用户信息（request.user），通常是Jwt解析的内容
 * 使用localguard的登录接口上，则是user表的内容
 */
export const UserInfo = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest<Request>()
    const userInfo = request.user as JwtPayload
    if (!userInfo) {
      return null
    }
    return data ? userInfo[data] : userInfo
  },
)

/**
 * 可以在路由上使用该装饰器，指定需要的角色
 * 但是这样不方便统一管理，还是用casbin，在数据库配置比较方便
 * @param roles
 * @returns
 */
export const RequireRole = (...roles: $Enums.Role[]) =>
  SetMetadata('require-permission', roles)
