import { repl } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  //   await repl(AppModule)
  // 加载repl历史，这样重新启动时不会丢失历史
  const replServer = await repl(AppModule)
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err) {
      console.error(err)
    }
  })
}
bootstrap()
