import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { INestApplication } from '@nestjs/common'
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
  const app = await NestFactory.create(AppModule)
  // 这里可以注册全局中间件
  // app.use(logger);
  // 改为在app.module注册
  // app.useGlobalPipes(new ValidationPipe())

  // 获取配置
  const configService = app.get(ConfigService)
  setupSwagger(app)

  await app.listen(configService.get<number>('PORT') ?? 33101)
}
bootstrap()
