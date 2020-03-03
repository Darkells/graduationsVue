import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Students from '../components/users/Students.vue'
import Teachers from '../components/users/Teachers.vue'
import Admins from '../components/users/Admins.vue'
import Lessons from '../components/lesson/Lessons.vue'
import Orders from '../components/lesson/Orders.vue'
import Teacher from '../components/teacher/teacher.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/students', component: Students },
      { path: '/teachers', component: Teachers },
      { path: '/admins', component: Admins },
      { path: '/Lessons', component: Lessons },
      { path: '/Orders', component: Orders },
      { path: '/Teacher', component: Teacher }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表哪个路径跳转而来
  // next是一个函数，表示放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
