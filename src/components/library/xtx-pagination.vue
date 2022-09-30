<!--商品详情-评价组件-★分页组件-->
<template>
  <div class="xtx-pagination">
    <a @click="changePager(myCurrentPage-1)" v-if="myCurrentPage > 1" href="javascript:;">上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>

    <a  @click="changePager(i)" href="javascript:;" v-for="i in pager.btnArr" :key="i" :class="{active: i === myCurrentPage}">{{i}}</a>

    <span v-if="pager.end < pager.PageCount">...</span>
    <a @click="changePager(myCurrentPage+1)" v-if="myCurrentPage < pager.PageCount" href="javascript:;">下一页</a>
    <a v-else class="disabled" href="javascript:;">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  name: 'XtxPagination',
  setup (props, { emit }) {
    // 需要数据；
    // 1. 约定按钮的个数 5 个， 如果想成为动态的需要设置响应式数据
    const count = 5
    // 2. 当前显示页码
    const myCurrentPage = ref(1)
    // 3. 总页数 = 总条数 / 每一页条数 并且向上取整
    const myTotal = ref(100) // 总条数
    const myPageSize = ref(10) // 每一页条数
    // 其他数据(总页数，起始按钮，结束按钮，按钮数组) 依赖上面数据得到
    const pager = computed(() => {
      // 求总页数
      const PageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 按钮个数和当前页码 ===> 起始按钮，结束按钮，按钮数组
      // 4.理想情况下:
      // 当前偏移页码
      const offset = Math.floor(count / 2)
      // 起始按钮
      let start = myCurrentPage.value - offset
      // 结束按钮
      let end = start + count - 1

      // 4.1 如果起始页码小于1需要处理(非理性情况)
      if (start < 1) {
        start = 1
        end = (start + count - 1) > PageCount ? PageCount : (start + count - 1)
      }
      // 4.2 如果结束页码大于了总页数需要处理(非理性情况)
      if (end > PageCount) {
        end = PageCount
        start = (end - count + 1) < 1 ? 1 : (end - count + 1)
      }
      // 5. 提供计算数据 按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { PageCount, btnArr, start, end }
    })

    // 6.监听 props 的变化， 更新组件内部数据
    watch(props, () => {
      // console.log('改变了')
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, { immediate: true })

    // 7.切换分页函数
    const changePager = (page) => {
      myCurrentPage.value = page
      // 通知父组件
      emit('current-page', page)
    }
    return { myCurrentPage, pager, changePager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
