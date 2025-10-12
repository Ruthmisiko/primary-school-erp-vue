<script setup lang="ts">

import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import {ref, onMounted, reactive, computed } from "vue";
import {useRoute} from "vue-router";
import {getPayment} from "@/api/payments";


const page = ref({ title: 'View Payment' });
const route = useRoute()
const breadcrumbs = ref([
  {
    title: 'payment',
    disabled: false,
    href: '/payment'
  },
  {
    title: 'View',
    disabled: true,
    href: '#'
  }
]);
const payment_id = ref('')
const loading = ref(false)
const payment = ref<any>({})
const tab = ref()

onMounted(async () => {
 payment_id.value = <string>route.params.id

  if (payment_id.value) {
    await loadPayment();
  }
})


const changesInTab = () => {
  console.log(tab.value)
}

const formatAmount = (amount: any) => {
  if (!amount) return '0.00';
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

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
}

const printPayment = () => {
  window.print();
}

const loadPayment = async () => {
  loading.value = true
  try {
    const response = await getPayment(payment_id.value);
    
    console.log('Payment API Response:', response);
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200;
      
      if (isSuccess) {
        // Handle different possible data structures
        payment.value = response.data.data || response.data;
        console.log('Payment loaded:', payment.value);
      } else {
        console.error("Failed to fetch payment:", response.data.message);
      }
    } else {
      console.error('Invalid response structure:', response);
    }
  } catch (error) {
    console.error('Error loading payment:', error);
  } finally {
    loading.value = false;
  }
}


