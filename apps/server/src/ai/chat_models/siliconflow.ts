import {
  BaseChatModel,
  BaseChatModelCallOptions,
  BaseChatModelParams,
} from '@langchain/core/language_models/chat_models'
import { AIMessageChunk, BaseMessage } from '@langchain/core/messages'
import { ChatResult } from '@langchain/core/outputs'

export interface ChatSiliconFlowOptions extends BaseChatModelCallOptions {
  // Some required or optional inner args
  tools?: Record<string, any>[]
}
export interface ChatSiliconFlowParams extends BaseChatModelParams {
  apiKey?: string
  model: string
  temperature?: number
  maxTokens?: number
  [key: string]: any
}

export class ChatSiliconFlow extends BaseChatModel<ChatSiliconFlowOptions> {
  private apiKey?: string
  private model: string
  private temperature?: number
  private maxTokens?: number
  private options?: ChatSiliconFlowParams

  constructor(params: ChatSiliconFlowParams) {
    super(params)
    this.apiKey = params.apiKey || process.env.SILICONFLOW_API_KEY
    this.model = params.model || 'siliconflow-latest'
    this.temperature = params.temperature
    this.maxTokens = params.maxTokens
    this.options = params
  }

  async _generate(
    messages: BaseMessage[],
    options?: this['ParsedCallOptions'],
  ): Promise<ChatResult> {
    void options
    const formattedMessages = messages.map((msg) => ({
      role: this._mapMessageType(msg.getType()),
      content: msg.content,
    }))
    const response = await fetch(
      'https://api.siliconflow.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          ...this.options,
          model: this.model,
          messages: formattedMessages,
        }),
      },
    )

    if (!response.ok) {
      const resText = await response.text()
      throw new Error(
        `API request failed with status ${response.status}, ${resText}} `,
      )
    }
    const data: any = await response.json()
    const content = data?.choices?.[0]?.message?.content
    return {
      generations: [
        {
          text: content,
          message: new AIMessageChunk(content),
        },
      ],
    }
  }

  private _mapMessageType(langchainType: string): string {
    const typeMap = {
      human: 'user',
      ai: 'assistant',
      system: 'system',
    }
    return typeMap[langchainType] || 'user'
  }

  _llmType() {
    return 'siliconflow-chat'
  }

  _modelType() {
    return 'siliconflow'
  }
}
