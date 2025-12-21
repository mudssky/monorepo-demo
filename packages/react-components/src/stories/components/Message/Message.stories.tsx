import { MessageProvider, MessageRef } from '@mudssky/react-components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'

const meta = {
  title: 'MessageProvider',
  component: MessageProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // value: {
    //   //   control: 'date',
    // },
  },
} satisfies Meta<typeof MessageProvider>

type Story = StoryObj<typeof meta>
export default meta

export const Primary: Story = {
  args: {
    // content: '水印',
    // content: ['测试水印', '哦哦'],
  },
  render(args) {
    const messageRef = useRef<MessageRef>(null)
    return (
      <div>
        <button
          onClick={() => {
            messageRef.current?.add({
              content: '请求成功',
              duration: 2000,
            })
          }}
        >
          成功
        </button>
        <MessageProvider ref={messageRef} {...args}></MessageProvider>
      </div>
    )
  },
}
