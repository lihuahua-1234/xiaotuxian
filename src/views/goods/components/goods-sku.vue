<!--规格组件-->
<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.name">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.id">
          <!--选中样式 加selected, 禁用:disabled-->
          <img @click="changeSku(val,item)" :class="{selected: val.selected, disabled: val.disabled}" v-if="val.picture" :src="val.picture" :alt="val.name">
          <span @click="changeSku(val,item)" :class="{selected: val.selected, disabled: val.disabled}" v-else >{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const spliter = '★'
// 2.得到一个路径字典对象
const getPathMap = (skus) => {
  // console.log(skus)
  // 2.1. 得到所有的sku集合  props.goods.skus
  // 2.2. 从所有的sku中筛选出有效的sku
  // 2.3. 根据有效的sku使用power-set算法得到子集
  // 2.4. 根据子集往路径字典对象中存储 key-value
  const pathMap = {} // 路径字典
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算当前有库存的sku的子集
      // 例如：[1,2,3] ==> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // console.log('可选值数组', valueArr) // spec.valueName 得到所有可选有效 数组 ：如:['蓝色', '中国', '10cm'] ['黄色', '中国', '10cm']
      // 可选值数组 子集
      const valueArrPowerSet = powerSet(valueArr)
      // console.log('可选值数组子集', valueArrPowerSet)
      // 遍历子集，往pathMap插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key，约定key是：['蓝色','美国'] ===> '蓝色★美国'
        const key = arr.join(spliter)
        // console.log(key) // ['蓝色','美国'] ===> '蓝色★美国'
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push = [sku.id]
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 4. 获取已选中的值数组
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 4.1. 查找条件 val.selected 为 true时, 选中的按钮对象
    const seletedVal = item.values.find(val => val.selected)
    arr.push(seletedVal ? seletedVal.name : undefined)
  })
  return arr
}
// 3.更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 3.2. 约定每一个按钮的状态由本身的 disabled 数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs) // 4.2.
    item.values.forEach(val => {
      // 3.3. 判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3.4. 拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 3.5. 剔除undefined数据，按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(spliter)
      // 3.6. 拿着key去路径字典中查找是否有数据，有可以点击，没有就禁用（true）
      val.disabled = !pathMap[key]
    })
  })
}

// 5. 默认选择
const initDefaultSelected = (goods, skuId) => {
  // 5.1. 找出sku的信息
  // 5.2. 遍历每一个按钮，按钮的值和sku记录的值相同，就选中。
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
export default {
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  name: 'GoodsSku',
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // console.log(pathMap)

    // 5.3. 根据skuId初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }

    // 3.1. ★组件初始化：更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // 1. 选中与取消选中，约定在每一个按钮都拥有自己的选中状态数据：selected
    // 1.1 点击的是已选中，只需要取消当前的选中
    // 1.2 点击的是未选中，把同一个规格的按钮改成未选中，当前点击的改成选中
    const changeSku = (val, item) => {
      // 3.4. 如果当按钮是禁用的阻止程序运行
      if (val.disabled) {
        return
      }
      // console.log(val)
      //  1.0 每个按钮拥有自己的状态数据 val.selected
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // console.log(getSelectedValues(props.goods.specs))
      // 3.7. ★点击按钮时：更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 6. 将你选择的sku信息通知父组件{skuId,price,oldPrice,inventory,specsText}
      // 6.1. 选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 6.2. 不是完整的sku组合按钮，提交空对象父组件
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v) // 过滤掉无效的值 如示例['e',0,'',undefinde,null].filter(v=>v) 返回结果['e']
      if (validSelectedValues.length === props.goods.specs.length) {
        // console.log('完整')
        // 完整
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      } else {
        // console.log('不完整')
        // 不完整
        // 父组件需要判断是否规格选择完整，不完整不能加购物车。
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
