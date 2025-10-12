<script setup lang="ts">
import { reactive, computed } from "vue";
import {router} from "@/router";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
import {removeParent} from "@/api/parents";
import type {Parent} from "@/interface/parents";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'PARENT NAME', key: 'name' },
  { title: 'STUDENT NAME', key: 'student_name' },
  { title: 'PHONE NUMBER', key: 'phone_number' },
  { title: 'ADDRESS', key: 'address' },
  { title: 'ACTION', key: 'action' },
]);

const emit = defineEmits(['form:cancel','refresh-parents', 'edit:parent']);
const props = defineProps<{
  loading: boolean
  parents: Parent[]
}>()


const formattedParents = computed(() => {
  if (!props.parents || !Array.isArray(props.parents)) {
    return [];
  }
  
  return props.parents.map((parent: any, index: number) => ({
    ...parent,
    index: index + 1,
    student_name: parent?.student?.name || 'N/A',
  }));
});


const searcher = () => {
  emit('refresh-parents')
}

const handleViewItem = (id: string) => {
  router.push(`/view/student/${id}`)
};
const handleEditItem = (parent: any) => {
  emit('edit:parent', parent);
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
        const response = await removeParent(student.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-parents');
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
      :items="formattedParents"
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
          <VListItem @click="handleEditItem(item)">
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
