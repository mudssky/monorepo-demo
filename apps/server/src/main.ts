import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { INestApplication } from '@nestjs/common'
import { GlobalLoggerService } from './modules/logger/logger.service'

/**
 * 配置swagger
 * @param app
 */
function setupSwagger(app: INestApplication<any>) {
  const docConfig = new DocumentBuilder()
    .setTitle('server example')
    .setDescription('The server API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
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
  const globalLogger = app.get(GlobalLoggerService)
  app.useLogger(globalLogger)
  globalLogger.info('global logger setup succeed')
  globalLogger.info({
    message: 'config setup success',
    config: configService,
  })
  setupSwagger(app)
  globalLogger.info('swagger setup succeed')

  const port = configService.get<number>('PORT') ?? 33101
  globalLogger.info(`server start at http://localhost:${port}`)
  globalLogger.info(`docs at http://localhost:${port}/docs`)
  await app.listen(port)
}

bootstrap()
