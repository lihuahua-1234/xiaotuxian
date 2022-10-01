// 购物车模块
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      list: []
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 约定加入购物车字段 必须和后端保持一致 payload对象 的字段
      /** payload字段:
       * id           商品名称id
       * skuId        商品规格SKUID
       * name         商品名称
       * attrsText    属性文字，例如“颜色:瓷白色 尺寸：8寸”
       * picture      商品图片
       * price        加入时价格
       * nowPrice     当前的价格
       * selected     是否选中
       * stock        库存
       * count        数量
       * isEffective  是否为有效商品
      */
      // 插入数据规则:
      // 1. 先找下是否有相同商品
      // 2. 如果有相同的商品, 查询它的数量,累加到payload上，再保存最新位置, 原来的商品需要删除
      // 3. 如果没有相同商品, 保存在最新位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) { // find 索引从0开始的，所以大于-1说明有相同的sameIndex
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来商品
        state.list.splice(sameIndex, 1)
        // 追加新的商品
        state.list.unshift(payload)
      } else {
        // 没有相同商品的
        state.list.unshift(payload)
      }
    }
  },
  actions: {
    // 加入购物车
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          context.commit('insertCart', payload)
          resolve() // 代表 Promise 执行成功了
        }
      })
    }
  }
}
