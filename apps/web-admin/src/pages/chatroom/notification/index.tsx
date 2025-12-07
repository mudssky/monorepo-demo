import { Avatar, message, Tabs, TabsProps } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import {
  ACCEPT_FRIEND_REQUEST,
  FriendReuqestListRes,
  FromUser,
  GET_FRIEND_REQUEST_LIST,
  REJECT_FRIEND_REQUEST,
  ToUser,
} from '@/api'
import AsyncButton from '@/components/AsyncButton'

function UserAvatar(props: { user: ToUser | FromUser }) {
  const { user } = props
  if (user.avatarUrl) {
    return <Avatar src={user.avatarUrl}></Avatar>
  }
  return <Avatar>{user.name}</Avatar>
}
enum FriendRequestStatus {
  Pending = 10,
  Accepted = 20,
  Declined = 30,
}

export function NotificationPage() {
  const [fromMe, setFromMe] = useState<FriendReuqestListRes['fromMe']>([])
  const [toMe, setToMe] = useState<FriendReuqestListRes['toMe']>([])
  const onChange = (key: string) => {
    console.log(key)
  }

  async function queryFriendRequestList() {
    const res = await GET_FRIEND_REQUEST_LIST()

    if (res.code === 0) {
      setFromMe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.data.fromMe.map((item: any) => {
          return {
            ...item,
            key: item.id,
          }
        }),
      )
      setToMe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.data.toMe.map((item: any) => {
          return {
            ...item,
            key: item.id,
          }
        }),
      )
    } else {
      message.error(res.msg)
    }
  }

  async function acceptFriendRequest(id: string) {
    const res = await ACCEPT_FRIEND_REQUEST(id)
    if (res.code === 0) {
      message.success('操作成功')
      await queryFriendRequestList()
    } else {
      message.error(res.msg)
    }
  }

  async function rejectFriendRequest(id: string) {
    const res = await REJECT_FRIEND_REQUEST(id)
    if (res.code === 0) {
      message.success('操作成功')
      await queryFriendRequestList()
    } else {
      message.error(res.msg)
    }
  }
  const toMeColumns: ColumnsType<FriendReuqestListRes['toMe'][number]> = [
    {
      title: '用户',
      render: (_, record) => {
        return (
          <div>
            <UserAvatar user={record.fromUser!} />
            {' ' + record.fromUser?.nickName + ' 请求加你为好友'}
          </div>
        )
      },
    },
    {
      title: '理由',
      dataIndex: 'reason',
    },
    {
      title: '请求时间',
      render: (_, record) => {
        return new Date(record.createTime ?? '').toLocaleString()
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        if (record.status === FriendRequestStatus.Accepted) {
          return '已通过'
        }
        if (record.status === FriendRequestStatus.Declined) {
          return '已拒绝'
        }
        return (
          <div>
            <AsyncButton
              type="link"
              onClick={async () => {
                await acceptFriendRequest(record.fromUserId!)
              }}
            >
              同意
            </AsyncButton>
            <br />
            <AsyncButton
              type="link"
              onClick={async () => {
                await rejectFriendRequest(record.fromUserId!)
              }}
            >
              拒绝
            </AsyncButton>
          </div>
        )
      },
    },
  ]

  const fromMeColumns: ColumnsType<FriendReuqestListRes['fromMe'][number]> = [
    {
      title: '用户',
      render: (_, record) => {
        return (
          <div>
            {' 请求添加好友 ' + record.toUser.nickName}
            <UserAvatar user={record.toUser!} />
          </div>
        )
      },
    },
    {
      title: '理由',
      dataIndex: 'reason',
    },
    {
      title: '请求时间',
      render: (_, record) => {
        return new Date(record.createTime).toLocaleString()
      },
    },
    {
      title: '状态',
      render: (_, record) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map: Record<string, any> = {
          0: '申请中',
          1: '已通过',
          2: '已拒绝',
        }
        return <div>{map[record.status]}</div>
      },
    },
  ]

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '我发出的',
      children: (
        <div style={{ width: 1000 }}>
          <Table
            columns={toMeColumns}
            dataSource={toMe}
            style={{ width: '1000px' }}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: '我发出的',
      children: (
        <div style={{ width: 1000 }}>
          <Table
            columns={fromMeColumns}
            dataSource={fromMe}
            style={{ width: '1000px' }}
          />
        </div>
      ),
    },
  ]
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    queryFriendRequestList()

    return () => {}
  }, [])

  return (
    <div id="notification-container">
      <div className="notification-list">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  )
}
