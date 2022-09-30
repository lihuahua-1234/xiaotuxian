<!--二级类目-复选框组件封装-->
<template>
  <div class="xtx-checkbox" @click="changechecked">
    <i v-if="checked"  class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
// v-model ===> :modelValue + @update:modelValue
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  name: 'XtxCheckbox',
  setup (props, { emit }) {
    // 使用useVModel 实现双向数据绑定
    // 1.使用props接收modelValue
    // 2. 使用useVModel 来包装props中的useVModel属性数据
    // 3. 在使用checked.value 就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelValue', '数据')
    // useVModel三个参 props, '字段名字', emit
    const checked = useVModel(props, 'modelValue', emit)
    const changechecked = () => {
      const newVal = !checked.value
      // 通知父组件
      checked.value = newVal
      // 让组件支持change事件
      emit('change', newVal)
    }
    return { checked, changechecked }
  }
  //   setup (props, { emit }) {
  //     const checked = ref(false) // 控制显示和隐藏
  //     const changechecked = () => {
  //       checked.value = !checked.value // 取反
  //       // 使用emit通知父组件数据的改变
  //       emit('update:modelValue', checked.value)
  //     }
  //     // 使用侦听器，得到父组件传递数据，给checked数据
  //     watch(() => props.modelValue, () => {
  //       checked.value = props.modelValue
  //     }, { immediate: true })
  //     return { checked, changechecked }
  //   }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
