<script setup lang="ts">
import { ref,computed } from 'vue';
import { SettingsIcon, LogoutIcon, UserIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const swt1 = ref(true);
const swt2 = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const userName = computed(() => {
  return authStore.user?.name || 'John Doe'; // Use name from authStore.user, fallback to 'John Doe'
});

const goToAccountSettings = () => {
  router.push('/profile');
};


</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <h4 class="mb-n1">Hae ,<span class="font-weight-regular"><b>{{ userName }}</b></span></h4>
   

    <!-- <v-text-field persistent-placeholder placeholder="Search" class="my-3" color="primary" variant="outlined" hide-details>
      <template v-slot:prepend-inner>
        <SearchIcon stroke-width="1.5" size="20" class="text-lightText SearchIcon" />
      </template>
    </v-text-field> -->

    <!-- <v-divider></v-divider> -->
    <!-- <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 515px">
      <div class="bg-lightwarning rounded-md pa-5 my-3 circle sm-circle lg-circle">
        <h4>Upgrade your plan</h4>
        <h6 class="text-subtitle-2 text-medium-emphasis mr-11 pr-11 mb-3 mt-2">70% discount for 1 years subscriptions.</h6>
        <v-btn color="warning" variant="flat" target="_" href="https://codedthemes.com/item/berry-vue-admin-dashboard/"> Go Premium </v-btn>
      </div>

      <v-divider></v-divider>

      <div class="bg-lightprimary rounded-md px-5 py-3 my-3">
        <div class="d-flex align-center justify-space-between">
          <h5 class="text-h5">Start DND Mode</h5>
          <div>
            <v-switch v-model="swt1" color="primary" hide-details></v-switch>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between">
          <h5 class="text-h5">Allow Notifications</h5>
          <div>
            <v-switch v-model="swt2" color="primary" hide-details></v-switch>
          </div>
        </div>
      </div> -->

      <!-- <v-divider></v-divider> -->

      <v-list class="mt-3">
        <v-list-item @click="goToAccountSettings" color="secondary" rounded="md">
          <template v-slot:prepend>
            <SettingsIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Account Settings</v-list-item-title>
        </v-list-item>

        <v-list-item @click="goToAccountSettings" color="secondary" rounded="md">
          <template v-slot:prepend>
            <UserIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Social Profile</v-list-item-title>

         
        </v-list-item>

        <v-list-item @click="authStore.logout()" color="secondary" rounded="md">
          <template v-slot:prepend>
            <LogoutIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    <!-- </perfect-scrollbar> -->
  </div>
</template>
