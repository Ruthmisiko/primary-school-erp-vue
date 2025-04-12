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
import {removeTeacher} from "@/api/teachers";
import type {Teacher} from "@/interface/teachers";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'NAME', key: 'name' },
  { title: 'GENDER', key: 'gender' },
  { title: 'PHONE', key: 'contact_number' },
  { title: 'EMAIL', key: 'email' },
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-teacher']);
const props = defineProps<{
  loading: boolean
  teachers: Teacher[]
}>()


const formattedTeachers = computed(() => {
  if (!props.teachers || !props.teachers) {
   
    return [];
  }
  return props.teachers.map((teacher: any, index: number) => ({
    ...teacher,
    index: index + 1,
  }));
});


const searcher = () => {
  emit('refresh-teacher')
}

const handleViewItem = (id: string) => {
  router.push(`/view/teacher/${id}`)
};
const handleEditItem =  (id: string) => {
  router.push(`/edit/teacher/${id}`)
};
const handleDeleteItem = (teacher: any) => {
  ElMessageBox.confirm(
      `Delete #${teacher.name} will be deleted. Continue ?`,
      'Delete Student',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeTeacher(teacher.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-teacher');
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
      :items="formattedTeachers"
      :loading="props.loading"
      height="500"
      fixed-header
  >
   
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
