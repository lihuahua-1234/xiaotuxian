import { getNewCartGoods, mergeCart } from '@/api/cart'

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
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(goods => goods.stock <= 0 || goods.isEffective === false)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected === true)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
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
      // console.log(sameIndex)
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
    },
    // 设置购物车
    setCart (state, payload) {
      // payload 为空数组, 就叫清空， 如果有值数组，就叫设置
      state.list = payload
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
            // console.log('dataList', dataList)
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
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 单条删除 payload 现在就是skuId
          context.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车(选择状态，数量)
    updateCart (context, payload) {
      // payload 需要: 必需有skuId 可能: selected count
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          context.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          context.getters.validList.forEach(goods => {
            context.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (context, isClear) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 找出选择的商品列表，遍历调用删除的 mutations
          // isClear 为 true 删除失效商品， 否则是选中的商品列表
          context.getters[isClear ? 'invalidList' : 'selectedList'].selectedList.forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 修改规格
    updataCartSku (context, { oldSkuid, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // find 遍历数组 查找满足条件的元素项
          // 1. 找出旧的商品信息
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuid)
          // 2. 删除旧的商品信息
          context.commit('deleteCart', oldSkuid)
          // 3. 根据新的 sku 信息和旧的商品信息
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          // 4. 新旧合拼成一条新的购物车信息数据
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          // 5. 添加新的商品
          context.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并购物车 一定是登录后的
    async mergeCart (context) {
      // 合并的参数
      const cartList = context.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      // 发请求
      await mergeCart(cartList)
      // 合并成功， 清空本地购物车
      context.commit('setCart', [])
    }

  }
}
