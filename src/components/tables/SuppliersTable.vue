<script setup lang="ts">
import { reactive, computed } from "vue";
import {
  EditOutlined,
  MoreOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { removeSupplier } from "@/api/suppliers";
import type { Supplier } from "@/interface/suppliers";
import { defineProps } from "vue";

const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'NAME', key: 'name' },
  { title: 'CATEGORY', key: 'category' },
  { title: 'CONTACT PERSON', key: 'contact_person' },
  { title: 'EMAIL', key: 'email' },
  { title: 'PHONE', key: 'phone' },
  { title: 'ACTION', key: 'action' },
]);

const emit = defineEmits(['form:cancel', 'refresh-supplier', 'edit:item']);
const props = defineProps<{
  loading: boolean
  suppliers: Supplier[]
}>();

const formattedSuppliers = computed(() => {
  if (!props.suppliers || !props.suppliers) {
    return [];
  }
  return props.suppliers.map((supplier: any, index: number) => ({
    ...supplier,
    index: index + 1,
  }));
});

const handleEditItem = (supplier: Supplier) => {
  emit('edit:item', supplier)
};

const handleDeleteItem = (supplier: any) => {
  ElMessageBox.confirm(
    `Delete ${supplier.name} will be deleted. Continue ?`,
    'Delete supplier',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'error',
      center: true,
    }
  )
    .then(async () => {
      const response = await removeSupplier(supplier.id);
      if (response.data.success) {
        ElMessage({
          type: 'success',
          message: response.data.message,
        });
        emit('refresh-supplier');
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
    :items="formattedSuppliers"
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
