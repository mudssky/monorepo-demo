import request from '@/request/request'
import { Systeminformation } from '@server/node_modules/systeminformation'

export async function getProcesses() {
  const { data } = await request.get<Systeminformation.ProcessesData>(
    '/system-monitor/getProcesses',
  )
  return data
}
