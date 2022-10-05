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
 * 提交收货地址
 * @param {Object} from - 参考接口文档
 */
export const addAddress = (from) => {
  return request('/member/address', 'POST', from)
}
