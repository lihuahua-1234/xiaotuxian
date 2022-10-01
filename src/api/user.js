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

/**
 * QQ登录
 * @param {String} unionId - qq唯一标识. openId
 * @param {*} source - 客户端类型 1pc
 * @returns promise
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'POST', { unionId, source })
}

/**
 * 获取qq绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码 默认是123456
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'GET', { mobile })
}

/**
 * qq登录-绑定账号
 * @param {String} unionId - QQ唯一标识, openId
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码 默认是123456
 * @returns promise
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'POST', { unionId, mobile, code })
}

/**
 * 校验用户是否存在
 * @param {String} account - 账号
 * @returns promise
 */
export const userAccountCheck = (account) => {
  return request('/register/check', 'GET', { account })
}

/**
 * 获取qq完善时的短信验证码
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码 默认是123456
 * @returns promise
 */
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'GET', { mobile })
}

/**
 * qq登录-完善信息
 * @param {String} unionId - QQ唯一标识, openId
 * @param {String} account - 账号
 * @param {String} password - 密码
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns promise
 */
export const userQQPatchLogin = ({ unionId, account, mobile, code, password }) => {
  return request(`/login/social/${unionId}/complement`, 'POST', { unionId, account, mobile, code, password })
}
