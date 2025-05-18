import router from '@/router';
import Cookies from 'js-cookie';

router.beforeEach((to, from, next) => {


  // 防止已登录用户访问登录页面
  if (to.path === "/login") {
    const userInfo = Cookies.get('user');
    if (userInfo) {
      console.log('User is already logged in, redirecting back');
      alert('您已经登录了，如果想要登录其他账号，请先退出当前账号！');

      Cookies.remove('auth_token')
      Cookies.remove('user')

      next({ path: from.fullPath || '/' });
      return; 
    }
  }

  // 如果当前路由不需要登录权限，直接放行
  if (!to.meta.requireAuth) {
  
    return next();
  }

  // 如果需要登录权限，检查是否已登录
  const token = Cookies.get('auth_token');
  if (token) {
   
    next();
  } else {
   
    alert('请先进行登录！');
    next({ path: '/login' });
  }
});