// import { Props } from '.'
import { useLocation } from 'react-router-dom'
export function useSetupHook() {
  const { pathname } = useLocation()

  return {
    pathname,
  }
}
