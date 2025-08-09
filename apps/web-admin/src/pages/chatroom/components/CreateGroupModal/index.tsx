import { CREATE_GROUP_CHATROOM } from '@/api'
import { Form, Input, Modal, ModalProps, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { SyntheticEvent } from 'react'

interface CreateGroupModalProps extends ModalProps {
  onClose?: (e?: SyntheticEvent<Element, Event>) => void
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export interface GroupGroup {
  name: string
}

export function CreateGroupModal(props: CreateGroupModalProps) {
  const { open } = props
  const [form] = useForm<GroupGroup>()

  const handleOk = async function (e: SyntheticEvent<Element, Event>) {
    const values = await form.validateFields()
    const res = await CREATE_GROUP_CHATROOM({ roomName: values.name })

    if (res.code === 0) {
      message.success('群聊创建成功过')
      form.resetFields()
      props?.onClose?.(e)
    } else {
      message.error(res.msg)
    }
  }

  return (
    <Modal
      title="创建群聊"
      open={open}
      onOk={handleOk}
      onCancel={props?.onClose}
      okText={'创建'}
      cancelText={'取消'}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="群聊名称"
          name="name"
          rules={[{ required: true, message: '请输入群聊名称!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
