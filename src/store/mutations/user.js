// 用户模块
export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '', // 用户id
        avatar: '', // 用户头像
        nickname: '', // 用户名称
        account: '', // 用户账号名
        mobile: '', // 手机号
        token: '' // 用户token
      }
    }
  },
  mutations: {
    // 修改用户信息, payload就是用户信息对象
    setUser (state, payload) {
      state.profile = payload
    }
  }
}
