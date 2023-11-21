import CustomTable from '@/components/CustomTable'
import { bytesInstance } from '@mudssky/jsutils'
import { Systeminformation } from '@server/node_modules/systeminformation'
import { Progress, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
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
    // 驻留内存大小
    {
      title: 'memRss',
      dataIndex: 'memRss',
      key: 'memRss',
      width: 200,
      //   className: styles['table-cell'],
      sorter: (a, b) => a.memRss - b.memRss,
      render: (text) => {
        return <span>{bytesInstance.format(text * 1024)}</span>
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
      render: (text) => {
        //   memRss 单位是字节，所以这里转为b
        return <span>{bytesInstance.format(text * 1024)}</span>
      },
    },
  ]
  return (
    <div>
      <div className="">
        <CustomTable
          loading={query.isLoading}
          columns={columns}
          sortDirections={['descend', 'ascend']}
          dataSource={data?.list ?? []}
          rowKey={'pid'}
          //   virtual
          //   scroll={{
          //     y: 800,
          //   }}
          pagination={{
            // defaultPageSize: 50,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>
    </div>
  )
}
