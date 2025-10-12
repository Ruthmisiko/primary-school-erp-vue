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
import {printResult} from "@/api/students";
import type {Payment} from "@/interface/payments";
import { defineProps} from "vue";

const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'STUDENT NAME', key: 'student_name'},
  { title: 'PAYMENT METHOD', key: 'payment_method' },
  { title: 'AMOUNT', key: 'amount_display' },
  { title: 'TRANSACTION ID', key: 'transaction_id' },
  { title: 'STATUS', key: 'status' },
  { title: 'DATE', key: 'date' },
  { title: 'ACTION', key: 'action' },
]);

const emit = defineEmits(['form:cancel','refresh-payment']);
const props = defineProps<{
  loading: boolean
  payments: Payment[]
}>()


const formattedPayments = computed(() => {
  if (!props.payments || !Array.isArray(props.payments)) {
    return [];
  }
  
  return props.payments.map((payment: any, index: number) => {
    // Format the date
    const date = payment.created_at 
      ? new Date(payment.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'N/A';

    // Format the amount with currency
    const amountDisplay = payment.currency 
      ? `${payment.currency} ${parseFloat(payment.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `${parseFloat(payment.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return {
      ...payment,
      index: index + 1,
      student_name: payment?.student?.name || 'Unknown Student',
      amount_display: amountDisplay,
      date: date,
      transaction_id: payment.transaction_id || 'N/A'
    };
  });
});


const searcher = () => {
  emit('refresh-payment')
}

const handleViewItem = (id: string) => {
  router.push(`/view/payment/${id}`)
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

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
      return 'error';
    case 'REFUNDED':
      return 'info';
    default:
      return 'grey';
  }
};

</script>

<template>
  <VDataTable
      :headers="headers"
      :items="formattedPayments"
      :loading="props.loading"
      height="500"
      fixed-header
  > 
    <!-- Status Column with Color-coded Chips -->
    <template #item.status="{ item }">
      <VChip
        :color="getStatusColor(item.status)"
        size="small"
        variant="flat"
      >
        {{ item.status || 'PENDING' }}
      </VChip>
    </template>

    <!-- Action Column -->
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
