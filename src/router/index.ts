import { createRouter, createWebHistory, RouteComponent, RouteRecordRaw } from 'vue-router'
import TokenService from '@/modules/authorization/services/token.service'

const header = (): Promise<RouteComponent> => import('@/components/HeaderTemplate.vue')
const navigation = (): Promise<RouteComponent> => import('@/modules/navigation/views/ApplicationTabs.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    components: {
      default: () => import('@components/NotFound.vue'),
    },
  },
  {
    path: '/',
    name: 'Auth',
    alias: '/login',
    components: {
      default: () => import('@/modules/authorization/views/AuthorizationForm.vue'),
      header,
    },
  },
  {
    path: '/home',
    name: 'Home Page',
    components: {
      default: () => import('@modules/home/views/homeView.vue'),
      header,
      navigation,
    },
  },
  {
    path: '/page-name',
    name: 'Your page',
    components: {
      default: () => import('@/components/EmptyPage.vue'),
      header,
      navigation,
    },
  },
  {
    path: '/users',
    name: 'users',
    components: {
      default: () => import('@/modules/users/views/TheUsers.vue'),
      header,
      navigation,
    },
  },
  {
    path: '/screens',
    name: 'screens',
    components: {
      default: () => import('@/modules/screens/views/TheScreens.vue'),
      header,
      navigation,
    },
  },
  {
    path: '/responsibilities',
    name: 'responsibilities',
    components: {
      default: () => import('@/modules/roles/views/TheRoles.vue'),
      header,
      navigation,
    },
  },
  {
    path: '/views',
    name: 'views',
    components: {
      default: () => import('@/modules/views/views/TheViews.vue'),
      header,
      navigation,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/test'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = TokenService.getUser()
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router
