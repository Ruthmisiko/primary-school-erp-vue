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
import {removeMethod} from "@/api/paymentMethods";
import type {PaymentMethod} from "@/interface/paymentMethods";
import { defineProps} from "vue";


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description'},
  { title: 'ACTION', key: 'action' },

]);

const emit = defineEmits(['form:cancel','refresh-method','edit:item']);
const props = defineProps<{
  loading: boolean
  methods: PaymentMethod[]
}>()


const formattedMethods = computed(() => {
  if (!props.methods || !props.methods) {
   
    return [];
  }
  return props.methods.map((method: any, index: number) => ({
    ...method,
    index: index + 1,
  }));
});


const searcher = () => {
  emit('refresh-method')
}

const handleEditItem =  (method: PaymentMethod) => {
  emit('edit:item', method)
};
const handleDeleteItem = (method: any) => {
  ElMessageBox.confirm(
      `Delete #${method.name} will be deleted. Continue ?`,
      'Delete payment method',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeMethod(method.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-method');
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
      :items="formattedMethods"
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
