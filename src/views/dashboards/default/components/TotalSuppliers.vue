<script setup lang="ts">
import { shallowRef, onMounted, ref } from 'vue';
import { fetchData } from "@/api/dashboard";
import type { IFilter } from "@/interface/shared";

const dashboard = ref<any>({});

onMounted(() => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
})

const loadData = async (filter: IFilter) => {
  try {
    const response = await fetchData(filter);
   
    if (response.data?.data) {
      dashboard.value = response.data.data; 
    } else {
      dashboard.value = {};
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } 
};
</script>

<template>
  <v-card variant="tonal" color="primary" class="pa-3">
    <p class="text-subtitle-2 mb-1">Total Suppliers</p>
    <h3 class="text-h3 font-weight-bold">{{ dashboard.total_suppliers || 0 }}</h3>
  </v-card>
</template>
