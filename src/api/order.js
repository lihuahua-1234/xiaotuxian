// 订单相关的API接口
import request from '@/utils/request'
// API接口 http://zhoushugang.gitee.io/erabbit-client-pc-document/api.html

// 结束页面 - 生成订单
export const createOrder = () => {
  return request('/member/order/pre', 'GET')
}
