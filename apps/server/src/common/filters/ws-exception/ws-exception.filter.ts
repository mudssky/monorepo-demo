import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'

@Catch()
export class GlobalWsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    super.catch(exception, host)
    // 暂不进行特殊错误处理
    // const args = host.getArgs()
    // console.log({ args })

    // // event ack callback
    // if ('function' === typeof args[args.length - 1]) {
    //   const ACKCallback = args.pop()
    //   ACKCallback({ error: exception.message, exception })
    // }

    //     const client = host.switchToWs().getClient() as WebSocket;
    // const data = host.switchToWs().getData();
    // const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
    // const details = error instanceof Object ? { ...error } : { message: error };
    // client.send(JSON.stringify({
    //   event: "error",
    //   data: {
    //     id: (client as any).id,
    //     rid: data.rid,
    //     ...details
    //   }
    // }));
  }
}
