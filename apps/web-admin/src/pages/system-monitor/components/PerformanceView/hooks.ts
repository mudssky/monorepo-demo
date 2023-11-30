import { getCurrentLoad, getMem } from '@/api/system-monitor'
import { useQuery } from '@tanstack/react-query'
const fetchInterval = 4000
export function useSetupHook() {
  const currentLoadQuery = useQuery({
    queryKey: ['/system-monitor/getCurrentLoad'],
    queryFn: getCurrentLoad,
    refetchInterval: fetchInterval,
  })

  const memQuery = useQuery({
    queryKey: ['/system-monitor/getMem'],
    queryFn: getMem,
    refetchInterval: fetchInterval,
  })
  return {
    currentLoadQuery,
    memQuery,
  }
}
