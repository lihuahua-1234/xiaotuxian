<!--我的订单-->
<template>
  <div class="member-order">
      <!--tab组件-->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </XtxTabsPanel>
    </XtxTabs>
      <!--订单列表-->
        <div class="order-list">
        <OrderItem
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
        </div>
      <!--分页组件-->
      <XtxPagination />
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item'
import { findOrderList } from '@/api/order'
export default {
  components: { OrderItem },
  name: 'MemberOrder',
  setup () {
    const activeName = ref('all')

    // 筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 获取数据
    const orderList = ref([])
    findOrderList({ ...reqParams }).then(data => {
      orderList.value = data.result.items
      console.log(orderList.value)
    })

    return { activeName, orderStatus, orderList }
  }
}
</script>

<style scoped lang="less">
.member-order{
    background-color: #fff;
    height: 100%;
    .order-list {
  background: #fff;
  padding: 20px;
}
}
</style>
