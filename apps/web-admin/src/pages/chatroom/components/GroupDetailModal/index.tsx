import { GET_GROUP_MENMBERS, MemberRes } from '@/api'
import { message, Modal, ModalProps, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

export interface MembersModalProps extends ModalProps {
  chatroomId: string
}

export function GroupDetailModal(props: MembersModalProps) {
  const { chatroomId, ...restProps } = props
  const [members, setMembers] = useState<Array<MemberRes>>()

  const queryMembers = async () => {
    try {
      const res = await GET_GROUP_MENMBERS({ chatroomId: props.chatroomId })

      if (res.code === 0) {
        setMembers(
          res.data.map((item) => {
            return {
              ...item,
              key: item.id,
            }
          }),
        )
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }

  useEffect(() => {
    queryMembers()
  }, [chatroomId])

  const columns: ColumnsType<MemberRes> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '头像',
      dataIndex: 'headPic',
      render: (_, record) => (
        <div>
          <img src={record.avatarUrl} width={50} height={50} />
        </div>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
  ]

  return (
    <Modal title="群聊成员" width={1000} {...restProps}>
      <Table columns={columns} dataSource={members} pagination={false} />
    </Modal>
  )
}
