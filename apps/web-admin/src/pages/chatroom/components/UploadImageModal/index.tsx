import { Form, Modal, ModalProps } from 'antd'

import CustomUpload from '@/components/CusomSingleUpload'

interface UploadImageModalProps extends ModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOk: (item: any) => void
}

export function UploadImageModal(props: UploadImageModalProps) {
  const { handleOk, ...restProps } = props
  const [form] = Form.useForm()
  async function handleOkInner() {
    const formValues = await form.validateFields()
    handleOk?.(formValues)
  }
  return (
    <Modal
      title="上传图片"
      onOk={handleOkInner}
      okText={'确认'}
      cancelText={'取消'}
      {...restProps}
    >
      <Form form={form}>
        <Form.Item name="image">
          <CustomUpload
            listType="picture"
            showUploadList={false}
            ossPrefix="chatroom"
          ></CustomUpload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
