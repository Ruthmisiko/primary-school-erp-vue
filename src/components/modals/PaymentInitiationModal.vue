<template>
  <v-dialog v-model="isOpen" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 font-weight-bold pa-4">
        <v-icon class="mr-2">mdi-credit-card</v-icon>
        Initiate Payment
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="isFormValid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="paymentForm.student_name"
                label="Student Name"
                variant="outlined"
                readonly
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="paymentForm.student_id">
            <v-col cols="12">
              <v-alert type="info" variant="tonal" class="mb-4">
                Student ID: {{ paymentForm.student_id }}
              </v-alert>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="paymentForm.email"
                label="Email Address"
                type="email"
                variant="outlined"
                :rules="emailRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="paymentForm.amount"
                label="Amount"
                type="number"
                variant="outlined"
                required
                min="0"
                step="0.01"
                @input="console.log('Amount input:', paymentForm.amount)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="paymentForm.currency"
                :items="currencyOptions"
                label="Currency"
                variant="outlined"
                :rules="[v => !!v || 'Currency is required']"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="closeModal"
          :disabled="isLoading"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="false"
          :loading="isLoading"
          @click="initiatePayment"
        >
          Initiate Payment
        </v-btn>
        
        <!-- Debug info -->
        <div class="mt-2 text-caption text-grey">
          Debug: Form Valid: {{ isFormValid }}, Student ID: {{ paymentForm.student_id || currentStudentId }}<br>
          Email: {{ paymentForm.email }}, Amount: {{ paymentForm.amount }}, Currency: {{ paymentForm.currency }}<br>
          Computed Student ID: {{ currentStudentId }}, Student Name: {{ currentStudentName }}
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { ElNotification } from 'element-plus';
import { initiatePayment as initiatePaymentAPI } from '@/api/payments';

// Props
const props = defineProps<{
  open: boolean;
  student: any;
}>();

// Emits
const emit = defineEmits(['close', 'success']);

// Data
const isFormValid = ref(false);
const isLoading = ref(false);
const formRef = ref(null);
const paymentForm = ref({
  student_id: null,
  student_name: '',
  email: '',
  amount: '',
  currency: 'KES'
});

// Currency options
const currencyOptions = ref([
  { title: 'Kenyan Shilling (KES)', value: 'KES' },
  { title: 'US Dollar (USD)', value: 'USD' },
  { title: 'Euro (EUR)', value: 'EUR' },
  { title: 'British Pound (GBP)', value: 'GBP' },
  { title: 'Nigerian Naira (NGN)', value: 'NGN' },
  { title: 'Ghanaian Cedi (GHS)', value: 'GHS' }
]);

// Validation rules
const emailRules = ref([
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]);

const amountRules = ref([
  (v: string) => !!v || 'Amount is required',
  (v: string) => parseFloat(v) > 0 || 'Amount must be greater than 0'
]);

// Computed
const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) {
      emit('close');
    }
  }
});

// Computed student ID
const currentStudentId = computed(() => {
  return props.student?.id || null;
});

// Computed student name
const currentStudentName = computed(() => {
  return props.student?.name || '';
});

// Method to set student data
const setStudentData = () => {
  if (props.student) {
    console.log('Setting student data directly:', props.student);
    console.log('Student ID from props:', props.student.id);
    
    // Use Object.assign to ensure reactivity
    Object.assign(paymentForm.value, {
      student_id: props.student.id,
      student_name: props.student.name,
      email: props.student.email || '',
      amount: '',
      currency: 'KES'
    });
    
    console.log('Payment form after assignment:', paymentForm.value);
    console.log('Student ID in form:', paymentForm.value.student_id);
  }
};

// Methods
const closeModal = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  paymentForm.value = {
    student_id: null,
    student_name: '',
    email: '',
    amount: '',
    currency: 'KES'
  };
};

const initiatePayment = async () => {
  try {
    isLoading.value = true;
    
    console.log('Student data:', props.student);
    console.log('Payment form:', paymentForm.value);
    console.log('Current student ID:', currentStudentId.value);
    
    // Use computed student ID as fallback
    const studentId = paymentForm.value.student_id || currentStudentId.value;
    
    // Validate that student_id is present
    if (!studentId) {
      ElNotification({
        title: 'Error',
        message: 'Student ID is missing. Please try again.',
        type: 'error',
      });
      return;
    }
    
    const payload = {
      student_id: studentId,
      amount: parseFloat(paymentForm.value.amount),
      email: paymentForm.value.email,
      currency: paymentForm.value.currency
    };

    console.log('Payload being sent:', payload);

    const response = await initiatePaymentAPI(payload);
    
    if (response.data && response.data.success) {
      ElNotification({
        title: 'Success',
        message: 'Payment initiated successfully',
        type: 'success',
      });
      emit('success');
      closeModal();
    } else {
      ElNotification({
        title: 'Error',
        message: response.data?.message || 'Failed to initiate payment',
        type: 'error',
      });
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    ElNotification({
      title: 'Error',
      message: 'An error occurred while initiating payment',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};

// Watch for student prop changes
watch(() => props.student, (newStudent) => {
  console.log('Student prop changed:', newStudent);
  if (newStudent) {
    nextTick(() => {
      setStudentData();
    });
  }
}, { immediate: true });

// Watch for modal open state
watch(() => props.open, (isOpen) => {
  if (isOpen && props.student) {
    console.log('Modal opened, setting student data');
    nextTick(() => {
      setStudentData();
    });
  }
});

// Watch for amount changes
watch(() => paymentForm.value.amount, (newAmount) => {
  console.log('Amount changed to:', newAmount);
});
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>
