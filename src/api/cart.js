// 封装购物车相关的api函数
import request from '@/utils/request'
// API接口 http://zhoushugang.gitee.io/erabbit-client-pc-document/api.html

/**
 * 获取商品的 最新价格 库存 是否有效
 * @param {String} skuId - SKU id
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'GET')
}

/**
 * 获取商品对应的sku
 * @param {String} skuId - SKU id
 */
export const getGoodsSKU = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'GET')
}

/**
 * 合并购物车
 * @param {array<object>} cartList - 购物车信息列表
 * @param {String} objject.skuId - skuId
 * @param {String} objject.boolean - 选中状态
 * @param {String} objject.count - 数量
 */
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'POST', cartList)
}

/**
 * 获取购物车列表
 */
export const findCart = () => {
  return request('/member/cart', 'GET')
}

/**
 * 加入购物车
 * @param {String}  skuId - SKUID
 * @param {Imteger}  count - 数量
 * @returns
 */
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'POST', { skuId, count })
}

/**
 * 删除商品（支持批量删除）
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
export const deleteCart = (ids) => {
  return request('/member/cart', 'DELETE', { ids })
}

/**
 * 修改购物车商品(状态，数量)
 * @param {String} skuId - SKUID
 * @param {Imteger} count - 加入购物车数量
 * @param {String} objject.boolean - 选中状态
 */
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'PUT', { selected, count })
}

/**
 * 全部选中或者取消全选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - skuId集合
 */
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'PUT', { selected, ids })
}
