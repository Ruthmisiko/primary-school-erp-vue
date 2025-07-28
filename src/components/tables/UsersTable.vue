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
import {removeUser} from "@/api/users";
import type {User} from "@/interface/users";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'NAME', key: 'name' },
  { title: 'EMAIL', key: 'email' },
  { title: 'ROLE', key: 'userType' },
  { title: 'PHONE NUMBER', key: 'phone_number' },
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-student']);
const props = defineProps<{
  loading: boolean
  users: User[]
}>()


const formattedUsers = computed(() => {
  if (!props.users || !props.users) {
   
    return [];
  }
  return props.users.map((user: any, index: number) => ({
    ...user,
    index: index + 1,
    // class_id: user?.sclass?.name,
  }));
});


const searcher = () => {
  emit('refresh-student')
}

const handleViewItem = (id: string) => {
  router.push(`/view/student/${id}`)
};
const handleEditItem =  (id: string) => {
  router.push(`/edit/user/${id}`)
};
const handleDeleteItem = (user: any) => {
  ElMessageBox.confirm(
      `Delete #${user.name} will be deleted. Continue ?`,
      'Delete Student',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeUser(user.id);
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

const handlePrintItem = async (studentId: string) => {
  try {
    const response = await printResult(studentId);

    if (response && response.status === 200) {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student-result-${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      ElMessage.error("Failed to download result. Please try again.");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("An error occurred while printing the result.");
  }
};

</script>

<template>
  <VDataTable
      :headers="headers"
      :items="formattedUsers"
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
          <!-- <VListItem @click="handleViewItem(item.id)">
            <EyeOutlined /> <span>VIEW</span>
          </VListItem>
          <VListItem @click="handleEditItem(item.id)">
            <EditOutlined /> <span>EDIT</span>
          </VListItem> -->
          <!-- <VListItem @click="handlePrintItem(item.id)">
            <EditOutlined /> <span>PRINT RESULT</span>
          </VListItem> -->
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
