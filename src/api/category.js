// 定义分类相关的API接口函数
import request from '@/utils/request'
// API接口 http://zhoushugang.gitee.io/erabbit-client-pc-document/api.html
/**
 * 获取所有分类数据(顶级，二级。对应的商品推荐数据)
 * @return Promise
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'GET')
}

/**
 * 获取顶级类目信息(children属性就是各个子分类)
 * @rparam {String} id - 顶级类目id
 * @return
 */
export const findTopCategory = (id) => {
  return request('/category', 'GET', { id })
}

/**
 * 获取二级类目的筛选条件数据
 * @rparam {String} id - 二级类目id
 * @return
 */
export const findTopCategoryFilter = (id) => {
  return request('/category/sub/filter', 'GET', { id })
}

/**
 * 获取分类下的商品(带筛选条件)
 * @rparam {Object} params
 * @return
 */
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'POST', params)
}
