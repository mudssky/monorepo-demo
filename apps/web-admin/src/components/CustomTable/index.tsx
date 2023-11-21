import { Table, TableProps } from 'antd'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props<RecordType> extends TableProps<RecordType> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CustomTable<RecordType extends object = any>(
  props: Props<RecordType>,
) {
  return (
    <Table
      {...props}
      pagination={{
        showTotal: (total) => `Total ${total} items`,
        ...props.pagination,
      }}
    ></Table>
  )
}
