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
            <div v-if="loading" class="loading"></div>
            <div v-if="!loading && orderList.length === 0" class="none">暂无数据</div>
        <OrderItem
        @on-cancel="handlerCanel"
        @on-delete="hadlerDelete"
        @on-confirm="handlerconfirm"
        @on-logistics="handlerLogistics"
        v-for="item in orderList"
        :key="item.id"
        :order="item" />
        </div>
      <!--分页组件-->
      <XtxPagination
      v-if="total>0"
      :courrent-page="reqParams.page"
      :page-size="reqParams.pageSize"
      :total="total"
      @current-page="reqParams.page=$event"/>
      <!--取消原因组件-->
      <OrderCancel ref="orderCancelCom" />
      <!--查看物流组件-->
      <OrderLogistics ref="orderLogisticsCom" />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item'
import { delteOrder, findOrderList, confirmOrder } from '@/api/order'
import OrderCancel from './components/order-cancel'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics'
export default {
  components: { OrderItem, OrderCancel, OrderLogistics },
  name: 'MemberOrder',
  setup () {
    const activeName = ref('all')

    // 筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0 // 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消
    })
    // 获取数据
    const orderList = ref([])
    const total = ref(0) // 分页
    findOrderList({ ...reqParams }).then(data => {
      orderList.value = data.result.items
      // console.log(orderList.value)
    })

    const getOrderList = () => {
      loading.value = true
      findOrderList({ ...reqParams }).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      // console.log(orderList.value)
      })
    }

    // 筛选条件发生变化，重新加载
    const loading = ref(false)
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })

    // 点击选项卡
    const tabClick = ({ index }) => {
      // console.log(index)
      reqParams.page = 1
      reqParams.orderState = index
    }

    // 删除订单
    const hadlerDelete = (order) => {
      Confirm({ text: '你确定删除该订单码?' }).then(() => {
        delteOrder(order.id).then(() => {
          Message({ type: 'success', text: '删除成功' })
          getOrderList()
        })
      }).catch(() => {})
    }

    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      reqParams,
      hadlerDelete,
      ...useCancel(), // 因为他返回的是一个对象，要解构
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
// 取下订单逻辑
export const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null)
  // 点击取消订单,打开对话框,把订单传进去
  const handlerCanel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handlerCanel, orderCancelCom }
}

// 确认收货逻辑
export const useConfirm = () => {
  const handlerconfirm = (order) => {
    Confirm({ text: '确认收货吗?' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        // 待收货 -> 待评价
        order.orderState = 4 // 4待评价
      })
    }).catch(() => {})
  }
  return { handlerconfirm }
}

// 查看物流逻辑
export const useLogistics = () => {
  // 拿到组件实例
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>

<style scoped lang="less">
.member-order{
    background-color: #fff;
    height: 100%;
    .order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
}
</style>
