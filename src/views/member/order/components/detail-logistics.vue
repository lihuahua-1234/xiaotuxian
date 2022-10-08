<!--物流信息-->
<template>
  <div class="detail-logistics">
    <p>
      <span>{{list[0].time}}</span>
      <span>{{list[0].text}}</span>
    </p>
    <a @click="handlerLogistics(order)" href="javascript:;">查看物流</a>
    <Teleport to="#model">
    <OrderLogistics  ref="orderLogisticsCom"/>
    </Teleport>
  </div>
</template>
<script>
import { logosticsOrder } from '@/api/order'
import OrderLogistics from './order-logistics'
import { useLogistics } from '../index'
import { ref } from 'vue'
export default {
  components: {
    OrderLogistics
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  name: 'DetailLogistics',
  // 组件实例化的时候需要执行setup, 因为需要返回渲染模板需要的数据, async是异步执行的
  async setup (props) {
    const data = await logosticsOrder(props.order.id)
    const list = ref(data.result.list)
    console.log(list)
    return { list, ...useLogistics() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
