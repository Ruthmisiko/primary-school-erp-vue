// import { createRouter, createWebHistory } from 'vue-router';
// import MainRoutes from './MainRoutes';
// import PublicRoutes from './PublicRoutes';
// import { useAuthStore } from '@/stores/auth';

// export const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/:pathMatch(.*)*',
//       component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
//     },
//     PublicRoutes,
//     MainRoutes
   
//   ]
// });

// interface User {
//   // Define the properties and their types for the user data here
//   // For example:
//   id: number;
//   name: string;
// }

// // Assuming you have a type/interface for your authentication store
// interface AuthStore {
//   user: User | null;
//   returnUrl: string | null;
//   login(username: string, password: string): Promise<void>;
//   logout(): void;
// }

// router.beforeEach(async (to, from, next) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ['/'];
//   const auth: AuthStore = useAuthStore();

//   const isPublicPage = publicPages.includes(to.path);
//   const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

//   // User not logged in and trying to access a restricted page
//   if (authRequired && !auth.user) {
//     auth.returnUrl = to.fullPath; // Save the intended page
//     next('/login');
//   } else if (auth.user && to.path === '/login') {
//     // User logged in and trying to access the login page
//     next({
//       query: {
//         ...to.query,
//         redirect: auth.returnUrl !== '/' ? to.fullPath : undefined
//       }
//     });
//   } else {
//     // All other scenarios, either public page or authorized access
//     next();
//   }
// });
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
    next();
  }
});