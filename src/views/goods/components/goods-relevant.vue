<!--商品推荐组件-->
<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{goodsId.id ? '同类商品推荐':'猜你喜欢'}}</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
    <XtxCarousel :sliders="sliders"/>
  </div>
</template>

<script>
import { ref } from 'vue'
import { findRelevantGoods } from '@/api/product'
import xtxCarousel from '@/components/library/xtx-carousel.vue'
export default {
  components: { xtxCarousel },
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  setup (props) {
    // 最终需要的数据是 sliders 提供给轮播图使用
    // 需要的数据结构： sliders = [[4个], [4个], [4个], [4个]]
    const sliders = ref([])
    findRelevantGoods(props.goodsId).then(data => {
      // console.log(data.result)
      // sliders.value = data.result
      // data.result 商品列表，数据结构[16个]
      // 将data.result数据赋值给 sliders 数据， 保证数据结构正确
      const pageSize = 4
      const pageCount = Math.ceil(data.result.length / pageSize) // 向上取整Math.ceil
      for (let i = 0; i < pageCount; i++) {
        // 每循环一次就往数组里添加4条数据
        sliders.value.push(data.result.slice(pageSize * i, pageSize * (i + 1)))
      }
      console.log('同类/猜你', sliders)
    })
    return { sliders }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
// 覆盖xtx-carousel.vue的样式
:deep(.xtx-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @xtxColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>
