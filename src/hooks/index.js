// 提供复用逻辑的函数(钩子)
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * 数据懒加载
 * @param {Element} target - Dom对象
 * @param {Function} apiFn - API函数
 */
export const useLazyData = (apiFn) => { // apiFn接口函数
  const result = ref([])
  const target = ref(null) // target 是观察的目标dom容器，必须是dom容器，
  // stop 是停止观察是否进入或移出可视区域的行为
  const { stop } = useIntersectionObserver(
    // target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
    target,
    // isIntersecting 是否进入可视区域，true是进入 false是移出
    // observerElement 被观察的dom
    ([{ isIntersecting }], observerElement) => {
      // 在此处可根据isIntersecting来判断是否进入可视区，然后做业务
      if (isIntersecting) {
        // console.log('进入可视区')
        stop()
        // 调用api函数获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项, 相交的比例大于0触发
    {
      threshold: 0
    }
  )
  return { result, target }
}
