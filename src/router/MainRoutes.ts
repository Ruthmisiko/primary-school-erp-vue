const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Starter',
      path: '/starter',
      component: () => import('@/views/StarterPage.vue')
    },
    {
      name: 'Tabler Icons',
      path: '/icons/tabler',
      component: () => import('@/views/utilities/icons/TablerIcons.vue')
    },
    {
      name: 'Material Icons',
      path: '/icons/material',
      component: () => import('@/views/utilities/icons/MaterialIcons.vue')
    },
    {
      name: 'Typography',
      path: '/utils/typography',
      component: () => import('@/views/utilities/typography/TypographyPage.vue')
    },
    {
      name: 'Shadows',
      path: '/utils/shadows',
      component: () => import('@/views/utilities/shadows/ShadowPage.vue')
    },
    {
      name: 'Colors',
      path: '/utils/colors',
      component: () => import('@/views/utilities/colors/ColorPage.vue')
    },

    {
      name: 'students',
      path: '/students',
      component: () => import('@/views/pages/StudentsPage.vue')
    },

    {
      name: 'student form',
      path: '/student/form',
      component: () => import('@/components/forms/StudentForm.vue')
    },
     {
      name: 'Update Student form',
      path: '/edit/student/:id',
      component: () => import('@/components/forms/StudentForm.vue')
    },
    {
      name: 'view student',
      path: '/view/student/:id',
      component: () => import('@/components/views/viewStudent.vue')
    },
    {
      name: 'teachers',
      path: '/teachers',
      component: () => import('@/views/pages/TeachersPage.vue')
    },
  ]
};

export default MainRoutes;
