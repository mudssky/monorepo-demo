import { ChatRoomListResDto, GET_CHATROOM_LIST } from '@/api'
import { Button, Form, Input, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { CreateGroupModal } from '../components/CreateGroupModal'

interface SearchGroup {
  name: string
}

export function GroupPage() {
  const [groupResult, setGroupResult] = useState<Array<ChatRoomListResDto>>([])
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false)
  const columns: ColumnsType<ChatRoomListResDto> = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
      },
      {
        title: '操作',
        render: () => (
          <div>
            <a href="#">聊天</a>
          </div>
        ),
      },
    ],
    [],
  )

  const searchGroup = async (values: SearchGroup) => {
    const res = await GET_CHATROOM_LIST({ roomName: values.name })

    if (res.code === 0) {
      setGroupResult(
        res.data.map((item) => {
          return {
            ...item,
            key: item.id,
          }
        }),
      )
    }
  }

  const [form] = useForm()

  useEffect(() => {
    searchGroup({
      name: form.getFieldValue('name'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-[10px]">
      <div className="group-form">
        <Form
          form={form}
          onFinish={searchGroup}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item label=" ">
            <Button
              type="primary"
              style={{ background: 'green' }}
              onClick={() => setCreateGroupModalOpen(true)}
            >
              创建群聊
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="pt-[10px]">
        <Table
          columns={columns}
          dataSource={groupResult}
          style={{ width: '1000px' }}
        />
      </div>
      <CreateGroupModal
        open={isCreateGroupModalOpen}
        onClose={() => {
          setCreateGroupModalOpen(false)
          searchGroup({
            name: form.getFieldValue('name'),
          })
        }}
      />
    </div>
  )
}
