import CustomUpload from '@/components/CusomSingleUpload'
import { Form, Input, Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { useSetupHook } from './hooks'

export interface Props extends ModalProps {
  onSubmitFinish: () => void
}

export default function UserInfoEditModal(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSubmitFinish, ...restProps } = props
  const { isConfirmLoading, form, handleEditSubmit } = useSetupHook(props)

  return (
    <Modal
      title="用户资料编辑"
      {...restProps}
      onOk={handleEditSubmit}
      confirmLoading={isConfirmLoading}
    >
      <Form form={form}>
        <Form.Item label="头像" name={'avatarInfo'}>
          <CustomUpload
            listType="picture-circle"
            showUploadList={false}
            ossPrefix="avatar"
            // customRequest={}
          ></CustomUpload>
        </Form.Item>
        <Form.Item
          label="用户名"
          name={'name'}
          rules={[
            {
              required: true,
              whitespace: true,
            },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item label="昵称" name={'nickName'}>
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}
