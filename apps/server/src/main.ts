import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import metadata from './metadata'
import { GlobalLoggerService } from './modules/logger/logger.service'

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
    .addBearerAuth()
    .addSecurityRequirements('bearer') //给所有标签添加字段，不然需要每个控制器上面用@ApiBearerAuth()
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
  const document = SwaggerModule.createDocument(app, docConfig)
  SwaggerModule.setup('docs', app, document)
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
  globalLogger.info('global logger setup succeed')
  globalLogger.info({
    message: 'config setup success',
    config: configService,
  })

  // Helmet 可以通过适当设置 HTTP 标头来帮助保护你的应用免受一些众所周知的 Web 漏洞的侵害。
  app.use(helmet())

  // 前缀感觉太累赘了，还是去掉
  // app.setGlobalPrefix(configService.get('GLOBAL_PREFIX') ?? '/api')
  await setupSwagger(app)
  globalLogger.info('swagger setup succeed')

  const port = configService.get<number>('PORT') ?? 33101
  globalLogger.info(`server start at http://localhost:${port}`)
  globalLogger.info(`docs at http://localhost:${port}/docs`)
  await app.listen(port)
  configHotReload(app)
}

bootstrap()
