// 扩展vue原有功能：全局组件，自定义指令,挂载原型方法, 注意:没有过滤器
// 这就是插件
// vue2.0插件写法要求: 导出一个对象, 有install函数， 默认传入了Vue构造函数，vue基础之上扩展
// import PageTools from './PageTools'
// export default {
//     install(Vue) {
//       //  注册全局的通用栏组件对象
//       Vue.component('PageTools', PageTools) // 注册工具栏组件件
//     }
//   }
import defaultImg from '@/assets/images/200.png'
import Message from './Message'
// vue3.0插件写法要求: 导出一个对象, 有install函数， 默认传入了app应用实例，aue基础之上扩展
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread'
// import XtxBreadItem from './xtx-bread-item'

// 批量注册组件
// 1.使用 require 提供的函数 context 加载某一个目录下的所有 .vue 后缀的文件。
// 然后 context 函数会返回一个导入函数 importFn
// 它又一个属性 keys() 获取所有的文件路径
// 通过文件路径数组，通过遍历数组，再使用 importFn 根据路径导入组件对象
// 遍历的同时进行全局注册即可
// context 可以批量加载某一个目录的
// context (三个参数:目录, 是否加载子目录, 加载的正则匹配)
const importFn = require.context('./', false, /\.vue$/) // 意思是:加载当前目标，没有加载子目录,正则表达式
// console.log(importFn.keys())

export default {
  install (app) {
    // // 在app上进行扩展，app提供 component directive函数
    // // 如果要挂载原型 app.config.globalproperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 根据keys批量注册
    importFn.keys().forEach(path => { // 遍历importFn.keys()下的每一个文件路径
      // 导入组件
      const component = importFn(path).default
      // 注册组件
      app.component(component.name, component)
    })
    // 定义指令
    defineDirective(app)

    // 定义一个原型函数
    app.config.globalProperties.$message = Message
  }
}

// 定义指令
const defineDirective = (app) => {
  // 1.图片懒加载指令
  // 原理：先存储图片地址,不能在src上,当图片进入可视区，将你存储图片地址设置给图片元素即可
  app.directive('lazy', { // ('指令名', {指令的配置对象})
    // vue2.0 监听使用指令的dom是否创建好,钩子函数: mounted 挂载后真实DOM
    // vue3.0 的指令拥有的钩子函数和组件的一样, 使用指令的dom是否创建好,钩子函数:mounted
    mounted (el, binding) {
      // console.log('mounted')
      // 2. 创建一个观察对象, 来观察当前使用指令的元素, 信息中isIntersecting判断进入或离开
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 停止观察
          observe.unobserve(el) // 停止观察那个dom
          // console.log('进入可视区', el)
          // 4.处理图片加载失败, onerror 图片加载失败的事件, load图片加载成功
          el.onerror = () => {
            // 加载失败，设置默认图片
            el.src = defaultImg
          }
          // 3.把指令的值设置给el的src属性 binding.value就是一个指令值
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      // 开启观察
      observe.observe(el) // 观察哪个dom
    }
  })
}
// 实例提供两个方法
// observe(dom) 观察哪个dom
// unobserve(dom) 停止观察那个dom
