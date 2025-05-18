import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
// 自定义组件主题色
import '@/styles/element/index.scss'
// 全局样式
import '@/styles/theme.css'
import '@/assets/font/iconfont.css'
// 鉴权文件
import '../premission'

const app = createApp(App)
const pinia = createPinia()

// 注册icon图
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(pinia)
app.use(ElementPlus, { size: 'default', locale: zhCn })
app.mount('#app')
