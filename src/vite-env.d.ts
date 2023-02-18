/// <reference types="vite/client" />
/// <reference types="webrtc" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
