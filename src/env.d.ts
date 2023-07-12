/// <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_URL: string
  readonly VITE_SIEBEL_GATEWAY_URL: string
  readonly VITE_SIEBEL_WORKSPACE: string
  readonly VITE_APP_REQUEST_TIMEOUT: string
  readonly VITE_APP_VIRTUAL_SESSION_LIFETIME: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VER__: string
declare const __APP_MODE__: string
declare const __APP_ENV__: string
declare const __APP_DATE_BUILD__: string
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
