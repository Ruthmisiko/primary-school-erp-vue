<script setup lang="ts">
import { reactive, computed } from "vue";
import {
  EditOutlined,
  MoreOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { removeExpense } from "@/api/expenses";
import type { Expense } from "@/interface/expenses";
import { defineProps } from "vue";

const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'CATEGORY', key: 'category' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'AMOUNT', key: 'amount' },
  { title: 'PAYMENT METHOD', key: 'payment_method' },
  { title: 'DATE', key: 'expense_date' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTION', key: 'action' },
]);

const emit = defineEmits(['form:cancel', 'refresh-expense', 'edit:item']);
const props = defineProps<{
  loading: boolean
  expenses: Expense[]
}>();

const formattedExpenses = computed(() => {
  if (!props.expenses || !props.expenses) {
    return [];
  }
  return props.expenses.map((expense: any, index: number) => ({
    ...expense,
    index: index + 1,
    amount: `${expense.currency} ${Number(expense.amount).toLocaleString()}`
  }));
});

const handleEditItem = (expense: Expense) => {
  emit('edit:item', expense)
};

const handleDeleteItem = (expense: any) => {
  ElMessageBox.confirm(
    `Delete expense "${expense.description}" will be deleted. Continue ?`,
    'Delete expense',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'error',
      center: true,
    }
  )
    .then(async () => {
      const response = await removeExpense(expense.id);
      if (response.data.success) {
        ElMessage({
          type: 'success',
          message: response.data.message,
        });
        emit('refresh-expense');
      }
      else {
        ElMessage({
          type: 'error',
          message: response.data.message,
        });
      }
    })
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
    case 'PAID':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'REJECTED':
      return 'error'
    default:
      return 'grey'
  }
}

</script>

<template>
  <VDataTable
    :headers="headers"
    :items="formattedExpenses"
    :loading="props.loading"
    height="500"
    fixed-header
  >
    <template #item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" size="small">
        {{ item.status }}
      </v-chip>
    </template>

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
