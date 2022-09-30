<!--人气推荐组件-->
<template>
<div class="home-hot">
<HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
<!-- <template #right><XtxMore path="/" /></template> -->
<div ref="target" style="position: relative;height: 426px;">
<!--面板内容-->
<Transition name="fade"><!--Transition淡出效果-->
    <ul v-if="goods.length" class="goods-list">
      <li v-for="item in goods" :key="item.id">
        <RouterLink to="/">
          <img :src="item.picture" alt="">
          <p class="name">{{item.title}}</p>
          <p class="desc">{{item.alt}}</p>
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
import { findHot } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  components: {
    HomePanel,
    HomeSkeleton
  },
  name: 'HomeHot',
  setup () {
    // const goods = ref([])
    // findHot().then(data => {
    //   goods.value = data.result
    //   console.log('人气推荐', data.result)
    // })
    const { target, result } = useLazyData(findHot)
    console.log('人气推荐', result)
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
