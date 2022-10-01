import { userAccountCheck } from '@/api/user'

// 给vee-validate提供校验规则函数
export default {
  // 用户名校验
  account (value) {
    // value是将来使用该规则的表单元素的值
    // 必填 不能为空
    if (!value) return '请输入用户名'
    // 规则6-20个字符，需要以字母开头
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    // 如何反馈校验成功还是失败，返回true才是成功，其他情况失败，返回失败原因。
    return true
  },

  // 用户校验且校验唯一性
  async accountApi (value) {
    // 必填 不能为空
    if (!value) return '请输入用户名'
    // 规则6-20个字符，需要以字母开头
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    // 服务器端校验
    const data = await userAccountCheck(value)
    // console.log(data)
    if (data.result.valid) {
      return '用户名已存在'
    }

    return true
  },

  // 密码校验
  password (value) {
    // 必填 不能为空
    if (!value) return '请输入密码'
    // 规则: 密码格式6-24个字符
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },

  // 再次确认密码校验
  rePassword (value, { form }) {
    // 必填 不能为空
    if (!value) return '请输入密码'
    // 规则: 密码格式6-24个字符
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    // form表单数据对象
    if (value !== form.password) {
      return '需要和密码保持一致'
    }
    return true
  },

  // 手机号校验
  mobile (value) {
    // 必填 不能为空
    if (!value) return '请输入手机号'
    // 规则：1开头 3-9之间 9个数字
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },

  // 验证码校验
  code (value) {
    // 必填 不能为空
    if (!value) return '请输入验证码'
    // 规则：6个数字
    if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
    return true
  },

  // 验证用户协议
  isAgree (value) {
    // 必填 不能为空
    if (!value) return '请勾选同意用户协议'
    return true
  }

}
