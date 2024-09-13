/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string
  readonly VITE_PROXY_TARGET: string
  readonly VITE_WS_TARGET: string
  readonly VITE_SERVER_HOST: string

  readonly VITE_REQUEST_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
