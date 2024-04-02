import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'

const app = createApp(App)
for (let i in Icons) {
    app.component(i, Icons[i])
}
app.use(router).use(ElementPlus,{ locale: zhCn})
app.config.globalProperties.$systemName = '后台管理系统'
app.mount('#app')