import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

// 三个模块
import cart from './mutations/cart'
import category from './mutations/category'
import user from './mutations/user'

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  // 配置插件
  plugins: [
    // 默认存储在localStorage上
    createPersistedstate({
    // 本地存储名字
      key: 'erabbit-client-pc',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })]
})

// vue2.0 创建仓库 new Vuex.Store({})
// vue3.0 创建仓库 createStore({})
// export default createStore({
//   // 存状态
//   state: {
//   },
//   // 写计算属性
//   getters: {
//   },
//   // 修改方法
//   mutations: {
//   },
//   // 拿数据
//   actions: {
//   },
//   // 分模块
//   modules: {
//   }
// })