</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  
  <!-- Loading State -->
  <VCard v-if="loading" class="pa-10 text-center elevation-3">
    <VProgressCircular indeterminate color="primary" size="64"></VProgressCircular>
    <p class="mt-4 text-h6 text-medium-emphasis">Loading payment details...</p>
  </VCard>

  <!-- Payment Details -->
  <VCard v-else-if="payment && payment.id" class="elevation-3">
    <!-- Header Section with Gradient Background -->
    <VCardTitle class="pa-6 bg-gradient-primary">
      <VRow align="center" no-gutters>
        <VCol>
          <div class="text-h4 font-weight-bold text-white">Payment Receipt</div>
          <div class="text-subtitle-1 text-white opacity-80">ID: #{{ payment?.id }}</div>
        </VCol>
        <VCol cols="auto">
          <VChip
            :color="getStatusColor(payment?.status)"
            size="x-large"
            variant="elevated"
            class="font-weight-bold"
          >
            {{ payment?.status || 'PENDING' }}
          </VChip>
        </VCol>
      </VRow>
    </VCardTitle>
    
    <VDivider class="border-opacity-100" thickness="2"/>
    
    <VCardText>
      <!-- Student Information -->
      <VRow class="mt-6">
        <VCol cols="12">
          <div class="d-flex align-center mb-4">
            <VIcon size="28" color="primary" class="mr-2">mdi-account-school</VIcon>
            <h3 class="text-h5 font-weight-bold">Student Information</h3>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <VCard variant="tonal" color="primary" class="pa-4">
            <div class="d-flex align-center mb-2">
              <VIcon size="20" class="mr-2">mdi-account</VIcon>
              <span class="text-subtitle-2 font-weight-medium">Student Name</span>
            </div>
            <div class="text-h6 font-weight-bold">{{ payment?.student?.name || 'N/A' }}</div>
          </VCard>
        </VCol>
        <VCol cols="12" md="6">
          <VCard variant="tonal" color="info" class="pa-4">
            <div class="d-flex align-center mb-2">
              <VIcon size="20" class="mr-2">mdi-google-classroom</VIcon>
              <span class="text-subtitle-2 font-weight-medium">Class</span>
            </div>
            <div class="text-h6 font-weight-bold">{{ payment?.student?.sclass?.name || 'N/A' }}</div>
          </VCard>
        </VCol>
      </VRow>

      <!-- Payment Information -->
      <VRow class="mt-8">
        <VCol cols="12">
          <div class="d-flex align-center mb-4">
            <VIcon size="28" color="success" class="mr-2">mdi-cash-multiple</VIcon>
            <h3 class="text-h5 font-weight-bold">Payment Information</h3>
          </div>
        </VCol>
        
        <!-- Amount Card - Highlighted -->
        <VCol cols="12">
          <VCard 
            variant="elevated" 
            color="success" 
            class="pa-6 text-center"
            elevation="4"
          >
            <div class="text-subtitle-1 text-white mb-2">Total Amount Paid</div>
            <div class="text-h3 font-weight-bold text-white">
              {{ payment?.currency || 'KES' }} {{ formatAmount(payment?.amount) }}
            </div>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard variant="tonal" color="warning" class="pa-4">
            <div class="d-flex align-center mb-2">
              <VIcon size="20" class="mr-2">mdi-credit-card-outline</VIcon>
              <span class="text-subtitle-2 font-weight-medium">Payment Method</span>
            </div>
            <div class="text-h6 font-weight-bold">{{ payment?.payment_method || 'N/A' }}</div>
          </VCard>
        </VCol>
        <VCol cols="12" md="6">
          <VCard variant="tonal" color="secondary" class="pa-4">
            <div class="d-flex align-center mb-2">
              <VIcon size="20" class="mr-2">mdi-identifier</VIcon>
              <span class="text-subtitle-2 font-weight-medium">Transaction ID</span>
            </div>
            <div class="text-body-1 font-weight-bold">{{ payment?.transaction_id || 'N/A' }}</div>
          </VCard>
        </VCol>
      </VRow>

      <!-- Additional Details -->
      <VRow class="mt-8">
        <VCol cols="12">
          <div class="d-flex align-center mb-4">
            <VIcon size="28" color="info" class="mr-2">mdi-information-outline</VIcon>
            <h3 class="text-h5 font-weight-bold">Additional Details</h3>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="pa-4" border="info">
            <div class="d-flex align-center mb-2">
              <VIcon size="20" color="info" class="mr-2">mdi-calendar-clock</VIcon>
              <span class="text-subtitle-2 font-weight-medium">Payment Date</span>
            </div>
            <div class="text-body-1 font-weight-medium">{{ formatDate(payment?.created_at) }}</div>
          </VCard>
        </VCol>
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="pa-4" border="info">
            <div class="d-flex align-center mb-2">
              <VIcon size="20" color="info" class="mr-2">mdi-update</VIcon>
              <span class="text-subtitle-2 font-weight-medium">Last Updated</span>
            </div>
            <div class="text-body-1 font-weight-medium">{{ formatDate(payment?.updated_at) }}</div>
          </VCard>
        </VCol>
        <VCol cols="12" v-if="payment?.description">
          <VCard variant="tonal" color="info" class="pa-4">
            <div class="d-flex align-center mb-2">
              <VIcon size="20" class="mr-2">mdi-note-text-outline</VIcon>
              <span class="text-subtitle-2 font-weight-medium">Description/Notes</span>
            </div>
            <div class="text-body-1">{{ payment?.description }}</div>
          </VCard>
        </VCol>
      </VRow>

      <!-- Actions -->
      <VRow class="mt-10">
        <VCol cols="12">
          <VDivider class="mb-6"></VDivider>
          <div class="d-flex justify-space-between align-center">
            <VBtn
              size="large"
              color="grey"
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              @click="$router.push('/payments')"
            >
              Back to Payments
            </VBtn>
            <div class="d-flex gap-2">
              <VBtn
                size="large"
                color="primary"
                variant="flat"
                prepend-icon="mdi-printer"
                @click="printPayment"
              >
                Print Receipt
              </VBtn>
              <VBtn
                size="large"
                color="info"
                variant="outlined"
                prepend-icon="mdi-download"
              >
                Download PDF
              </VBtn>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <!-- No Data State -->
  <VCard v-else class="pa-10 text-center elevation-3">
    <VIcon size="120" color="grey-lighten-1">mdi-receipt-text-remove-outline</VIcon>
    <p class="mt-6 text-h5 font-weight-medium">Payment Not Found</p>
    <p class="mt-2 text-body-1 text-medium-emphasis">The payment you're looking for doesn't exist or has been removed.</p>
    <VBtn 
      color="primary" 
      size="large"
      class="mt-6" 
      prepend-icon="mdi-arrow-left"
      @click="$router.push('/payments')"
    >
      Back to Payments
    </VBtn>
  </VCard>
</template>

<style lang="scss" scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-light-primary {
  background-color: rgba(102, 126, 234, 0.1);
}

.bg-light-success {
  background-color: rgba(76, 175, 80, 0.1);
}

.bg-light-info {
  background-color: rgba(33, 150, 243, 0.1);
}

.bg-light-warning {
  background-color: rgba(255, 152, 0, 0.1);
}

.bg-light-secondary {
  background-color: rgba(158, 158, 158, 0.1);
}

@media print {
  .v-btn,
  .v-breadcrumbs {
    display: none !important;
  }
  
  .v-card {
    box-shadow: none !important;
    border: 1px solid #ddd;
  }
}
</style>