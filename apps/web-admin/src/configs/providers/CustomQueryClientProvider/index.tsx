import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface Props {
  children: React.ReactNode
}

const queryClient = new QueryClient()
export default function CustomQueryClientProvider(props: Props) {
  const { children } = props
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 开发工具配置 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
