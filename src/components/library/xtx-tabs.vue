<!--单管理-tabs组件-->
<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 接收v-model的值
    const activeName = useVModel(props, 'modelValue', emit)
    // 点击选项卡触发的函数
    const tabClick = (name, index) => {
      activeName.value = name
      // 提供一个tab-click自定义事件
      emit('tab-click', { name, index })
    }
    // 给每一个panel传当前激活的name
    provide('activeName', activeName)
    return { activeName, tabClick }
  },
  render () {
    // 获取插槽内容
    const panels = this.$slots.default()
    // 动态的panels组件集合
    const dynamicPanels = []
    panels.forEach((item) => {
      // 静态
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        // v-for 渲染处来的
        item.children.forEach((item) => {
          dynamicPanels.push(item)
        })
      }
    })

    // 需要在这里进行动态组织
    // 1. tabs组件大容器
    // 2. 选项卡的导航栏结构
    // 3. 内容容器
    const nav = <nav>{
         dynamicPanels.map((item, i) => {
           return <a
           onClick={() => this.tabClick(item.props.name, i)} // {this.tabClick(item.props.name)} 如果这样写在 JSX会立即调用， 我们需要的是点击时候调用
           class={{ active: item.props.name === this.activeName }}
           href="javascript:;">{item.props.label}
           </a>
         })
    }</nav>
    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
// export default {
//  name: 'XtxTabs'
//   // 基础知识
//   render () {
//     // 返回的内容进行渲染
//     // 1. 在babel的帮助下， 可以在vue中写jsx语法
//     // 2. 数据的使用{}
//     const name = 'tom'
//     const title = '你好'
//     // 3. 事件如何绑定
//     const say = () => {
//       console.log('你好码')
//     }
//     // 4. 定义一个jsx对象
//     const i = [<i>123</i>, <i>456</i>]
//     return <h1 title={title} onClick={say}>{name}{i}</h1>
//   }
// }
</script>

 <style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
 </style>
