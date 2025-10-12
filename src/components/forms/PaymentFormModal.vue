<template>
  <v-dialog v-model="isOpen" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">{{ isEditing ? 'Edit Payment' : 'Add Payment' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="paymentFormRef" v-model="formValid">
          <v-row>
            <!-- Student Selection -->
            <v-col cols="12">
              <v-autocomplete
                v-model="form.student_id"
                :items="students"
                :loading="loadingStudents"
                item-title="name"
                item-value="id"
                label="Select Student *"
                placeholder="Search student by name..."
                :rules="[v => !!v || 'Student is required']"
                clearable
                required
                variant="outlined"
                density="comfortable"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.name"
                    :subtitle="`Class: ${item.raw.sclass?.name || 'N/A'}`"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- Amount -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.amount"
                label="Amount *"
                type="number"
                step="0.01"
                min="0"
                prefix="KES"
                :rules="[
                  v => !!v || 'Amount is required',
                  v => v > 0 || 'Amount must be greater than 0'
                ]"
                required
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Currency -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.currency"
                :items="currencies"
                label="Currency *"
                :rules="[v => !!v || 'Currency is required']"
                required
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <!-- Payment Method -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.payment_method"
                :items="paymentMethods"
                :loading="loadingPaymentMethods"
                item-title="name"
                item-value="name"
                label="Payment Method *"
                :rules="[v => !!v || 'Payment method is required']"
                required
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <!-- Transaction ID -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.transaction_id"
                label="Transaction ID"
                placeholder="e.g., MPESA123456"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Status -->
            <v-col cols="12">
              <v-select
                v-model="form.status"
                :items="statuses"
                label="Status *"
                :rules="[v => !!v || 'Status is required']"
                required
                variant="outlined"
                density="comfortable"
              >
                <template v-slot:selection="{ item }">
                  <v-chip :color="getStatusColor(item.value)" size="small">
                    {{ item.title }}
                  </v-chip>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-chip :color="getStatusColor(item.value)" size="small">
                        {{ item.title }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description/Notes"
                placeholder="Optional notes about this payment"
                rows="3"
                variant="outlined"
                density="comfortable"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="saving"
          :disabled="!formValid"
          @click="savePayment"
        >
          {{ isEditing ? 'Update' : 'Save' }} Payment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { fetchStudents } from '@/api/students'
import { fetchPaymentMethods, createPayment, updatePayment } from '@/api/payments'

interface Props {
  modelValue: boolean
  payment?: any
  isEditing?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  payment: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue)
const paymentFormRef = ref()
const formValid = ref(false)
const saving = ref(false)
const loadingStudents = ref(false)
const loadingPaymentMethods = ref(false)

const students = ref([])
const paymentMethods = ref([])

const currencies = [
  { title: 'KES - Kenyan Shilling', value: 'KES' },
  { title: 'USD - US Dollar', value: 'USD' },
  { title: 'EUR - Euro', value: 'EUR' }
]

const statuses = [
  { title: 'Pending', value: 'PENDING' },
  { title: 'Completed', value: 'COMPLETED' },
  { title: 'Failed', value: 'FAILED' },
  { title: 'Refunded', value: 'REFUNDED' }
]

const form = ref({
  student_id: null,
  amount: null,
  currency: 'KES',
  payment_method: '',
  transaction_id: '',
  status: 'PENDING',
  description: ''
})

// Watch for dialog changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
  if (newVal) {
    loadStudents()
    loadPaymentMethods()
    if (props.payment && props.isEditing) {
      populateForm()
    } else {
      resetForm()
    }
  }
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const loadStudents = async () => {
  try {
    loadingStudents.value = true
    const response = await fetchStudents({})
    
    if (response && response.data) {
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        students.value = response.data.data || response.data || []
      }
    }
  } catch (error) {
    console.error('Error loading students:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to load students',
      type: 'error',
    })
  } finally {
    loadingStudents.value = false
  }
}

const loadPaymentMethods = async () => {
  try {
    loadingPaymentMethods.value = true
    const response = await fetchPaymentMethods()
    
    if (response && response.data) {
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        paymentMethods.value = response.data.data || response.data || []
      }
    }
  } catch (error) {
    console.error('Error loading payment methods:', error)
    // Set default payment methods if API fails
    paymentMethods.value = [
      { name: 'M-Pesa' },
      { name: 'Cash' },
      { name: 'Bank Transfer' },
      { name: 'Cheque' }
    ]
  } finally {
    loadingPaymentMethods.value = false
  }
}

const populateForm = () => {
  if (props.payment) {
    form.value = {
      student_id: props.payment.student_id,
      amount: props.payment.amount,
      currency: props.payment.currency || 'KES',
      payment_method: props.payment.payment_method || '',
      transaction_id: props.payment.transaction_id || '',
      status: props.payment.status || 'PENDING',
      description: props.payment.description || ''
    }
  }
}

const resetForm = () => {
  form.value = {
    student_id: null,
    amount: null,
    currency: 'KES',
    payment_method: '',
    transaction_id: '',
    status: 'PENDING',
    description: ''
  }
  if (paymentFormRef.value) {
    paymentFormRef.value.resetValidation()
  }
}

const savePayment = async () => {
  if (!formValid.value) return

  try {
    saving.value = true
    let response

    if (props.isEditing && props.payment) {
      response = await updatePayment(props.payment.id, form.value)
    } else {
      response = await createPayment(form.value)
    }

    if (response && response.data) {
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: props.isEditing ? 'Payment updated successfully' : 'Payment created successfully',
          type: 'success',
        })
        emit('saved')
        closeDialog()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to save payment',
          type: 'error',
        })
      }
    } else {
      ElNotification({
        title: 'Error',
        message: 'Invalid response from server',
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error saving payment:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to save payment',
      type: 'error',
    })
  } finally {
    saving.value = false
  }
}

const closeDialog = () => {
  isOpen.value = false
  resetForm()
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'FAILED':
      return 'error'
    case 'REFUNDED':
      return 'info'
    default:
      return 'grey'
  }
}

onMounted(() => {
  loadStudents()
  loadPaymentMethods()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
