import { Form, Input, Modal, Upload } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { useSetupHook } from './hooks'

export interface Props extends ModalProps {}

export default function UserInfoEditModal(props: Props) {
  const { ...restProps } = props
  const { form } = useSetupHook(props)

  return (
    <Modal title="用户资料编辑" {...restProps}>
      <Form form={form}>
        <Form.Item label="头像" name={'avatar'}>
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
          ></Upload>
        </Form.Item>
        <Form.Item label="用户名" name={'name'}>
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}
