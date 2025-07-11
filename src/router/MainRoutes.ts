const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
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
    {
      name: 'teacher form',
      path: '/teacher/form',
      component: () => import('@/components/forms/TeacherForm.vue')
    },
    {
      name: 'Update Teacher form',
      path: '/edit/teacher/:id',
      component: () => import('@/components/forms/TeacherForm.vue')
    },
    {
      name: 'view teacher',
      path: '/view/teacher/:id',
      component: () => import('@/components/views/viewTeacher.vue')
    },
    {
      name: 'subjects',
      path: '/subjects',
      component: () => import('@/views/pages/SubjectsPage.vue')
    },
    {
      name: 'subject form',
      path: '/subject/form',
      component: () => import('@/components/forms/SubjectForm.vue')
    },
    {
      name: 'Update Subject form',
      path: '/edit/subject/:id',
      component: () => import('@/components/forms/SubjectForm.vue')
    },

    {
      name: 'exams',
      path: '/exams',
      component: () => import('@/views/pages/ExamsPage.vue')
    },
    {
      name: 'exam form',
      path: '/exam/form',
      component: () => import('@/components/forms/ExamForm.vue')
    },
    {
      name: 'Update exam form',
      path: '/edit/exam/:id',
      component: () => import('@/components/forms/ExamForm.vue')
    },

    {
      name: 'classes',
      path: '/classes',
      component: () => import('@/views/pages/ClassesPage.vue')
    },

    {
      name: 'class form',
      path: '/class/form',
      component: () => import('@/components/forms/ClassForm.vue')
    },
    {
      name: 'view class',
      path: '/view/class/:id',
      component: () => import('@/components/views/viewClass.vue')
    },
    {
      name: 'results',
      path: '/results',
      component: () => import('@/views/pages/ResultsPage.vue')
    },
    {
      name: 'result form',
      path: '/result/form',
      component: () => import('@/components/forms/ResultForm.vue')
    },
     {
      name: 'Update Result form',
      path: '/edit/result/:id',
      component: () => import('@/components/forms/ResultForm.vue')
    },

    {
      name: 'profile',
      path: '/profile',
      component: () => import('@/views/pages/SettingsPage.vue')
    },
    {
      name: 'users',
      path: '/users',
      component: () => import('@/views/pages/UsersPage.vue')
    },

    {
      name: 'user form',
      path: '/user/form',
      component: () => import('@/components/forms/UserForm.vue')
    },
     {
      name: 'Update User form',
      path: '/edit/user/:id',
      component: () => import('@/components/forms/UserForm.vue')
    },
    {
      name: 'view user',
      path: '/view/user/:id',
      component: () => import('@/components/views/viewStudent.vue')
    },
    
  ]
};

export default MainRoutes;
