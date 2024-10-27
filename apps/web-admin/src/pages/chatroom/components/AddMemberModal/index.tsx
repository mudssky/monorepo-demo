import { JOIN_ROOM } from '@/api'
import { Form, Input, Modal, ModalProps, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { SyntheticEvent } from 'react'

interface AddMemberModalProps extends ModalProps {
  chatroomId: string
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export interface AddMember {
  username: string
}

export function AddMemberModal(props: AddMemberModalProps) {
  const { chatroomId, ...restProps } = props
  const [form] = useForm<AddMember>()

  const handleOk = async function (e: SyntheticEvent<Element, Event>) {
    await form.validateFields()

    const values = form.getFieldsValue()

    try {
      const res = await JOIN_ROOM({ name: values.username, chatroomId })

      if (res.code === 0) {
        message.success('成员添加成功')
        form.resetFields()
        props?.onClose?.(e)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }

  return (
    <Modal
      title="添加成员"
      okText={'添加'}
      cancelText={'取消'}
      onOk={handleOk}
      {...restProps}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
