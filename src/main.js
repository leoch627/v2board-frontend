import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import './assets/styles/anime.css'
import './assets/styles/animations.css'

const app = createApp(App)
const pinia = createPinia()

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')

// 允许通过环境变量控制标题与 favicon
const { VITE_APP_TITLE, VITE_APP_FAVICON } = import.meta.env
if (VITE_APP_TITLE) {
  document.title = VITE_APP_TITLE
}
if (VITE_APP_FAVICON) {
  const existing = document.querySelector('link[rel="icon"]')
  if (existing) {
    existing.href = VITE_APP_FAVICON
  } else {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.href = VITE_APP_FAVICON
    document.head.appendChild(link)
  }
}
