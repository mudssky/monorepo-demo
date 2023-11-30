import request from '@/request/request'
import { Systeminformation } from '@server/node_modules/systeminformation'

export async function getProcesses() {
  const { data } = await request.get<Systeminformation.ProcessesData>(
    '/system-monitor/getProcesses',
  )
  return data
}

export async function getCpu() {
  const { data } = await request.get<Systeminformation.CpuData>(
    '/system-monitor/getCpu',
  )
  return data
}

export async function getCurrentLoad() {
  const { data } = await request.get<Systeminformation.CurrentLoadData>(
    '/system-monitor/getCurrentLoad',
  )
  return data
}

export async function getMem() {
  const { data } = await request.get<Systeminformation.MemData>(
    '/system-monitor/getMem',
  )
  return data
}
