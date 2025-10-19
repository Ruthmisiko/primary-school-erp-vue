const ParentRoutes = {
  path: '/parent',
  meta: {
    requiresAuth: true,
    requiresParent: true
  },
  redirect: '/parent/dashboard',
  component: () => import('@/layouts/parent/ParentLayout.vue'),
  children: [
    {
      name: 'Parent Dashboard',
      path: '/parent/dashboard',
      component: () => import('@/views/parent/ParentDashboard.vue')
    },
    {
      name: 'Parent Events',
      path: '/parent/events',
      component: () => import('@/views/parent/ParentEvents.vue')
    },
    {
      name: 'Parent Payments',
      path: '/parent/payments',
      component: () => import('@/views/parent/ParentPayments.vue')
    },
    {
      name: 'Parent Results',
      path: '/parent/results',
      component: () => import('@/views/parent/ParentResults.vue')
    }
  ]
};

export default ParentRoutes;