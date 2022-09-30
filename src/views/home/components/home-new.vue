<!--新鲜好物组件-->
<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right><XtxMore path="/" /></template>
      <div ref="target" style="position: relative;height: 426px;">
    <!--面板内容-->
    <Transition name="fade"><!--Transition淡出效果-->
    <ul v-if="goods.length" class="goods-list">
        <li v-for="item in goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="">
            <p class="name ellipsis">{{item.name}}</p>
            <p class="price">&yen;{{item.price}}</p>
          </RouterLink>
        </li>
    </ul>
      <!--goods没数据时，显示骨架动画-->
      <HomeSkeleton bg="#f0f9f4;" v-else />
      </Transition>
    </div>
  </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import { findNew } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  components: {
    HomePanel,
    HomeSkeleton
  },
  name: 'HomeNew',
  setup () {
    // const goods = ref([])
    // findNew().then(data => {
    //   goods.value = data.result
    //   console.log('新鲜好物', data.result)
    // })
    // 1.target 去绑定一个监听对象，最好是dom
    // 2.是传入api函数， 内部获取调用，返回就是响应式数据
    const { target, result } = useLazyData(findNew)
    console.log('新鲜好物', result)
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
// 离开时候淡出动画效果
.fade{
  &-leave {
    &-active {
      position: absolute;
      width: 100%;
      transition: opacity .5s .2s;
      z-index: 1;
    }
    &-to {
      opacity: 0;
    }
  }
}

.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
