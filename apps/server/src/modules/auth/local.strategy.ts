import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'

/**
 * passport 策略，可以从 @UseGuards(AuthGuard('local'))这样调用，比较抽象了。
 * 成功返回用户对象，失败时返回null，也可以像下面这样抛异常，交给全局异常策略处理
 *
 * 可能是通过实例的类型找到具体的策略的，即使修改类名也不影响
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    //    PassportStrategy可以定义从请求体中解析的参数，也可以传递req给validate回调的参数，这样可以自由操作
    //     interface IStrategyOptions {
    //     usernameField?: string | undefined;
    //     passwordField?: string | undefined;
    //     session?: boolean | undefined;
    //     passReqToCallback?: false | undefined;
    // }

    // 下面其实是默认的配置，不传入参数也是这样的
    super({
      usernameField: 'username',
      passwordField: 'password',
    })
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({
      username,
      password,
    })
    // 因为用户不存在的情况，在validateUser里面处理过了，所以这里没有必要
    // if (!user) {
    //   throw new UnauthorizedException('认证未通过')
    // }
    // 返回的用户会被AuthGuard添加到req对象上。
    return user
  }
}
