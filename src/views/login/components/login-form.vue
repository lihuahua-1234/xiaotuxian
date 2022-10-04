<!--登录-表单组件-->
<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!--
    :validation-schema="schema" 定义校验规则
    v-slot="{errors}"提示用户错误--->
    <Form ref="formCom" class="form" :validation-schema="schema" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名" />
          </div>
          <!--错误提示-->
          <div
          class="error"
          v-if="errors.account">
          <i class="iconfont icon-warning" />
          {{errors.account}}
          </div>
        </div>

        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码" />
          </div>
           <div
           class="error"
           v-if="errors.password">
           <i class="iconfont icon-warning" />
           {{errors.password}}
           </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.mobile}"  v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
        <div
          class="error"
          v-if="errors.mobile">
          <i class="iconfont icon-warning" />
          {{errors.mobile}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.code}" v-model="form.code" name="code" type="text" placeholder="请输入验证码" />
            <span @click="send()" class="code">
              {{time === 0 ? '发送验证码' : `${time}秒后发送`}}
            </span>
          </div>
        <div
          class="error"
          v-if="errors.code">
          <i class="iconfont icon-warning" />
          {{errors.code}}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
          <div
           class="error"
           v-if="errors.isAgree">
           <i class="iconfont icon-warning" />
           {{errors.isAgree}}
           </div>
      </div>
      <a @click="login()" href="javascript:;" class="btn">登 录</a>
    </Form>

    <div class="action">
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
export default ({
  components: { Form, Field },
  name: 'LoginForm',
  setup () {
    // 1. 切换登录方式
    const isMsgLogin = ref(false)
    // 2.表单数据对象
    const form = reactive({
      isAgree: true, // 勾选状态
      account: null, // 用户名
      password: null, // 密码
      mobile: null, // 手机
      code: null// 验证码
    })

    // 3.vee-validate 校验基本步骤
    // 3.1 导入 Form Field 组件 将 form 和 input 进行替换， 需要加上name 用来指定将来的校验规则函数的 <Form> <Field v-model="form.account" name="account"/> </Form
    // 3.2 Field 需要进行数据绑定，字段名称最好和后台接口需要的一致  双向绑定: v-model="form.account"
    // 3.3 定义 Field 的 name 属性指定的校验规则函数, Form 的 validation-schema 接收定义好的校验规则是对象 <Form :validation-schema="schema"> <Field v-model="form.account" name="account"/> </Form
    // 3.4 自定义组件需要校验必须先支持v-model 然后再 Field 使用 as 指定为组件名称
    const mySchema = {
      // 校验函数规则： 返回true就是校验成功, 返回一个字串发就是失败,字串发就是错误提升 <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 4.监听 isMsgLogin 重置表单(数据+清除校验结果)
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null // 用户名
      form.password = null // 密码
      form.mobile = null // 手机
      form.code = null// 验证码
      // 如果是没有销毁Field组件,之前的校验结果是不会消除 例如：v-show切换的
      // Form组件提供了一个 resetForm 函数清除校验结果
      // <Form res="formCom">
      // const formCom = ref(null)
      // return formCom
      // 补充校验效果清除，Form组件提供resetForm()
      formCom.value.resetForm()
    })

    // // setuo中获取组件实例 proxy
    // const { proxy } = getCurrentInstance()
    // proxy.$message({ text: '1123' })

    const store = useStore()
    const router = useRouter() // 调api方法的
    const route = useRoute() // 拿路由信息的

    // 5.需要在点击登录的时候对整体表单进行校验
    const login = async () => {
      // Form组件提供了一个 validate 函数作为整体表单校验，但是返回的是一个promise
      const valid = await formCom.value.validate()
      if (valid) {
        let data = null
        try {
          // 区分手机号登录和账号登录
          if (isMsgLogin.value) {
          // 8. 手机号登录
          // 8.1 准备一个API做手机号登录
          // 8.2 调用API函数
          // 8.3 成功：存储用户信息+跳转至源来页或首页 + 消息提示
          // 8.4 失败：消息提示
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
          // 6. 账号登录
          // 6.1 准备一个API做账号登录
          // 6.2 调用API函数
          // 6.3 成功：存储用户信息+跳转至源来页或首页 + 消息提示
          // 6.4 失败：消息提示
          // form.account, form.password
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
          // 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // // 登录成功合并购物车, 清空本地购物车
          // store.dispatch('cart/mergeCart').then(() => {
          //   // 进行跳转
          //   router.push(route.query.redirectUrl || '/')
          //   // 成功消息提示
          //   Message({ type: 'success', text: '登录成功' })
          // })
          // 进行跳转
          router.push(route.query.redirectUrl || '/')
          // 成功消息提示
          Message({ type: 'success', text: '登录成功' })
        } catch (err) {
          // 失败提示
          if (err.response.data) {
            Message({ type: 'error', text: err.response.data.message || '登录失败' })
          }
        }
      }
    }

    // 7 发送验证码
    // 7.1 绑定发送验证码按钮点击事件
    // 7.2 校验手机号，如果成功才去发送短信(定义api)
    // 7.3 请求成功开启60s的倒计时, 按钮不能再次点击， 倒计时结束恢复
    // 7.4 如果失败，失败的校验样式显示出来
    // 调用 vueuse 中的定时器函数返回 resume 开始 pause 暂停   false不立即开启
    // useIntervalFn(回调函数， 执行事件，是否立即开启)
    const time = ref(0)
    const { resume, pause } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => { // 销毁定时器
      pause()
    })
    // 发送短信
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 30
          resume()
        }
      } else {
        // 失败, 使用 vee的错误函数提示错误信息, setFieldErrot(字段， 错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // 9. 初始化QQ登录按钮 (官方)
    // 1. 准备span有id = qqLoginBtn
    // 2. QC.Login({btnId: 'qqLoginBtn'})
    // // 用这段代码主要是得到qq地址
    // onMounted(() => {
    //   QC.Login({ btnId: 'qqLoginBtn' })
    // })

    return { isMsgLogin, form, schema: mySchema, formCom, login, send, time }
  }
})
</script>
<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
