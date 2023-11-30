import { calcPercent, percentColor } from '@/utils/calc'
import { Card, Col, Row, Statistic } from 'antd'
import { useSetupHook } from './hooks'

export default function PerformanceView() {
  const { currentLoadQuery, memQuery } = useSetupHook()
  const { data: memData } = memQuery
  const memPercent = calcPercent(memData?.used, memData?.total)
  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="CPU占用"
              value={currentLoadQuery.data?.currentLoad}
              precision={2}
              valueStyle={{
                color: percentColor(currentLoadQuery.data?.currentLoad ?? 0),
              }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="内存占用"
              value={memPercent}
              precision={2}
              valueStyle={{ color: percentColor(memPercent) }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
