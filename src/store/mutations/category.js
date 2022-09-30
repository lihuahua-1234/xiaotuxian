// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合，依赖 topCategory 重新设置，保证初始化就有数据,不至于白屏
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 修改分类函数
  mutations: {
    // payload 载荷， 所有的分类集合
    setList (state, payload) {
      state.list = payload
      console.log('分类数据', payload)
    },
    // 定义show和hide函数，控制当前分类的二级分类显示或隐藏
    show (state, id) { // id 靠外面点击传进来 app-header-nav.vue
      // 找到当前对应的分类id
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  // 获取分类函数
  actions: {
    async getList ({ commit }) {
      // 获取分类数据
      const { result } = await findAllCategory()
      // console.log(result)
      // 给每个分类加上控制二级分类显示隐藏的数据
      // result.forEach(top => { // 写不写都行因为数据里面自带了open
      //   top.open = false
      // })
      // 获取数据成功，提交mutations进行数据修改
      // context.commit('setList')
      commit('setList', result)
    }
  }
}
