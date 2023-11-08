import { WebLocalStorage } from '@mudssky/jsutils'

export type GlobalStorageKey = 'TOKEN'

export const GlobalStorage = new WebLocalStorage<GlobalStorageKey>()
