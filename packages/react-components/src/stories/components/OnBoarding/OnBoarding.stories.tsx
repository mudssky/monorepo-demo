/* eslint-disable @typescript-eslint/no-unused-vars */
import { OnBoarding } from '@mudssky/react-components'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'OnBoarding',
  component: OnBoarding,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // value: {
    //   //   control: 'date',
    // },
  },
} satisfies Meta<typeof OnBoarding>

type Story = StoryObj<typeof meta>
export default meta

export const Primary: Story = {
  args: {
    steps: [],
  },
  render() {
    return (
      <div className="App">
        <div id="btn-group1">
          <button>测试</button>
          <button>测试2</button>
          <button>测试3</button>
        </div>
        <div id="btn-group2">
          <button>测试4</button>
          <button>测试5</button>
          <button>测试6</button>
        </div>

        <OnBoarding
          steps={[
            {
              selector: () => {
                return document.getElementById('btn-group1')
              },
              renderContent: () => {
                return '测试1'
              },
              placement: 'bottom',
            },
            {
              selector: () => {
                return document.getElementById('btn-group2')
              },
              renderContent: () => {
                return '测试2'
              },
              placement: 'bottom',
            },
          ]}
        />
      </div>
    )
  },
}
