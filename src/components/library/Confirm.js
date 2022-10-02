// 提供一个能够显示xtx-confirm组件的函数
import { createVNode, render } from 'vue'

// 1. 导入信息提示组件
import XtxConfirm from './xtx-confirm.vue'

// 3. 准备一个dom容器装载组件
const div = document.createElement('div') // DOM容器
div.setAttribute('class', 'xtx-confirm-container')// 这只是一个标识，没有任何作用
document.body.appendChild(div)// 向节点中添加子节点

// 返回的是 promise 对象,点击取消/确认都会销毁组件
export default ({ title, text }) => {
  // 4. 使用 render 函数渲染组件到容器
  return new Promise((resolve, reject) => {
    // 点击取消触发的函数
    const cancelCallback = () => {
      render(null, div) // 不管点击取消/确定都要销毁组件
      reject(new Error('点击取消'))
    }
    // 点击确定触发的函数
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    // 2. 使用createVNode创建虚拟节点
    const vn = createVNode(XtxConfirm, { title, text, submitCallback, cancelCallback })
    render(vn, div)
  })
}
