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
