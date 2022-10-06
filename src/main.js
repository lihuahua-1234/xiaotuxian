import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Base64 from 'js-base64'

// 导入自己的UI组件库
import UI from '@/components/library'

// 1. 重置样式的库
import 'normalize.css'
// 2. 自己项目的重置样式和公用样式
import '@/assets/styles/common.less'

// 3. 模拟mock数据
import '@/mock'

createApp(App).use(store).use(router).use(UI).use(Base64).mount('#app')
