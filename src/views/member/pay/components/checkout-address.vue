<!--收货地址组件-->
<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation}}{{showAddress.address}}</li>
      </ul>
      <a v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog()" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit()" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!--对话框组件-切换收货地址-->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
      <div @click="selectedAddress=item" :class="{active: selectedAddress && selectedAddress.id === item.id}" class="text item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2')}}</li>
          <!--replace(/ /g,'') 把中间所的空字符，改为没有空字符-->
          <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
    <template v-slot:footer>
        <XtxButton @click="visibleDialog = false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!--收货地址-添加编辑组件-->
  <AddressEdit @on-success="successHandler" ref="addressEditCom" />

</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  components: {
    AddressEdit
  },
  props: {
    // 收货地址列表
    list: {
      type: Array,
      default: () => []
    }
  },
  // 1. 在拥有根元素组件中，触发自定义事件。 有没有emits选项无所谓
  // 2. 如果你的组件渲染代码判断， vue3.0 规范， 需要在emits中声明你所触发的自定义事件
  // 3. 提出: 你触发了自定义事件， 需要在emits选项声明, 代码可读性提高了
  // emits: ['a',  'b'， 'c' ],一目了然就知道你触发了3个自定义事件
  emits: ['change'],
  name: 'CheckoutAddress',
  setup (props, { emit }) {
    const showAddress = ref(null)
    // 1. 找到默认收货地址
    const defaultAddress = props.list.find(item => item.isDefault === 0)
    if (defaultAddress) { // 如果 defaultAddress 有值
      showAddress.value = defaultAddress
    } else {
      // 2. 没有默认收货地址，使用第一条收货地址
      if (props.list.length) {
        // 加上一个注释:忽略下面代码的检查
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
      // 3. 如果没有数据地址，提示需要添加地址 v-if="!showAddress"
    }

    // 默认通知父组件一个收货地址ID
    emit('change', showAddress.value && showAddress.value.id)
    // 切换地址对话框显示隐藏
    const visibleDialog = ref(false)
    // 记录当前你选中的地址ID
    const selectedAddress = ref(null)
    // 确认地址
    const confirmAddressFn = () => {
      // 显示的地址换成你选中的地址
      showAddress.value = selectedAddress.value
      // 把你选中的地址id通知给结算组件
      emit('change', selectedAddress.value.id)
      visibleDialog.value = false
    }
    const openDialog = () => {
      // 将之前选中地址改成null
      selectedAddress.value = null
      visibleDialog.value = true
    }

    // 打开添加编辑收货地址组件
    const addressEditCom = ref(null)
    const openAddressEdit = () => {
      // 就能拿到另外一个组件的open实例了
      addressEditCom.value.open()
    }

    // 成功处理函数
    const successHandler = (formData) => {
      // 如果是添加：往list中 追加一条
      // 当你在修改formData的时候，数组中的数据也会更新，因为是同一引用地址
      // 啥时候修改 formData 当你打开对话框需要清空之前的输入信息
      // 克隆formData数据
      const jsonStr = JSON.stringify(formData)
      // eslint-disable-next-line vue/no-mutating-props
      props.list.unshift(JSON.parse(jsonStr))
    }

    return {
      showAddress,
      visibleDialog,
      selectedAddress,
      confirmAddressFn,
      openDialog,
      openAddressEdit,
      addressEditCom,
      successHandler
    }
  }
}
</script>
<style scoped lang="less">
  .xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
