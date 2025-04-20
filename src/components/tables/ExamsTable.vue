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
import {removeExam} from "@/api/exams";
import type {Exam} from "@/interface/exam";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'NAME', key: 'name' },
  { title: 'YEAR', key: 'year' },
  { title: 'TERM', key: 'term' },
  { title: 'CLASS', key: 'class_id' },
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-exam']);
const props = defineProps<{
  loading: boolean
  exams: Exam[]
}>()


const formattedExams = computed(() => {
  if (!props.exams || !props.exams) {
   
    return [];
  }
  return props.exams.map((exam: any, index: number) => ({
    ...exam,
    index: index + 1,
    class_id: exam.sclass.name,
  }));
});


const searcher = () => {
  emit('refresh-exam')
}

const handleViewItem = (id: string) => {
  router.push(`/view/exam/${id}`)
};
const handleEditItem =  (id: string) => {
  router.push(`/edit/exam/${id}`)
};
const handleDeleteItem = (exam: any) => {
  ElMessageBox.confirm(
      `Delete #${exam.name} will be deleted. Continue ?`,
      'Delete Exam',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeExam(exam.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-exam');
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
      :items="formattedExams"
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
