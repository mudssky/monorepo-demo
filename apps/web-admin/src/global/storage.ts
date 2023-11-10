import { WebLocalStorage } from '@mudssky/jsutils'

export type GlobalStorageKey = 'TOKEN'

/**
 * 开启缓存后，会先从内存加载数据，可以提高一点性能
 */
export const GlobalStorage = new WebLocalStorage<GlobalStorageKey>({
  enableCahce: true,
})
