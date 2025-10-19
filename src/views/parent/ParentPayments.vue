<template>
  <div class="parent-payments">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-2 text-primary">
          Payment Center
        </h1>
        <p class="text-h6 text-grey-darken-1 mb-6">
          Manage your child's school fees and payments
        </p>
      </v-col>
    </v-row>

    <!-- Student Selection -->
    <v-row class="mb-4" v-if="children.length > 1">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedChild"
          :items="children"
          item-title="name"
          item-value="id"
          label="Select Student"
          variant="outlined"
          @update:model-value="onStudentChange"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Payment Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="primary" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-currency-usd</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">${{ totalFees.toLocaleString() }}</h3>
          <p class="text-white">Total Fees</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="success" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-check-circle</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">${{ paidAmount.toLocaleString() }}</h3>
          <p class="text-white">Amount Paid</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="warning" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-alert-circle</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">${{ pendingAmount.toLocaleString() }}</h3>
          <p class="text-white">Pending Amount</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="info" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-calendar-clock</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ dueDate }}</h3>
          <p class="text-white">Due Date</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Actions -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-credit-card</v-icon>
            Make Payment
          </v-card-title>
          
          <v-form ref="paymentForm" v-model="isFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentAmount"
                  label="Payment Amount"
                  type="number"
                  variant="outlined"
                  :rules="amountRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedPaymentMethod"
                  :items="paymentMethods"
                  label="Payment Method"
                  variant="outlined"
                  :rules="[v => !!v || 'Payment method is required']"
                  required
                ></v-select>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="paymentNotes"
                  label="Payment Notes (Optional)"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  size="large"
                  :disabled="!isFormValid"
                  :loading="isProcessingPayment"
                  @click="processPayment"
                >
                  <v-icon class="mr-2">mdi-credit-card</v-icon>
                  Process Payment
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-information</v-icon>
            Payment Info
          </v-card-title>
          
          <v-list>
            <v-list-item>
              <v-list-item-title>Student Name</v-list-item-title>
              <v-list-item-subtitle>{{ studentName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Class</v-list-item-title>
              <v-list-item-subtitle>{{ studentClass }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Academic Year</v-list-item-title>
              <v-list-item-subtitle>{{ academicYear }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Payment Status</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip :color="paymentStatusColor" size="small">
                  {{ paymentStatus }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment History -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-history</v-icon>
            Payment History
          </v-card-title>
          
          <v-data-table
            :headers="paymentHistoryHeaders"
            :items="paymentHistory"
            :loading="isLoadingHistory"
            class="elevation-1"
          >
            <template v-slot:item.amount="{ item }">
              <span class="font-weight-bold text-success">${{ item.amount }}</span>
            </template>
            
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
              >
                {{ item.status }}
              </v-chip>
            </template>
            
            <template v-slot:item.date="{ item }">
              {{ formatDate(item.date) }}
            </template>
            
            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-receipt</v-icon>
                <h3 class="text-h6 font-weight-bold text-grey-darken-1 mb-2">
                  No Payment History
                </h3>
                <p class="text-grey-darken-1">
                  No payments have been made yet.
                </p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import { api } from '@/api';

// Data
const totalFees = ref(0);
const paidAmount = ref(0);
const pendingAmount = ref(0);
const dueDate = ref('');
const studentName = ref('');
const studentClass = ref('');
const academicYear = ref('2023-2024');
const paymentStatus = ref('');
const paymentStatusColor = ref('warning');
const children = ref([]);
const selectedChild = ref(null);

const paymentAmount = ref('');
const selectedPaymentMethod = ref('');
const paymentNotes = ref('');
const isFormValid = ref(false);
const isProcessingPayment = ref(false);
const isLoadingHistory = ref(false);

const paymentMethods = ref([
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Money',
  'Cash'
]);

const amountRules = ref([
  (v: string) => !!v || 'Amount is required',
  (v: string) => parseFloat(v) > 0 || 'Amount must be greater than 0',
  (v: string) => parseFloat(v) <= parseFloat(pendingAmount.value.replace(',', '')) || 'Amount cannot exceed pending amount'
]);

const paymentHistoryHeaders = ref([
  { title: 'Date', key: 'created_at', sortable: true },
  { title: 'Student', key: 'student_name', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Method', key: 'payment_method', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Reference', key: 'transaction_id', sortable: true }
]);

const paymentHistory = ref([]);

// Computed
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'grey';
  }
};

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const onStudentChange = () => {
  if (selectedChild.value) {
    const child = children.value.find(c => c.id === selectedChild.value);
    if (child) {
      studentName.value = child.name;
      studentClass.value = child.class;
      
      // Update fees for selected child
      totalFees.value = (parseFloat(child.fee_balance) || 0) + (parseFloat(child.paid_fee) || 0);
      paidAmount.value = parseFloat(child.paid_fee) || 0;
      pendingAmount.value = parseFloat(child.fee_balance) || 0;
      
      // Update payment status
      if (pendingAmount.value === 0) {
        paymentStatus.value = 'Fully Paid';
        paymentStatusColor.value = 'success';
      } else if (paidAmount.value > 0) {
        paymentStatus.value = 'Partial';
        paymentStatusColor.value = 'warning';
      } else {
        paymentStatus.value = 'Unpaid';
        paymentStatusColor.value = 'error';
      }
    }
  }
};

const processPayment = async () => {
  if (!isFormValid.value) return;
  
  isProcessingPayment.value = true;
  
  try {
    // TODO: Implement payment processing API call
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    ElNotification({
      title: 'Success',
      message: 'Payment processed successfully!',
      type: 'success',
    });
    
    // Reset form
    paymentAmount.value = '';
    selectedPaymentMethod.value = '';
    paymentNotes.value = '';
    
    // Reload payment data
    loadPaymentData();
    
  } catch (error) {
    console.error('Payment error:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to process payment. Please try again.',
      type: 'error',
    });
  } finally {
    isProcessingPayment.value = false;
  }
};

const loadPaymentData = async () => {
  try {
    isLoadingHistory.value = true;
    
    // Load children first
    const childrenResponse = await api.get('/parent/children');
    children.value = childrenResponse.data.data || [];
    
    if (children.value.length > 0) {
      selectedChild.value = children.value[0].id;
      studentName.value = children.value[0].name;
      studentClass.value = children.value[0].class;
      
      // Calculate total fees from children data
      totalFees.value = children.value.reduce((sum, child) => 
        sum + (parseFloat(child.fee_balance) || 0) + (parseFloat(child.paid_fee) || 0), 0
      );
      paidAmount.value = children.value.reduce((sum, child) => 
        sum + (parseFloat(child.paid_fee) || 0), 0
      );
      pendingAmount.value = children.value.reduce((sum, child) => 
        sum + (parseFloat(child.fee_balance) || 0), 0
      );
      
      // Set payment status
      if (pendingAmount.value === 0) {
        paymentStatus.value = 'Fully Paid';
        paymentStatusColor.value = 'success';
      } else if (paidAmount.value > 0) {
        paymentStatus.value = 'Partial';
        paymentStatusColor.value = 'warning';
      } else {
        paymentStatus.value = 'Unpaid';
        paymentStatusColor.value = 'error';
      }
    }
    
    // Load payment history
    const paymentsResponse = await api.get('/parent/children/payments');
    paymentHistory.value = paymentsResponse.data.data || [];
    
    // Set due date (you can customize this logic)
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    dueDate.value = nextMonth.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
  } catch (error) {
    console.error('Error loading payment data:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to load payment data',
      type: 'error',
    });
  } finally {
    isLoadingHistory.value = false;
  }
};

onMounted(() => {
  loadPaymentData();
});
</script>

<style scoped>
.parent-payments {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.v-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>