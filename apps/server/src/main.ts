import { GlobalLoggerService } from '@lib'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { CustomResponseDto } from './common/dto/response.dto'
import metadata from './metadata'

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
    // explorer: true,
    // http://localhost:33101/docs/swagger.json
    jsonDocumentUrl: 'docs/json',
    swaggerOptions: {
      // 搭配explorer使用，可以在顶部展示选择框选择不同的文档
      // urls: [
      //   {
      //     name: 'admin',
      //     url: 'docs/swagger.json',
      //   },
      // ],
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
  app.use(helmet())

  // 前缀感觉太累赘了，还是去掉
  // app.setGlobalPrefix(configService.get('GLOBAL_PREFIX') ?? '/api')
  await setupSwagger(app)
  globalLogger.debug('swagger setup succeed')

  const port = configService.get<number>('PORT') ?? 33101
  globalLogger.debug(`server start at http://localhost:${port}`)
  globalLogger.debug(`docs at http://localhost:${port}/docs`)
  await app.listen(port)
  configHotReload(app)
}

bootstrap()
