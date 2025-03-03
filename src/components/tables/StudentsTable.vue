<script setup lang="ts">
import { reactive, computed } from "vue";
import {router} from "@/router";
import {ElMessage, ElMessageBox} from "element-plus";
import {removeStudent} from "@/api/students";
import type {Student} from "@/interface/students";
import type {IPagination} from "@/interface/shared";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'STUDENT NAME', key: 'name' },
  { title: 'CLASS', key: 'class_id' },
  { title: 'AGE', key: 'age' },
  { title: 'PARENT', key: 'parent' },
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-student']);
const props = defineProps<{
  loading: boolean
  students: Student[]
  pagination: IPagination
}>()


const formattedStudents = computed(() => {
  if (!props.students || !props.students) {
   
    return [];
  }
  return props.students.map((student: any, index: number) => ({
    ...student,
    index: index + 1,
  }));
});


const searcher = () => {
  emit('refresh-student')
}

const handleViewItem = (id: string) => {
  router.push(`/view/student/${id}`)
};
const handleEditItem =  (id: string) => {
  router.push(`/edit/student/${id}`)
};
const handleDeleteItem = (student: any) => {
  ElMessageBox.confirm(
      `Delete #${student.name} will be deleted. Continue ?`,
      'Delete Student',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeStudent(student.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-student');
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
      :items="formattedStudents"
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
