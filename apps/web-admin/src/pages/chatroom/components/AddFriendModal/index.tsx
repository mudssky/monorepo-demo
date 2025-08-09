import { SEND_FRIEND_REQUEST } from '@/api'
import { Form, Input, message, Modal, ModalProps } from 'antd'
import { useForm } from 'antd/es/form/Form'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AddFriendModalProps extends ModalProps {}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export interface AddFriend {
  username: string
  reason: string
}

export function AddFriendModal(props: AddFriendModalProps) {
  const [form] = useForm<AddFriend>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk = async function (e: any) {
    const formValues = await form.validateFields()

    const res = await SEND_FRIEND_REQUEST({
      ...formValues,
    })
    if (res.code === 0) {
      message.success('好友申请已发送')
      form.resetFields()
      props?.onCancel?.(e)
    } else {
      message.error(res.msg)
    }
  }

  return (
    <Modal
      title="添加好友"
      open={props.open}
      onOk={handleOk}
      onCancel={props.onCancel}
      okText={'发送好友请求'}
      cancelText={'取消'}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="添加理由"
          name="reason"
          rules={[{ required: true, message: '请输入添加理由!' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}
