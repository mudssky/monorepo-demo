/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSyncExternalStore } from 'react'

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot)
  return isOnline
}

function getSnapshot() {
  return navigator.onLine
}

function subscribe(callback: any) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}
