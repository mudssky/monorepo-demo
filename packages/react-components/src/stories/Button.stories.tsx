import type { Meta, StoryObj } from '@storybook/react'

import { userEvent, within } from '@storybook/testing-library'
import { Button } from './Button'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
}

export const TryStory: Story = {
  args: {
    size: 'large',
    label: 'Try Button',
    backgroundColor: 'green',
  },
}

export const TryRenderStory: Story = {
  args: {
    size: 'large',
    label: 'Try Button',
    backgroundColor: 'green',
  },
  render(args) {
    return (
      <div>
        <button>aaaa</button>
        <Button {...args} />
        <button>bbb</button>
      </div>
    )
  },
  // 这个函数会在组件渲染完后执行
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = (await canvas.getByRole('button', {
      name: /Try/i,
    })) as HTMLButtonElement
    await userEvent.click(btn)

    btn.textContent = '东'
  },
}
