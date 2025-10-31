<script setup lang="ts">
import {ref, shallowRef, onMounted, reactive} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import PaymentsTable from "@/components/tables/PaymentsTable.vue";
import { fetchPayments} from "@/api/payments";
import { useRoute } from "vue-router";
import {router} from "@/router";
import type {Payment} from "@/interface/payments";
import type {IFilter, IPagination} from "@/interface/shared";
import UploadStudentModal from "@/components/modals/UploadStudentModal.vue";
import { exportStudents } from "@/api/students";
import PaymentFormModal from "@/components/forms/PaymentFormModal.vue";
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons-vue';


const route = useRoute();
const loading = ref(true);
const searchField = ref('');
const showUploadModal = ref(false);
const showFilter = ref(true);
const dialog = ref(false);
const showPaymentModal = ref(false);
const payments = ref<Payment[]>([])
const page = ref({ title: 'Payments' });
const pagination = reactive<IPagination>({
  total: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
});
const breadcrumbs = shallowRef([
  {
    title: 'Payments',
    disabled: true,
    href: '/payments'
  }
]);


onMounted(() => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
})

const handleCreateItem = () => {
  showPaymentModal.value = true;
};

const handlePaymentSaved = () => {
  showPaymentModal.value = false;
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
};

const loadData = async (filter: IFilter) => {
  loading.value = true;
  try {
    const response = await fetchPayments(filter);
    
    console.log('Payments API Response:', response);
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200;
      
      if (isSuccess) {
        // Handle different possible data structures
        if (Array.isArray(response.data.data)) {
          payments.value = response.data.data;
        } else if (Array.isArray(response.data)) {
          payments.value = response.data;
        } else {
          console.warn('Unexpected data structure:', response.data);
          payments.value = [];
        }
        
        console.log('Payments loaded:', payments.value);

        // Handle pagination
        const data = response.data;
        pagination.per_page = data.per_page ?? 10;
        pagination.total = data.total ?? 0;
        pagination.current_page = data.current_page ?? 1;
        pagination.total_pages = pagination.per_page > 0 ? Math.ceil(pagination.total / pagination.per_page) : 0;
      } else {
        payments.value = [];
      }
    } else {
      console.error('Invalid response structure:', response);
      payments.value = [];
    }
  } catch (error) {
    console.error("Error fetching payments:", error);
    payments.value = [];
  } finally {
    loading.value = false;
  }
};
const searcher = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc'
  }
  loadData(filter)
}
const refreshEvent = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
}

const handleApplyFilter = () => {

  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: searchField.value,
    searchFields: `name:like;tittle:like;location:like;subtitle:like;city:like;country:like;`,
  }
  loadData(filter);
};
const handleRefreshItem = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }

  loadData(filter);
};
const handleClear = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }

  loadData(filter);
};

 const handleExportPdf = async () => {
  try {
    const response = await exportStudents();
    
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students-report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to export PDF:', response);
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
  } 
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow>
    <VCol cols="12" md="12">
      <VCard>
        <VCardItem>
          <VRow class="d-flex justify-space-between">
            <VCol cols="4">
              <VTextField
                  variant="outlined"
                  placeholder="Type something"
                  hide-details
                  clearable
                  v-model="searchField"
                  class="search"
                  @keyup.enter="handleApplyFilter"
                  @click:prepend="showFilter = !showFilter"
                  @click:clear="handleClear"
              />
            </VCol>
            <VCol class="d-flex justify-end">
              <VBtn
                @click="handleExportPdf"
                color="secondary"
                class="mr-4"
              >
                <template v-slot:prepend>
                  <CloudUploadOutlined />
                </template>
                Download
              </VBtn>
             
              <VBtn
                  @click="handleCreateItem"
                  color="primary"
              >
                <template v-slot:prepend>
                  <PlusOutlined />
                </template>
                Add Payment
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardText class="pa-0 pb-5">
          <VDivider />
          <PaymentsTable
            :payments="payments"
            :pagination="pagination"
            :dialog="dialog"
            :loading="loading"
            @form:cancel="dialog = false"
          />
        </VCardText>
      </VCard>
      <UploadStudentModal v-if="showUploadModal" @close="showUploadModal = false" />
      
      <!-- Payment Form Modal -->
      <PaymentFormModal 
        v-model="showPaymentModal" 
        @saved="handlePaymentSaved"
      />
    </VCol>
  </VRow>
</template>
