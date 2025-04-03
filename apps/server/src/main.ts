import { GlobalLoggerService } from '@lib'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { CustomResponseDto } from './common/dto/response.dto'
import metadata from './metadata'
import { getServerIp } from './common/utils'

declare const module: any
function configHotReload(app: INestApplication<any>) {
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

/**
 * 配置swagger
 * @param app
 */
async function setupSwagger(app: INestApplication<any>) {
  const docConfig = new DocumentBuilder()
    .setTitle('admin server')
    .setDescription('The server API description')
    .setVersion('1.0')
    .addBasicAuth({
      type: 'http',
      name: 'basic',
      description: '用户名 + 密码',
    })
    .addCookieAuth('sid', {
      type: 'apiKey',
      name: 'cookie',
      description: '基于 cookie 的认证',
    })
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
      name: 'bearer',
    })
    .addSecurityRequirements('bearer')
    //给所有标签添加字段，不然需要每个控制器上面用@ApiBearerAuth()
    // .addSecurity('ApiKeyAuth', {
    //   type: 'http',
    //   in: 'header',
    //   name: 'Authorization',
    // })

    // .addGlobalParameters({
    //   name: 'Authorization',
    //   in: 'header',
    // })
    .build()
  await SwaggerModule.loadPluginMetadata(metadata)
  const document = SwaggerModule.createDocument(app, docConfig, {
    extraModels: [CustomResponseDto], //导入全局用到的额外模型类
  })
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    // http://localhost:33101/docs/swagger.json
    jsonDocumentUrl: 'docs/swagger.json',
    swaggerOptions: {
      // 搭配explorer使用，可以在顶部展示选择框选择不同的文档
      urls: [
        {
          name: 'admin',
          url: 'docs/swagger.json',
        },
      ],
      docExpansion: 'list', //文档展开配置(默认是列表展开)  "list", "full", "none"
      defaultModelsExpandDepth: 0, //配置schema列表默认的展开深度， 默认是1,设为-1是完全隐藏,这里设为0，默认是折叠状态比较好，因为这个用的不多
      defaultModelExpandDepth: 5, //配置response之类地方schema默认展开深度，默认是1,设为-1是完全隐藏
      persistAuthorization: true, //保留授权数据，不会在浏览器关闭/刷新时丢失
      filter: true, //增加一个根据tag过滤的搜索框,也可以配置字符串
      tryItOutEnabled: false, //自动开启试用
      defaultModelRendering: 'example', //默认展示示例值还是模型 "example", "model"
      // maxDisplayedTags: 3,最多展示tag数，超出的会隐藏，但是还是可以通过filter筛选到
      displayRequestDuration: true, //展示请求耗时
    },
  })
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, //先缓存，等flush命令调用才会写入,这样保证日志用后续初始化完的logger使用
  })
  // 这里可以注册全局中间件
  // app.use(logger);
  // 改为在app.module注册
  // app.useGlobalPipes(new ValidationPipe())

  // 获取配置
  const configService = app.get(ConfigService)
  // const globalLogger = app.get(GlobalLoggerService)
  // 非单例依赖的作用域，需要使用resolve来创建实例
  const globalLogger = await app.resolve(GlobalLoggerService)

  app.useLogger(globalLogger)
  globalLogger.debug(
    `global logger setup succeed,NODE_ENV:${process.env.NODE_ENV}`,
  )
  globalLogger.debug({
    message: 'config setup success',
    config: configService,
  })

  // Helmet 可以通过适当设置 HTTP 标头来帮助保护你的应用免受一些众所周知的 Web 漏洞的侵害。
  // 禁用coop，因为开启coop后，必须部署https，不然浏览器无法访问，会报错。除非手动禁止
  // 比如 chrome.exe --disable-web-security --user-data-dir="C:/temp"

  // crossOriginOpenerPolicy 禁用跨域资源策略(COOP)头，COOP可以防止恶意网站通过 window.opener 访问你的页面，
  // COOP要求必须使用HTTPS，在开发环境使用HTTP时会报错

  // 禁用跨域资源策略(CORP)头 控制哪些跨域请求可以加载你的资源 开发环境可能需要从不同源加载资源，严格CORP会限制开发

  // 禁用内容安全策略(CSP)头 CSP是一种安全机制，用于防止XSS攻击，通过限制哪些外部资源可以被加载，开发环境可能需要加载各种资源，严格CSP可能导致开发不便
  app.use(
    helmet({
      contentSecurityPolicy: false, // 禁用CSP
      crossOriginOpenerPolicy: false, // 禁用COOP
      crossOriginResourcePolicy: false, // 禁用CORP
    }),
  )

  // 前缀感觉太累赘了，还是去掉
  // app.setGlobalPrefix(configService.get('GLOBAL_PREFIX') ?? '/api')
  await setupSwagger(app)
  globalLogger.debug('swagger setup succeed')
  const serverIp = getServerIp()
  const port = configService.get<number>('PORT') ?? 33101
  globalLogger.debug(`server start at http://${serverIp}:${port}`)
  globalLogger.debug(`docs at http://${serverIp}:${port}/docs`)
  await app.listen(port)
  configHotReload(app)
}

bootstrap()
