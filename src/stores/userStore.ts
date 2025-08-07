// import { defineStore } from 'pinia';

// /** User Store */
// export const useUserStore = defineStore('user', {
//   // Default Config State
//   state: () => ({
//     token: '',
//     expire_in: 0,
//     username: '',
//     user: {},
//     avatar: '',
//     permissions: [],
//     roles: [],
//     statusOptions: ['pending','active','deactivated', 'closed', 'cancelled']
//   }),
//   // Getters
//   getters: {
//     getRoles(state) {
//       return state.roles;
//     },
//     getUsername(state) {
//       return state.username;
//     },
//     getUse(state) {
//       return state.user;
//     },
//     getStatusOptions(state) {
//       return state.statusOptions;
//     },
//     getAccessToken(state) {
//       return state.token;
//     }
//   },
//   // Actions
//   actions: {
//     setToken(token: string) {
//       this.token = token;
//     },
//     setUsername(username: string) {
//       this.username = username;
//     },
//     setUser(user: object) {
//       this.user = user;
//     },
//     setProfile(profile: any) {
//       this.username = profile.username;
//       this.avatar = profile.avatar;
//     }
//   },
//   persist: {
//     key: import.meta.env.VITE_APP_WEBSTORAGE_AUTH_NAMESPACE ?? 'm_kopo',
//     storage: window.sessionStorage
//   }
// });
// src/stores/userstore.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    expire_in: 0,
    username: '',
    user: {},
    avatar: '',
    permissions: [],
    roles: [],
    statusOptions: ['pending', 'active', 'deactivated', 'closed', 'cancelled'],
  }),
  getters: {
    getRoles(state) {
      return state.roles;
    },
    getUsername(state) {
      return state.username;
    },
    getUse(state) {
      return state.user;
    },
    getStatusOptions(state) {
      return state.statusOptions;
    },
    getAccessToken(state) {
      return state.token;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      const authStore = useAuthStore();
      // Update localStorage with token
      const userData = authStore.user ? { ...authStore.user, token } : { token };
      localStorage.setItem('user', JSON.stringify(userData));
    },
    setUsername(username: string) {
      this.username = username;
    },
    setUser(user: object) {
      this.user = user;
      const authStore = useAuthStore();
      authStore.user = user; // Sync with guard
      // Ensure token is included when storing user data
      const userData = { ...user };
      if (this.token) {
        userData.token = this.token;
      }
      localStorage.setItem('user', JSON.stringify(userData)); // Update localStorage
    },
    setProfile(profile: any) {
      this.username = profile.username;
      this.avatar = profile.avatar;
      const authStore = useAuthStore();
      authStore.user = { ...authStore.user, username: profile.username, avatar: profile.avatar };
      localStorage.setItem('user', JSON.stringify(authStore.user));
    },
  },
  persist: {
    key: import.meta.env.VITE_APP_WEBSTORAGE_AUTH_NAMESPACE ?? 'm_kopo',
    storage: window.sessionStorage,
  },
});