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
import {removeResult} from "@/api/results";
import type {Result} from "@/interface/results";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'EXAM', key: 'exam_id' },
  { title: 'CLASS', key: 'class_id' },
  { title: 'STUDENT', key: 'student_id' },
  { title: 'SUBJECT', key: 'subject_id' },
  { title: 'MARKS', key: 'marks_obtained' },
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-result']);
const props = defineProps<{
  loading: boolean
  results: Result[]
}>()


const formattedResults = computed(() => {
  if (!props.results || !props.results) {
   
    return [];
  }
  return props.results.map((result: any, index: number) => ({
    ...result,
    index: index + 1,
    class_id: result?.sclass?.name,
    exam_id: result?.exam?.name,
    student_id: result?.student?.name,
    subject_id: result?.subject?.name,
    marks_obtained: result.marks_obtained,
  }));
});


const searcher = () => {
  emit('refresh-result')
}

const handleViewItem = (id: string) => {
  router.push(`/view/result/${id}`)
};
const handleEditItem =  (id: string) => {
  router.push(`/edit/result/${id}`)
};
const handleDeleteItem = (result: any) => {
  ElMessageBox.confirm(
      `Delete #${result.name} will be deleted. Continue ?`,
      'Delete Result',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeResult(result.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-result');
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
      :items="formattedResults"
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
