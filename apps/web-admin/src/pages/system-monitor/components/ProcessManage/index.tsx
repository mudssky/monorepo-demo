import { bytesInstance } from '@mudssky/jsutils'
import { Systeminformation } from '@server/node_modules/systeminformation'
import { Progress, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useSetupHook } from './hooks'

const percentFormater = (percent?: number) => percent?.toFixed(1) + '%'
const progressSize = [100, 10] as [number, number]

export default function ProcessManage() {
  const { query, t } = useSetupHook()

  const { data } = query
  const columns: ColumnsType<Systeminformation.ProcessesProcessData> = [
    {
      title: t('Process Name'),
      dataIndex: 'name',
      key: 'name',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      sorter: (a, b) => a.cpu - b.cpu,
      //   defaultSortOrder: 'descend',
      width: 200,
      render: (text) => {
        return (
          <Space>
            <Progress
              percent={text}
              format={percentFormater}
              size={progressSize}
            ></Progress>
          </Space>
        )
      },
    },
    {
      title: 'mem',
      dataIndex: 'mem',
      key: 'mem',
      width: 200,
      //   className: styles['table-cell'],
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.mem - b.mem,
      render: (text, record) => {
        return (
          <Space>
            <Progress
              percent={text}
              format={percentFormater}
              size={progressSize}
            ></Progress>
            {/* <span>
              {bytesInstance.format((record.memRss + record.memVsz) * 1000)}
            </span> */}
          </Space>
        )
      },
    },
    // 驻留内存大小
    {
      title: 'memRss',
      dataIndex: 'memRss',
      key: 'memRss',
      width: 200,
      //   className: styles['table-cell'],
      sorter: (a, b) => a.memRss - b.memRss,
      render: (text, record) => {
        return <span>{bytesInstance.format(record.memRss * 1024)}</span>
      },
    },
    // 虚拟内存大小
    {
      title: 'memVsz',
      dataIndex: 'memVsz',
      key: 'memVsz',
      width: 200,
      //   className: styles['table-cell'],
      sorter: (a, b) => a.memVsz - b.memVsz,
      render: (text, record) => {
        //   memRss 单位是字节，所以这里转为b
        return <span>{bytesInstance.format(record.memVsz * 1024)}</span>
      },
    },
  ]
  return (
    <div>
      <div>进程管理</div>

      <div>{data?.all}</div>

      <div className="">
        <Table
          loading={query.isLoading}
          columns={columns}
          sortDirections={['descend', 'ascend']}
          dataSource={data?.list ?? []}
          rowKey={'pid'}
          //   virtual
          //   scroll={{
          //     y: 800,
          //   }}
          //   pagination={{
          //     defaultPageSize: 50,
          //   }}
        />
      </div>
    </div>
  )
}
