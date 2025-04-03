import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class DingdingService {
  private readonly logger = new Logger(DingdingService.name)

  constructor(private readonly httpService: HttpService) {}

  /**
   * 通过钉钉webhook发送消息
   * @param webhookUrl 钉钉webhook地址
   * @param message 要发送的消息内容
   * @param atMobiles 需要@的手机号数组，可选
   * @param isAtAll 是否@所有人，默认false
   */
  async sendMessage(params: {
    webhookUrl: string
    message: string
    atMobiles?: string[]
    isAtAll?: boolean
    msgType?: 'text' | 'markdown'
    markdownTitle?: string // 新增markdown标题参数
  }): Promise<void> {
    const {
      webhookUrl,
      message,
      atMobiles,
      isAtAll = false,
      msgType = 'text',
      markdownTitle = 'Markdown消息', // 默认标题
    } = params
    try {
      const payload = {
        msgtype: msgType,
        [msgType]:
          msgType === 'text'
            ? {
                content: message,
              }
            : {
                title: markdownTitle, // 使用传入的markdown标题
                text: message,
              },
        at: {
          atMobiles,
          isAtAll,
        },
      }

      if (payload.msgtype === 'markdown' && payload.at) {
        this.logger.warn('markdown消息中不能使用at参数')
      }
      const response = await firstValueFrom(
        this.httpService.post(webhookUrl, payload),
      )

      if (response.data.errcode !== 0) {
        this.logger.error(`钉钉消息发送失败: ${response.data.errmsg}`)
        throw new Error(response.data.errmsg)
      }
      this.logger.log('钉钉消息发送成功', response.data, payload)
    } catch (error) {
      this.logger.error(`钉钉消息发送失败: ${error.message}`)
      throw error
    }
  }
}
