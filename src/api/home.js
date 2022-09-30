// 提供首页相关接口AIP函数
import request from '@/utils/request'
// API接口 http://zhoushugang.gitee.io/erabbit-client-pc-document/api.html

/**
 * 获取热门品牌
 * @paran {Integer} limit - 品牌个数
 * @returns Promise
 */
// export function findBrand (limit) {
//   return request({
//     url: '/home/brand',
//     method: 'GET',
//     limit: 6
//   })
// }
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'GET', { limit })
}

/**
 * 获取广告曲轮播图
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * 获取新鲜好物
 */
export const findNew = () => {
  return request('/home/new', 'get')
}

/**
 * 获取人气推荐
 */
export const findHot = () => {
  return request('home/hot', 'get')
}

/**
 * 获取商品板块
 */
export const findGoods = () => {
  return request('home/goods', 'get')
}

/**
 * 获取最新专题
 */
export const findSpecial = () => {
  return request('home/special', 'get')
}
