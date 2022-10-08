// 订单相关的API接口
import request from '@/utils/request'
// API接口 http://zhoushugang.gitee.io/erabbit-client-pc-document/api.html

/**
 * 结束页面 - 生成订单 - 根据购物车选择商品
 * @returns
 */
export const createOrder = () => {
  return request('/member/order/pre', 'GET')
}

/**
 * 结束页面 - 生成订单 - 根据订单中商品-再次购买
 * @returns
 */
export const repurchaseOrder = (orderId) => {
  return request(`/member/order/repurchase/${orderId}`, 'GET')
}

/**
 * 添加收货地址
 * @param {Object} from - 参考接口文档
 */
export const addAddress = (from) => {
  return request('/member/address', 'POST', from)
}

/**
 * 修改收货地址
 * @param {Object} from - 参考接口文档
 */
export const editAddress = (from) => {
  return request(`/member/address/${from.id}`, 'PUT', from)
}

/**
 * 结束页面 - 提交订单
 * @param {Object} params - 参考接口文档
 */
export const submitOrder = (params) => {
  return request('/member/order', 'POST', params)
}

/**
 * 获取订单详情
 * @param {String} orderId - 订单Id
 * @returns
 */
export const findOrderDetial = (orderId) => {
  return request(`/member/order/${orderId}`, 'GET')
}

/**
 * 获取订单列表
 * @param {String} page - 页码
 * @param {String} pageSize - 每页条数
 * @param {String} orderState - 订单状态 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @returns
 */
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request('/member/order', 'GET', { page, pageSize, orderState })
}

/**
 * 取下订单
 * @param {String} orderId - 订单Id
 * @param {String} cancelReason - 取消原因
 * @returns
 */
export const CancelOrder = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, 'PUT', { cancelReason })
}

/**
 * 删除订单
 * @param {Array<string>} ids - 删除订单，id集合
 * @returns
 */
export const delteOrder = (orderId) => {
  return request('/member/order', 'DELETE', { ids: [orderId] })
}

/**
 * 确认收货
 * @param {string} orderId - 确认收货
 * @returns
 */
export const confirmOrder = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, 'PUT')
}

/**
 * 查看物流
 * @param {string} orderId - 订单Id
 * @returns
 */
export const logosticsOrder = (orderId) => {
  return request(`/member/order/${orderId}/logistics`, 'GET')
}
