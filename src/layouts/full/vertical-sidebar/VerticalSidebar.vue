<script setup lang="ts">
import { shallowRef, computed, ref, onMounted } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import sidebarItems from './sidebarItem';
import { isSuperAdmin } from '@/utils/auth';
import { api } from '@/api';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import ExtraBox from './extrabox/ExtraBox.vue';
import Logo from '../logo/LogoMain.vue';

const customizer = useCustomizerStore();
const schoolLogo = ref<string | null>(null);
const schoolName = ref<string>('');

// Filter sidebar items based on user permissions
const sidebarMenu = computed(() => {
  if (isSuperAdmin()) {
    // Show all items including admin items
    return sidebarItems;
  } else {
    // Filter out admin-only items
    return sidebarItems.filter(item => !item.adminOnly);
  }
});

// Fetch school logo
const fetchSchoolLogo = async () => {
  try {
    const response = await api.get('/settings');
    console.log('Settings response in sidebar:', response);
    
    if (response && response.data) {
      const data = response.data.data || response.data;
      console.log('Settings data:', data);
      
      if (data.school_logo) {
        // Construct the full logo URL
        const baseUrl = import.meta.env.VITE_APP_API_ROOT || 'http://localhost:8000';
        const logoUrl = `${baseUrl}/storage/${data.school_logo}`;
        console.log('Setting logo URL:', logoUrl);
        console.log('Logo path from API:', data.school_logo);
        schoolLogo.value = logoUrl;
      } else {
        console.log('No school logo found in settings');
        schoolLogo.value = null;
      }
      
      schoolName.value = data.business_name || '';
      console.log('School name set to:', schoolName.value);
    }
  } catch (error) {
    console.error('Error fetching school logo:', error);
  }
};

onMounted(() => {
  fetchSchoolLogo();
});
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!---Logo part -->
    <div class="pa-4">
      <!-- School Name Display -->
      <div class="text-center mb-4">
        <v-card variant="flat" class="pa-4 school-name-card">
          <!-- Show logo if available -->
          <div v-if="schoolLogo">
            <v-img
              :src="schoolLogo"
              max-height="80"
              max-width="80"
              contain
              class="mx-auto mb-2 school-logo"
            ></v-img>
            <h2 class="school-name-text">
              {{ schoolName }}
            </h2>
          </div>
          <!-- Show school name with icon if no logo -->
          <div v-else-if="schoolName">
            <div class="school-icon-wrapper mb-3">
              <v-icon size="56" class="school-icon">mdi-school</v-icon>
            </div>
            <h2 class="school-name-text">
              {{ schoolName }}
            </h2>
          </div>
        </v-card>
        <v-divider class="my-4 gradient-divider"></v-divider>
      </div>
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <!---Menu Loop -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" v-else class="leftPadding" />
          <!---End Single Item-->
        </template>
      </v-list>
      
      
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<style scoped>
.school-name-card {
  background: transparent !important;
}

.school-name-text {
  font-size: 1.1rem !important;
  font-weight: 900 !important;
  line-height: 1.3;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
  padding: 0;
}

.school-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.school-icon {
  color: white !important;
}

.school-logo {
  border-radius: 12px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.school-logo:hover {
  transform: scale(1.05);
}

.gradient-divider {
  border-color: rgba(102, 126, 234, 0.3) !important;
  border-width: 2px !important;
}

.bg-transparent {
  background: transparent !important;
}
</style>
