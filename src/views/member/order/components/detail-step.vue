<!--显示订单进度-->
<template>
  <div class="detail-steps" style="padding:20px">
    <XtxSteps :active="order.orderState === 6 ? 1: order.orderState">
      <XtxStepsItem title="提交订单" :desc="order.createTime"/>
      <XtxStepsItem title="付款成功" :desc="order.payTime"/>
      <XtxStepsItem title="商品发货" :desc="order.consignTime"/>
      <XtxStepsItem title="确认收货" :desc="order.endTime"/>
      <XtxStepsItem title="订单完成" :desc="order.evaluationTime"/>
    </XtxSteps>
  </div>
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  name: 'DetailSteps'
}
</script>
<style scoped lang="less">
.detail-steps {
  padding: 20px;
}
</style>
