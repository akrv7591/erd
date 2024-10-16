/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_LOG_TO_ENDPOINT: string
  readonly VITE_LOG_TO_APP_ID: string
  readonly VITE_ORGANIZATION_ID: string
  readonly VITE_SERVER_URL: string
  readonly VITE_WEBRTC_SIGNALLING_SERVER: string
  readonly VITE_CLIENT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
