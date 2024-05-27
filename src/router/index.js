import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/home',
        name: '主页',
        meta: {
            title: '主页'
        },
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/sys/user',
                name: '用户管理',
                meta: {
                    title: '用户管理'
                },
                component: () => import('../views/sys/SysUser.vue')
            },
            {
                path: '/sys/role',
                name: '角色管理',
                meta: {
                    title: '角色管理'
                },
                component: () => import('../views/sys/SysRole.vue')
            },
            {
                path: '/admin/menu',
                name: '菜单管理',
                meta: {
                    title: '菜单管理'
                },
                component: () => import('../views/admin/AdminMenu.vue')
            },
            {
                path: '/sys/api',
                name: '接口管理',
                meta: {
                    title: '接口管理'
                },
                component: () => import('../views/sys/SysApi.vue')
            },
            {
                path: '/blog/blog',
                name: '博客管理',
                meta: {
                    title: '博客管理'
                },
                component: () => import('../views/blog/Blog.vue')
            },
            {
                path: '/blog/blogType',
                name: '分类管理',
                meta: {
                    title: '分类管理'
                },
                component: () => import('../views/blog/BlogType.vue')
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory('/blog-admin/'),
    routes,
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //修改页面title
    if(to.meta.title){
        document.title = '后台管理系统-' + to.meta.title
    }
    //放行登录页面
    if(to.path === '/login') return next()
    //获取token
    const token = localStorage.getItem('token')
    //判断token是否存在
    if(!token) return next('/login')
    return next()
})
export default router