import { getNewCartGoods } from '@/api/cart'

// 购物车模块
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      list: []
    }
  },
  // 类型于 computed 计算属性
  getters: {
    // 有效商品列表
    validList (state) {
      // 有效商品： stock 库存大于0, isEffective 商品有效标识为 true,
      // filter 过滤/筛选
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective === true)
    },

    // 有效商品总件数
    validTotal (state, getters) { // getters拿到 同级下的 getters 计算属性
      // reduce 累积求和
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },

    // 有效商品总金额
    validAmount (state, getters) { // getters拿到 同级下的 getters 计算属性
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return getters.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100) * c.count, 0) / 100
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
       * nowPrice     现价的价格
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
      if (sameIndex > -1) { // findIndex 索引从0开始的，所以大于-1说明有相同的sameIndex
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来商品
        state.list.splice(sameIndex, 1)
        // 追加新的商品
        state.list.unshift(payload)
      } else {
        // 没有相同商品添加商品的
        state.list.unshift(payload)
      }
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods 商品信息: nowPrice stock isEffective
      // goods 商品对象 必须有SKUID， 不然我不知道改谁
      // goods 商品对象的字段不固定, 对象中有那些字段就改那些字段. 字段的值合理才改
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) { // 遍历 goods传进来的字段，有多少字段就遍历多少个字段
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
          // console.log('updateGoods', updateGoods[key])
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },

  actions: {
    // 加入购物车
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) { // rootState 可以拿到vues下的文件数据
          // 已登录
        } else {
          // 未登录
          context.commit('insertCart', payload)
          resolve() // 代表 Promise 执行成功了
        }
      })
    },
    // 获取商品列表
    findCart (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 同时发送请求(有几件商品就发几个请求)， 等所有请求成功，一并去修改本地数据
          // promise.all(promise数组).then((dataList)=> {}) promise.all()该方法用于将多个Promise实例，包装成一个新的Promise实例。
          // promise.resolve(), promise.reject(), new promise()
          // promise.race(promise数组).then((data)=> {}), 这一也是一次送发送多个请求， 但他是拿请求最快的哪一个
          const promiseArr = context.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList成功结果的集合， 数据顺序和promiseArr顺序一致, 他又是根据state.list而来
          Promise.all(promiseArr).then(dataList => {
            console.log('dataList', dataList)
            // 更新本地购物车
            dataList.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            // 调用resolve代表操作成功
            resolve()
          })
        }
      })
    },
    // 删除购物车
    deleteCart (context, payload) {
      // 单条删除 payload 现在就是skuId
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          context.commit('deleteCart', payload)
          resolve()
        }
      })
    }
  }
}
