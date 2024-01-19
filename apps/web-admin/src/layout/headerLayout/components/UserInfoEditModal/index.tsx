import CustomUpload from '@/components/CusomSingleUpload'
import { Form, Input, Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { useSetupHook } from './hooks'

export interface Props extends ModalProps {}

export default function UserInfoEditModal(props: Props) {
  const { ...restProps } = props
  const { form, handleEditSubmit } = useSetupHook(props)

  return (
    <Modal title="用户资料编辑" {...restProps} onOk={handleEditSubmit}>
      <Form form={form}>
        <Form.Item label="头像" name={'avatarInfo'}>
          <CustomUpload
            listType="picture-circle"
            showUploadList={false}
            // customRequest={}
          ></CustomUpload>
        </Form.Item>
        <Form.Item label="用户名" name={'name'}>
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}
