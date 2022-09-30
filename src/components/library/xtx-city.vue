<!--城市组件-->
<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle()" :class="{active:visible}">
      <span v-if="!fullLocation" class="placeholder">请选择配送地址</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div v-if="loading" class="loading"></div>
        <template v-else>
        <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">{{item.name}}</span>
        </template>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  name: 'XtxCity',
  setup (props, { emit }) {
    // 显示和隐藏，默认隐藏
    const visible = ref(false)

    // 所有省市区数据
    const allCityData = ref([])
    // 正在加载数据
    const loading = ref(false)

    // 提供 打开状态函数
    const open = () => {
      visible.value = true
      // 获取地区数据
      loading.value = true
      getCityData().then(data => {
        // console.log(data)
        allCityData.value = data
        loading.value = false
      })
      // 清空之前选择
      for (const key in changeReuslt) {
        changeReuslt[key] = ''
      }
    }
    // 提供 关闭状态函函数
    const close = () => {
      visible.value = false
    }

    // 提供一个切换函数给select使用
    const toggle = () => {
      visible.value ? close() : open()
    }

    // 实现点击组件外部元素进行关闭操作
    const target = ref(null)
    onClickOutside(target, () => {
      // 参数1： 监听哪个元素,
      // 参数2： 点击了该元素外的其他地方触发的函数
      close()
    })

    // 实现计算属性：获取当前显示的地区数组
    const currList = computed(() => {
      // 默认显示省一级
      let currList = allCityData.value
      // 可能:市一级
      if (changeReuslt.provinceCode && changeReuslt.provinceName) {
        currList = currList.find(p => p.code === changeReuslt.provinceCode).areaList // 取到了对应省的市
      }
      // 可能:县地区
      if (changeReuslt.cityCode && changeReuslt.cityName) {
        currList = currList.find(c => c.code === changeReuslt.cityCode).areaList // 取到了对应省市的县
      }
      return currList
    })
    // 定义选择的 省市区 数据
    const changeReuslt = reactive({
      // 省
      provinceCode: '',
      provinceName: '',
      // 市
      cityCode: '',
      cityName: '',
      // 地区
      countyCode: '',
      countyName: '',
      // 完整地址
      fullLocation: ''
    })
    // 当点击按钮的时候记录
    const changeItem = (item) => {
      if (item.level === 0) {
        // 省
        changeReuslt.provinceCode = item.code
        changeReuslt.provinceName = item.name
      }
      if (item.level === 1) {
        // 市
        changeReuslt.cityCode = item.code
        changeReuslt.cityName = item.name
      }
      if (item.level === 2) {
        // 地区
        changeReuslt.countyCode = item.code
        changeReuslt.countyName = item.name
        // 这市最后一级了选完了拼接省市区,完整路径
        changeReuslt.fullLocation = `${changeReuslt.provinceName}${changeReuslt.cityName}${changeReuslt.countyName}`
        // 关闭对话框，通知父组件
        close()
        emit('change', changeReuslt)
      }
    }
    return { visible, toggle, target, loading, currList, changeItem }
  }
}

// 获取省市区数据函数
const getCityData = () => {
  // 数据地址 https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 1.当本地没右缓存，发请求获取数据
  // 2.但本地有缓存，取出本地数据
  // 返回promise在then获取数据, 这里可能是异步操作，可能是同步操作
  // 第一个参数是 resolve 的已完成情况的回调函数，第二个参数是 reject 被拒绝情况的回调函数
  return new Promise((resolve, reject) => {
    // 约定：数据存储在 window 的cityData 字段
    if (window.cityData) {
      resolve(Window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        // 缓存
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
     .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
