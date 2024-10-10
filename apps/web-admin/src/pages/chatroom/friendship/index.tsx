import {
  FriendshipListRes,
  GET_FRIENDSHIP_LIST,
} from '@/api/chatroom/friendship'
import { Avatar, Button, Form, Input, message, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'

interface SearchFriend {
  nickName: string
}

export function FriendshipPage() {
  const [friendshipResult, setFriendshipResult] = useState<
    Array<FriendshipListRes>
  >([])

  const columns: ColumnsType<FriendshipListRes> = useMemo(
    () => [
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '头像',
        dataIndex: 'headPic',
        render: (_, record) => {
          if (record.avatarUrl) {
            return <Avatar src={record.avatarUrl}></Avatar>
          }
          return <Avatar>{record.nickName}</Avatar>
        },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
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

  const searchFriend = async (values: SearchFriend) => {
    const res = await GET_FRIENDSHIP_LIST({
      nickName: values.nickName,
    })
    if (res.code === 0) {
      setFriendshipResult(res.data)
    } else {
      message.error(res.msg)
    }
  }

  const [form] = Form.useForm<SearchFriend>()

  useEffect(() => {
    searchFriend({
      nickName: form.getFieldValue('nickName'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-[10px]">
      <div className="friendship-form">
        <Form
          form={form}
          onFinish={searchFriend}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="昵称" name="nickName">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="pt-[10px]">
        <Table
          columns={columns}
          dataSource={friendshipResult}
          style={{ width: '1000px' }}
        />
      </div>
    </div>
  )
}
