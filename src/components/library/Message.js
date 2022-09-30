// 提供一个能够显示xtx-message组件的函数
// 这个函数将来： 导入直接使用。 也可以挂载在vue实例原型上
// 方式一 导入直接使用
// import Message from 'Message.js' 使用Message({type:'error', text:'提示文字'})
// 方式二 挂载在vue实例原型上
// this.$message({type:'error', text:'提示文字'})

import { createVNode, render } from 'vue'
// 1. 导入信息提示组件
import XtxMessage from './xtx-message.vue'

// 3. 准备一个装载信息提示组件DOM容器
const div = document.createElement('div') // DOM容器
div.setAttribute('class', 'xtx-message-container')// 这只是一个标识，没有任何作用
document.body.appendChild(div)// 向节点中添加子节点

// 定时器标识
let timer = null

export default ({ type, text }) => {
  // 渲染组件
  // 2. 将导入的消息提示组件编译为虚拟节点(dom节点) 2.1 createVNode(组件, 属性对象(props))
  const vnode = createVNode(XtxMessage, { type, text })
  // 4. 将虚拟节点渲染在容器中 4.1 render(虚拟节点, DOM容器)
  render(vnode, div)
  // 5. 3s后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)// 将一个空渲染到div容器里
  }, 3000)
}
