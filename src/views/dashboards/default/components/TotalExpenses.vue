<script setup lang="ts">
import { shallowRef, onMounted, ref, computed } from 'vue';
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

const formattedExpenses = computed(() => {
  const amount = dashboard.value.total_expenses || 0;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
});
</script>

<template>
  <v-card variant="tonal" color="info" class="pa-3">
    <p class="text-subtitle-2 mb-1">Total Expenses</p>
    <h3 class="text-h3 font-weight-bold">{{ formattedExpenses }}</h3>
  </v-card>
</template>
