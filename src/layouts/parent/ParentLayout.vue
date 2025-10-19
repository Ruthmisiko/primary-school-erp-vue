<template>
  <v-app>
    <!-- Parent Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      class="parent-nav-drawer"
      color="transparent"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="userStore.getUsername"
        subtitle="Parent Portal"
        nav
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav class="parent-nav-list">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          :to="'/parent/dashboard'"
          class="parent-nav-item"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-calendar"
          title="Upcoming Events"
          value="events"
          :to="'/parent/events'"
          class="parent-nav-item"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-credit-card"
          title="Payments"
          value="payments"
          :to="'/parent/payments'"
          class="parent-nav-item"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Results"
          value="results"
          :to="'/parent/results'"
          class="parent-nav-item"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            variant="outlined"
            @click="logout"
          >
            <v-icon start>mdi-logout</v-icon>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-app-bar
        :elevation="1"
        color="white"
        class="parent-app-bar"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="text-h6 font-weight-bold">
          Parent Portal
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>

      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import { useAuthStore } from '@/stores/auth';
import { ElNotification } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const drawer = ref(true);
const rail = ref(false);

const logout = async () => {
  try {
    // Clear user data from both stores first
    authStore.user = null;
    userStore.token = '';
    userStore.username = '';
    userStore.user = {};
    
    // Clear localStorage and sessionStorage
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Wait a bit to ensure stores are updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Show success notification
    ElNotification({
      title: 'Success',
      message: 'Logged out successfully',
      type: 'success',
    });
    
    // Force reload to ensure clean state
    window.location.href = '/login';
    
  } catch (error) {
    console.error('Logout error:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to logout',
      type: 'error',
    });
  }
};
</script>

<style scoped>
.parent-nav-drawer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
}

.parent-nav-drawer .v-list-item {
  color: white !important;
}

.parent-nav-drawer .v-list-item .v-list-item-title {
  color: white !important;
}

.parent-nav-drawer .v-list-item .v-list-item-subtitle {
  color: rgba(255, 255, 255, 0.8) !important;
}

.parent-nav-drawer .v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.parent-nav-drawer .v-list-item--active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.parent-nav-drawer .v-list-item--active .v-list-item-title {
  color: white !important;
  font-weight: bold !important;
}

.parent-nav-drawer .v-icon {
  color: white !important;
}

.parent-nav-drawer .v-btn {
  color: white !important;
}

.parent-nav-drawer .v-btn .v-icon {
  color: white !important;
}

.parent-app-bar {
  border-bottom: 1px solid #e0e0e0;
}

/* Override Vuetify default styles */
.parent-nav-drawer .v-navigation-drawer__content {
  background: transparent !important;
}

.parent-nav-drawer .v-list {
  background: transparent !important;
}

.parent-nav-drawer .v-list-item__content {
  color: white !important;
}

.parent-nav-list {
  background: transparent !important;
}

.parent-nav-item {
  color: white !important;
  margin: 4px 8px !important;
  border-radius: 8px !important;
}

.parent-nav-item .v-list-item__content {
  color: white !important;
}

.parent-nav-item .v-list-item-title {
  color: white !important;
  font-weight: 500 !important;
}

.parent-nav-item .v-icon {
  color: white !important;
}

.parent-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.parent-nav-item.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.parent-nav-item.v-list-item--active .v-list-item-title {
  color: white !important;
  font-weight: bold !important;
}
</style>