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
import {removeSubject} from "@/api/subjects";
import type {Subject} from "@/interface/subjects";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'NAME', key: 'name' },
  { title: 'CODE', key: 'code' },
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-subject']);
const props = defineProps<{
  loading: boolean
  subjects: Subject[]
}>()


const formattedSubjects = computed(() => {
  if (!props.subjects || !props.subjects) {
   
    return [];
  }
  return props.subjects.map((subject: any, index: number) => ({
    ...subject,
    index: index + 1,
  }));
});


const searcher = () => {
  emit('refresh-subject')
}

const handleViewItem = (id: string) => {
  router.push(`/view/subject/${id}`)
};
const handleEditItem =  (id: string) => {
  router.push(`/edit/subject/${id}`)
};
const handleDeleteItem = (subject: any) => {
  ElMessageBox.confirm(
      `Delete #${subject.name} will be deleted. Continue ?`,
      'Delete subject',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeSubject(subject.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-subject');
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
      :items="formattedSubjects"
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
