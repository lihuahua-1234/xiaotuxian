<!--订单详情-头部展示-->
<template>
    <div class="detail-action">
      <div class="state">
        <span class="iconfont icon-order-unpay"></span>
        <p>{{orderStatus[order.orderState].label}}</p>
      </div>
      <div class="info">
        <p>订单编号：{{ order.id }}</p>
        <p>下单时间：{{ order.createTime }}</p>
      </div>
      <div class="btn">
      <!-- 1.待付款：立即付款，取消订单
      2.待发货：再次购买
      3.待收货：确认收货，再次购买
      4.待评价：评价商品，再次购买，申请售后
      5.已完成：查看评价，再次购买，申请售后
      6.已取消： -->
      <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <XtxButton @click="$router.push(`/member/pay?orderId=${order.id}`)" type="primary" size="small">立即付款</XtxButton>
        <XtxButton @click="handlerCanel(order)" type="gray" size="small">取消订单</XtxButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton @click="$router.push(`/member/checkout?orderId=${order.id}`)" type="primary" size="small">再次购买</XtxButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <XtxButton @click="handlerconfirm(order)" type="primary" size="small">确认收货</XtxButton>
        <XtxButton @click="$router.push(`/member/checkout?orderId=${order.id}`)" type="plain" size="small">再次购买</XtxButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <XtxButton @click="$router.push(`/member/checkout?orderId=${order.id}`)" type="primary" size="small">再次购买</XtxButton>
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton type="primary" size="small">再次购买</XtxButton>
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已取消 -->
      <Teleport to="#model">
        <OrderCancel ref="orderCancelCom" />
      </Teleport>
      </div>
    </div>
</template>
<script>
import { orderStatus, handlerconfirm } from '@/api/constants'
import OrderCancel from './order-cancel'
import { useCancel, useConfirm } from '../index'
export default {
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  components: { OrderCancel },
  name: 'OrderDetailAction',
  setup () {
    return { ...useCancel(), orderStatus, ...useConfirm(), handlerconfirm }
  }
}
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
