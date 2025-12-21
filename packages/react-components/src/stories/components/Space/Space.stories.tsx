import { Space } from '@mudssky/react-components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import './styles.scss'

const meta = {
  title: 'Space',
  component: Space,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // value: {
    //   //   control: 'date',
    // },
  },
} satisfies Meta<typeof Space>

type Story = StoryObj<typeof meta>
export default meta

export const Primary: Story = {
  args: {
    // children: [<div>111</div>, <div>222</div>, <div>333</div>],
    direction: 'horizontal',
    align: 'end',
    wrap: true,
    size: ['large', 'small'],
    className: 'container',
  },
  render(args) {
    return (
      <Space {...args}>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    )
  },
}
