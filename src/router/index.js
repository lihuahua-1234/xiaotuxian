import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const SubCategory = () => import('@/views/category/sub')
const TopCategory = () => import('@/views/category/index')
const Goods = () => import('@/views/goods/index')
const Cart = () => import('@/views/cart/index')

const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')

const Checkout = () => import('@/views/member/pay/checkout')
const Pay = () => import('@/views/member/pay/index')
const PayResult = () => import('@/views/member/pay/result')

const MemberLayput = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home/index')
const MemberOrder = () => import('@/views/member/order/index')
const MeberberDetail = () => import('@/views/member/order/detail')
// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory }, // 一级分类地址
      { path: '/category/sub/:id', component: SubCategory }, // 二级分类地址
      { path: '/product/:id', component: Goods }, // 二级分类地址
      { path: '/cart', component: Cart }, // 二级分类地址
      { path: '/member/checkout', component: Checkout }, // 二级分类地址
      { path: '/member/pay', component: Pay }, // 二级分类地址
      { path: '/pay/callback', component: PayResult }, // 二级分类地址
      { // 二级分类地址
        path: '/member',
        component: MemberLayput,
        children: [// 三级分类地址
          { path: '/member', component: MemberHome },
          // { path: '/member/order', component: MemberOrder },
          // { path: '/member/order/:id', component: MeberberDetail }
          {
            path: '/member/order',
            // 创建一个RouterView容器形参嵌套关系
            component: { render: () => h(<RouterView />) },
            children: [
              { path: '', component: MemberOrder },
              { path: ':id', component: MeberberDetail }
            ]
          }
        ]
      }
    ]
  },
  { path: '/login', component: Login }, // 一级分类地址
  { path: '/login/callback', component: LoginCallback }// 一级分类地址
]

// vue2.0 new  VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建路由实例
const router = createRouter({
  // 路由模式， 我们使用hash的路由模式
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior () {
    // vue2.0 通过x, y 控制的
    // vue3.0 通过left,y控制的
    return { left: 0, top: 0 }
  }
})

// 前置导航守卫
router.beforeEach((to, form, next) => {
  // 需要登录的路由：地址是以 /member 开头
  const { profile } = store.state.user
  // 有没有token 并且访问的是要登录的
  if (!profile.token && to.path.startsWith('/member')) {
    console.log('竟然了123')
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
