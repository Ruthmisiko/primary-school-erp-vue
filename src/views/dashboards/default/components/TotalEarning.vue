<script setup lang="ts">
import { shallowRef, onMounted,ref } from 'vue';
import { ArchiveIcon, CopyIcon, DownloadIcon, FileExportIcon } from 'vue-tabler-icons';
import iconCard from '@/assets/images/icons/icon-card.svg';
import { fetchData} from "@/api/dashboard";
import type {IFilter} from "@/interface/shared";


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
      dashboard.value = [];
    }
  } catch (error) {
    console.error("Error fetching customers:", error);
  } 
};
</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      
      <h2 class="text-h1 font-weight-medium">
        {{ dashboard.total_students }}
      </h2>
      <span class="text-subtitle-1 text-medium-emphasis text-white">Total Students</span>
    </v-card-text>
  </v-card>
</template>
