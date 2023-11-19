import { getProcesses } from '@/api/system-monitor'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export function useSetupHook() {
  const { t } = useTranslation()
  const query = useQuery({
    queryKey: ['/system-monitor/getProcesses'],
    queryFn: getProcesses,
    refetchInterval: 4000,
  })
  return {
    query,
    t,
  }
}
