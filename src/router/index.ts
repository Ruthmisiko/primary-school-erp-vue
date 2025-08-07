
import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    PublicRoutes,
    MainRoutes
  ]
});

interface User {
  id: number;
  name: string;
}

interface AuthStore {
  user: User | null;
  returnUrl: string | null;
  login(username: string, password: string): Promise<void>;
  logout(): void;
}

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/', '/login', '/register']; // Include login and register as public
  const auth: AuthStore = useAuthStore();

  const isPublicPage = publicPages.includes(to.path);
  const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

  console.log('Navigating to:', to.path, 'User:', auth.user, 'Auth required:', authRequired);
  
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    next('/login');
  } else if (auth.user && to.path === '/login') {
    next({
      query: { ...to.query, redirect: auth.returnUrl !== '/' ? auth.returnUrl : undefined }
    });
  } else {
    // Check admin route authorization
    if (to.path.startsWith('/admin') && auth.user) {
      const { canAccessAdminRoutes } = await import('@/utils/auth');
      if (!canAccessAdminRoutes()) {
        console.log('Access denied: User does not have admin privileges');
        next('/dashboard'); // Redirect to dashboard instead of admin routes
        return;
      }
    }
    
    next();
  }
});