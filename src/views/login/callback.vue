<!---QQ登录回跳页面-->
<template>
<LoginHeader>联合登录</LoginHeader>
<!--已登录-->
 <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <!--未登录-->
   <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
 <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" :nickname="nickname" :avatar="avatar" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter/>
</template>

<script>
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import { ref } from 'vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  },
  name: 'LoginCallback',
  setup () {
    const hasAccount = ref(true)
    // 1. 首先： 默认认为已经注册并且已经绑定
    // 1.1 通过QQ的API获取 openId 就是后台需要的unionId然后去进行登录
    // 1.2 如果成功：登录成功
    // 1.3 如果失败: 该QQ未和小兔鲜进行绑定(有账号未绑定QQ, 没有账号未绑定QQ )
    const isBind = ref(true)
    const store = useStore()
    const router = useRoute()
    const unionId = ref(null)
    // 判断qq已经登录
    if (QC.Login.check()) {
      // 第三方唯一标识QQ唯一标识
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // 请求小兔鲜后台, 做QQ登录
        userQQLogin(openId).then(data => {
          // 登录成功： data.result 用户信息
          // 2. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2.1 跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 2.2 成功提示
          Message({ type: 'success', text: 'QQ登录成功' })
        }).catch(err => {
          // 登录失败: 没有和小兔鲜绑定
          isBind.value = false
          console.log(err)
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang="less">
  .container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
