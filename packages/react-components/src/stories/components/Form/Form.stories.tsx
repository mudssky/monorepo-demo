/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, FormRefApi } from '@mudssky/react-components'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Checkbox, Input } from 'antd'
import { useRef } from 'react'

const meta = {
  title: 'Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // value: {
    //   //   control: 'date',
    // },
  },
} satisfies Meta<typeof Form>

type Story = StoryObj<typeof meta>
export default meta

export const Primary: Story = {
  args: {},
  render(_args) {
    const onFinish = (values: any) => {
      console.log('Success:', values)
    }

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo)
    }

    const form = useRef<FormRefApi>(null)

    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            console.log(form.current?.getFieldsValue())
          }}
        >
          打印表单值
        </Button>

        <Button
          type="primary"
          onClick={() => {
            form.current?.setFieldsValue({
              username: 'slklll',
            })
          }}
        >
          设置表单值
        </Button>

        <Form
          ref={form}
          initialValues={{ remember: true, username: '测试用户名' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { max: 6, message: '长度不能大于 6' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item>
            <div>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </div>
          </Form.Item>
        </Form>
      </>
    )
  },
}
