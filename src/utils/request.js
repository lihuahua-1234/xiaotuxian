// 请求工具

// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axsio实例发请求，返回值promise

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址，原因：其他地方不是通过axios发请求的地方，也要用上基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
// 1. 创建实例
const instance = axios.create({
  // axios 的一些配置, baseURL timeout
  baseURL,
  timeout: 5000 //  请求响应时间
})

// 2. 请求拦截器
instance.interceptors.request.use(
  config => {
    // 拦截业务逻辑
    // 进行请求配置的修改
    // 如果本地又token就在头部携带
    // 1. 获取用户信息对象
    const { profile } = store.state.user
    // 2. 判断是否有token
    if (profile.token) {
      // 设置token
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  // 拦截失败
  err => {
    return Promise.reject(err)
  })

// 3. 响应拦截器 res => res.data
instance.interceptors.response.use(
  // 响应成功
  // 3.1 剥离无效数据 取出data数据，将来调用接口的时候直接拿到的就是后台的数据
  res => res.data,
  // 响应失败
  err => {
    // 3.2. 处理token失效
    // 401 状态码， 进入该函数
    if (err.response && err.response.status === 401) {
    // 3.2.1. 清空无效用户信息
      store.commit('user/setUser', {})
      // 3.2.2. 跳转到登录页
      // 3.2.3. 跳转需要传参（当前路由地址）给登录页码
      // 当前路由地址
      // 组件里头：`/user?a=10` $route.path === /user  $route.fullPath === /user?a=10
      // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      // encodeURIComponent 转换uri编码，防止解析地址出问题
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  })

// 4. 请求工具函数 导出一个函数
export default (url, method, submitData) => {
// 负责发请求：请求地址，请求方式，提交的数据
  return instance({ // 请求函数
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断 toLowerCase()
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData

  })
}
