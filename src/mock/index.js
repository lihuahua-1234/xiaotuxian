import Mock from 'mockjs'
import qs from 'qs'

// mock的配置
Mock.setup({
  // 随机延时500-1000毫秒 模拟网络延时
  timeout: '500-1000'
})

// 拦截接口 /my/test
// 1. 接口地址路径规则, 需要匹配到它
// 2. 请求方式
// 3. 返回数据(函数返回数据)
Mock.mock(/\/my\/test/, 'get', () => {
  // 随机数据逻辑
  const arr = []
  for (let i = 0; i < 5; i++) {
    // arr.push(Mock.mock('@id'))
    arr.push(Mock.mock({
      id: '@id',
      name: '@cname',
      image: '@image(200x100)'
    }))
  }
  return { msg: '获取数据成功', result: arr }
})

// 模拟我的收藏接口
Mock.mock(/\/member\/collect/, 'get', config => {
  console.log(config)
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  // console.log(queryObject)
  const items = []
  for (let i = 0; i < queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)', // 字符长度10 - 20
      desc: '@ctitle(4, 10)',
      price: '@float(100,200,2,2)',
      // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg` // @isInteger(1,8)成随机数据 1到 8
    }))
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      page: +queryObject.page, // + 是转成数字类型的意思
      pageSize: +queryObject.pageSize,
      items: items
    }
  }
})

// 模拟我的足迹接口
Mock.mock(/\/member\/browseHistory/, 'get', config => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)', // 字符长度10 - 20
      desc: '@ctitle(4, 10)',
      price: '@float(100,200,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      page: queryObject.page,
      pagSize: queryObject.pagSize,
      items: items
    }
  }
})
