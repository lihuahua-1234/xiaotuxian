// 订单相关的API接口
import request from '@/utils/request'
// API接口 http://zhoushugang.gitee.io/erabbit-client-pc-document/api.html

/**
 * 结束页面 - 生成订单
 * @returns
 */
export const createOrder = () => {
  return request('/member/order/pre', 'GET')
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
