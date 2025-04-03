import { ChatSiliconFlow } from '@/ai/chat_models/siliconflow'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../../../ .env.local') })

async function main() {
  const chatModel = new ChatSiliconFlow({
    model: 'Pro/deepseek-ai/DeepSeek-V3',
  })

  const res = await chatModel.invoke('你好')
  console.log({ res })
}

main()
