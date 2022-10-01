<!--商品详情-->
<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem>{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodName :goods="goods" />
          <!-- sku组件 skuId="1369155865461919746" 测试选中 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量选择组件 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
          <!-- 按钮组件 -->
          <XtxButton @click="insertCart()" type="primary" style="margin-top:20px">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+周热销榜 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, ref, watch, provide } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'

export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsSku, GoodName, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    // 1. 获取商品详情，进行渲染
    const goods = useGoods()
    const changeSku = (sku) => {
      console.log(sku)
      // 修改商品的 现价 原价 库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后的sku 可能有数据， 可能没有数据 {}
      currSku.value = sku
    }

    // 提供goods数据给后代组件使用,依赖注入
    provide('goods', goods)

    // 选择的数量
    const num = ref(1)

    // 加入购物车
    const store = useStore()
    const currSku = ref(null)
    const insertCart = () => {
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart', {
        // payload字段: id  商品名称id, skuId  商品规格SKUID, name  商品名称, attrsText  属性文字，例如“颜色:瓷白色 尺寸：8寸”, picture   商品图片,
        // price  加入时价格, nowPrice  当前的价格, selected  是否选中, stock   库存,  count   数量, isEffective  是否为有效商品
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          count: num.value,
          isEffective: true
        }).then(() => {
          Message({ type: 'success', text: '添加购物车成功' })
        })
      } else {
        Message({ text: '请选择完整的规格' })
      }
    }
    return { goods, changeSku, num, insertCart }
  }
}

// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品id发生变化，但是不会重新初始组件
  const goods = ref(null)
  const rotue = useRoute()
  watch(() => rotue.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === rotue.path) {
      findGoods(rotue.params.id).then(data => {
        // 让商品数据为空，然后使用v-if的组件可以重新销毁和创建
        goods.value = null
        // nextTick 等到DOM数据更新再进入
        nextTick(() => {
          goods.value = data.result
          console.log('商品详情', data.result)
        })
      })
    }
  }, { immediate: true })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
