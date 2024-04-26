import { Portal } from '@mudssky/react-components'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Portal',
  component: Portal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // value: {
    //   //   control: 'date',
    // },
  },
} satisfies Meta<typeof Portal>

type Story = StoryObj<typeof meta>
export default meta

export const Primary: Story = {
  args: {
    children: 'ssd',
  },
  render(args) {
    return (
      <Portal {...args}>
        <button>点我</button>
      </Portal>
    )
  },
}
