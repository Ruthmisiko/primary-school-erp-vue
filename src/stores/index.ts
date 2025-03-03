import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia, type Pinia } from 'pinia';

// Pinia Stores
import { useUserStore } from '@/stores/userStore';

/** Pinia Store */
const pinia: Pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

export { useUserStore };
