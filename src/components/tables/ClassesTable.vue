<script setup lang="ts">
import { reactive, computed } from "vue";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import {router} from "@/router";
import {ElMessage, ElMessageBox} from "element-plus";
import {removeClass} from "@/api/classes";
import type {Class} from "@/interface/classes";
import type {IPagination} from "@/interface/shared";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'NAME', key: 'name' },
  { title: 'CLASS TEACHER', key: 'teacher_id' },
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-class']);
const props = defineProps<{
  loading: boolean
  classes: Class[]
  pagination: IPagination
}>()


const formattedClasses = computed(() => {
  if (!props.classes || !props.classes) {
   
    return [];
  }
  return props.classes.map((classs: any, index: number) => ({
    ...classs,
    index: index + 1,
    teacher_id: classs?.teacher?.name,
  }));
});


const searcher = () => {
  emit('refresh-class')
}

const handleViewItem = (id: string) => {
  router.push(`/view/class/${id}`)
};
const handleEditItem =  (id: string) => {
  router.push(`/edit/class/${id}`)
};
const handleDeleteItem = (classs: any) => {
  ElMessageBox.confirm(
      `Delete #${classs.name} will be deleted. Continue ?`,
      'Delete Class',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeClass(classs.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-class');
        }
        else {
          ElMessage({
            type: 'error',
            message: response.data.message,
          });
        }
      })
};

</script>

<template>
  <VDataTable
      :headers="headers"
      :items="formattedClasses"
      :loading="props.loading"
      :items-per-page="pagination.per_page"
      height="500"
      fixed-header
  >
    <template #bottom>
      <VRow class="justify-center">
        <VPagination
            v-model="pagination.current_page"
            class="my-4"
            :length="pagination.total_pages"
            :total-visible="5"
            @first="searcher"
            @last="pagination.current_page = pagination.total_pages"
            @update:model-value="searcher"
        />
      </VRow>
    </template>
    

    <template #item.action="{ item }">
      <VMenu>
        <template #activator="{ props }">
          <VBtn v-bind="props" color="primary" size="large" variant="tonal" density="compact" :icon="true">
            <MoreOutlined />
          </VBtn>
        </template>
        <VList>
          <VListItem @click="handleViewItem(item.id)">
            <EyeOutlined /> <span>VIEW</span>
          </VListItem>
          <VListItem @click="handleEditItem(item.id)">
            <EditOutlined /> <span>EDIT</span>
          </VListItem>
          <VListItem @click="handleDeleteItem(item)">
            <DeleteOutlined /> <span>DELETE</span>
          </VListItem>
        </VList>
      </VMenu>
    </template>
  </VDataTable>
</template>

<style scoped>
::v-deep .v-data-table-header th {
  font-weight: bold;
}
</style>
