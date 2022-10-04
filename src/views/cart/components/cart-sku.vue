<!--购物车页面-修改规格-本地-->
<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div v-if="loadding" class="loading"></div>
      <GoodsSku
      @change="changesku"
      :skuId="skuId"
      v-else
      :goods="goods"/>
       <XtxButton
       v-if="goods"
       type="primary"
       size="mini"
       style="margin-left:60px"
       @click="submit">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getGoodsSKU } from '@/api/cart'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
export default {
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  name: 'CartSku',
  setup (props, { emit }) {
    // 显示 true 和 隐藏 false
    const visible = ref(false)
    const goods = ref(null)
    const loadding = ref(false)
    // 打开
    const open = () => {
      visible.value = true
      // 打开的时候就去获取商品数据(specs,skus)
      loadding.value = true
      getGoodsSKU(props.skuId).then(data => {
        goods.value = data.result
        loadding.value = false
        console.log(data.result)
      })
    }
    // 关闭
    const close = () => {
      visible.value = false
    }
    // 切换
    const toggle = () => {
      visible.value ? close() : open()
    //   console.log(visible.value)
    }
    // 点击其他地方
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })

    // 监听sku改变函数, 记录sku信息
    const currSku = ref(null)
    const changesku = (sku) => {
      currSku.value = sku
    }

    // 点击确定的时候，将更改后的sku信息提交给父组件(购物车组件)
    const submit = () => {
      // 当你currSku有值, 且skuId和默认的skuId不同，才通知父组件
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('change', currSku.value)
        close()
      }
    }

    return { visible, open, close, toggle, target, goods, loadding, changesku, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
