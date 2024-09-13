import React from 'react'
import { useLocation } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeURLSearchParams<T = Record<string, any>> = Omit<
  URLSearchParams,
  'get'
> & {
  get: <K extends keyof T>(key: K) => T[K]
}
export function useQuery<T extends Record<string, string | null>>() {
  const { search } = useLocation()
  return React.useMemo(
    () => new URLSearchParams(search),
    [search],
  ) as TypeURLSearchParams<T>
}
