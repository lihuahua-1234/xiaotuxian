// 用户相关的接口
// http://zhoushugang.gitee.io/erabbit-client-pc-document/api.html
import request from '@/utils/request'

/**
 * 账号密码登录
 * @param {String} account - 账号
 * @returns promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'POST', { account, password })
}

/**
 * 获取手机号短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'GET', { mobile })
}

/**
 * 手机号登录
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码 默认是123456
 * @returns promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'POST', { mobile, code })
}
