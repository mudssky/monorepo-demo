import Watermark from '@/components/Watermark'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Watermark',
  component: Watermark,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // value: {
    //   //   control: 'date',
    // },
  },
} satisfies Meta<typeof Watermark>

type Story = StoryObj<typeof meta>
export default meta

export const Primary: Story = {
  args: {
    // content: '水印',

    content: ['测试水印', '哦哦'],
  },
  render(args) {
    return (
      <Watermark {...args}>
        <div style={{ height: 800 }}>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
            deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
            recusandae minus, eaque, harum exercitationem esse sapiente?
            Eveniet, id provident!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
            deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
            recusandae minus, eaque, harum exercitationem esse sapiente?
            Eveniet, id provident!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
            deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
            recusandae minus, eaque, harum exercitationem esse sapiente?
            Eveniet, id provident!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
            deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
            recusandae minus, eaque, harum exercitationem esse sapiente?
            Eveniet, id provident!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
            deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
            recusandae minus, eaque, harum exercitationem esse sapiente?
            Eveniet, id provident!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
            deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
            recusandae minus, eaque, harum exercitationem esse sapiente?
            Eveniet, id provident!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
            deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
            recusandae minus, eaque, harum exercitationem esse sapiente?
            Eveniet, id provident!
          </p>
        </div>
      </Watermark>
    )
  },
}
