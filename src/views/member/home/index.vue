<!--个人中心首页组件-->
<template>
  <div class="member-home">
      <!--概览-->
      <MemberHomeOverview />
      <!--收藏-->
      <MemberHomePanel title="我的收藏">
          <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
      </MemberHomePanel>
      <!--足迹-->
      <MemberHomePanel title="我的足迹">
          <GoodsItem v-for=" item in Footprint" :key="item.id"  :goods="item" />
      </MemberHomePanel>
      <!--猜你-->
      <GoodsRelevant />
  </div>
</template>
<script>
import MemberHomeOverview from './components/home-overview.vue'
import MemberHomePanel from './components/home-panel.vue'
import GoodsRelevant from '@/views/goods/components/goods-relevant.vue'
import GoodsItem from '@/views/category/components/goods-item'
import request from '@/utils/request'
import { findCollect, findFootprint } from '@/api/member'
import { ref } from 'vue'
export default {
  components: { MemberHomeOverview, MemberHomePanel, GoodsRelevant, GoodsItem },
  name: 'MemberHome',
  setup () {
    // 调用模拟接口
    request('/my/test', 'get').then(data => {
      console.log(data)
    })
    // 调用模拟接口 我的收藏
    const collectGoods = ref(null)
    findCollect({
      page: 1,
      pageSize: 4
    }).then(data => {
    // console.log(data)
      collectGoods.value = data.result.items
    })

    // 调用模拟接口 我的足迹
    const Footprint = ref(null)
    findFootprint({
      page: 1,
      pageSize: 4
    }).then(data => {
    //   console.log(data)
      Footprint.value = data.result.items
    })
    return { collectGoods, Footprint }
  }
}
</script>
<style scoped lang="less">
.member-home {
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
}
</style>
