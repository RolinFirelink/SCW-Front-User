import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/index.vue'
import Login from '@/views/Login/index.vue'
import Layout from '@/Layout/index.vue'
import EchartLayout from '@/views/DataVisual/index.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          meta: {
            title: '柑橘主页',
            requireAuth: false
          }
        },
        {
          path: '/info',
          name: 'info',
          component: () => import('@/views/Info/index.vue'),
          meta: {
            title: '柑橘资讯',
            requireAuth: false
          }
        },
        {
          path: '/article/:id',
          name: 'article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '柑橘文章详情',
            requireAuth: false
          }
        },
        {
          path: '/personal',
          name: 'personal',
          component: () => import('@/views/Person/index.vue'),
          meta: {
            title: '个人中心',
            requireAuth: true
          },
          children: [
            {
              path: '',
              name: 'userInfo',
              component: () => import('@/views/Person/components/InfoCard.vue'),
              meta: {
                title: '个人资料'
              }
            },
            {
              path: 'experts',
              name: 'experts',
              component: () => import('@/views/Person/components/Experts.vue'),
              meta: {
                title: '我的专家'
              }
            }
          ]
        },
        {
          path: '/market',
          name: 'market',
          component: () => import('@/views/Market/index.vue'),
          meta: {
            title: '柑橘行情'
          }
        },
        {
          path: '/experts-profile',
          name: 'experts-profile',
          component: () => import('@/views/Experts/index.vue'),
          meta: {
            title: '专家介绍'
          }
        },
        {
          path: '/intelligence-recognition',
          name: 'intelligence-recognition',
          component: () => import('@/views/Recognition/index.vue'),
          meta: {
            title: '智能识别'
          }
        },
        {
          path: '/intelligence-advice',
          name: 'intelligence-advice',
          component: () => import('@/views/Advice/index.vue'),
          meta: {
            title: '智能建议'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        requireAuth: false // 修改此处
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register/index.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/ai-chat',
      name: 'ai-chat',
      component: () => import('@/views/AI/index.vue'),
      meta: {
        title: '智能问答'
      }
    },
    {
      path: '/data-visual',
      component: EchartLayout,
      children: [
        {
          path: '/data-visual',
          name: 'data-visual',
          component: () => import('@/views/DataVisual/Page/DataVisual.vue'),
          meta: {
            title: '大数据可视化屏'
          }
        },
        {
          path: '/data-visual2',
          name: 'data-visual2',
          component: () => import('@/views/DataVisual/Page/DataVisual2.vue'),
          meta: {
            title: '大数据可视化屏2'
          }
        },
        {
          path: '/data-visual3',
          name: 'data-visual3',
          component: () => import('@/views/DataVisual/Page/DataVisual3.vue'),
          meta: {
            title: '大数据可视化屏3'
          }
        }
      ]
    }
  ]
})

export default router
