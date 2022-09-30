<!--轮播图基础结构-->
<template>
<!--mouseleave鼠标离开 开启定时器, mouseenter鼠标移入 暂停播放-->
  <div class='xtx-carousel' @mouseleave="start()" @mouseenter="stop()">
      <!--轮播图图片容器-->
    <ul class="carousel-body">
        <!--fade显示的图加上-->
      <li class="carousel-item" v-for="(item, i) in sliders" :key="i" :class="{fade: index === i}">
        <!--图片-->
        <RouterLink v-if="item.imgUrl" to="/">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <!--商品列表 item=[goods1.goods2]-->
         <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
             </RouterLink>
         </div>
      </li>
    </ul>
    <!--上一张-->
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <!--下一张-->
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <!--指示容器，圆圈-->
    <div class="carousel-indicator">
        <!--active激活点-->
      <span @click="index=i " v-for="(item, i) in sliders" :key="i" :class="{active: index === i}"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 间隔时长
    duration: {
      type: Number,
      default: 3000
    }
  },
  name: 'XtxCarousel',
  setup (props) {
    // 控制图片的索引, 默认显示第0张图片
    const index = ref(0)

    // 1.自动轮播逻辑
    let timer = null
    const autoPlayFn = () => {
      clearInterval(timer) // 防止定时器重复添加 每次重新开启之前清掉之前的定时器
      // 自动播放逻辑,每格多久切换索引
      timer = setInterval(() => {
        index.value++
        // 如果index >= 轮播图最后一张， 重置设置index = 0
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 需要监听sliders数据变化,判断如果有数据且autoPlay是true
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) {
        autoPlayFn()
      }
      // 默认执行 immediate: true
    }, { immediate: true })

    // 2. 鼠标进入暂停轮播， 离开开启自动播放(有开启条件)
    const stop = () => { // 停止
      if (timer) clearInterval(timer)
    }

    const start = () => { // 开启
      if (props.sliders.length && props.autoPlay) { // 要有数据，并且要有自动播放
        autoPlayFn()
      }
    }

    // 3.点击点可以切换，上一张下一张s
    const toggle = (step) => {
      // 将要改变的索引
      const newIndex = index.value + step
      // 超出的情况， 太大了
      if (newIndex > props.sliders.length - 1) {
        index.value = 0
        return
      }
      // 超出的情况， 小大了
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      // 正常情况
      index.value = newIndex
    }

    // 4. 组件卸载时，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { index, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
