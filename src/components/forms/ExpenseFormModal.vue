<template>
  <v-dialog v-model="isOpen" max-width="800px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">{{ isEditing ? 'Edit Expense' : 'Add Expense' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="expenseFormRef" v-model="formValid">
          <v-row>
            <!-- Category -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.category"
                :items="categories"
                label="Category *"
                :rules="[v => !!v || 'Category is required']"
                required
                variant="outlined"
                density="comfortable"
              ></v-select>
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

            <!-- Expense Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.expense_date"
                label="Expense Date *"
                type="date"
                :rules="[v => !!v || 'Expense date is required']"
                required
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Receipt Number -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.receipt_number"
                label="Receipt Number"
                placeholder="e.g., RCP-001"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Status -->
            <v-col cols="12" md="6">
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
                label="Description *"
                placeholder="Brief description of the expense"
                rows="3"
                :rules="[v => !!v || 'Description is required']"
                required
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
          @click="saveExpense"
        >
          {{ isEditing ? 'Update' : 'Save' }} Expense
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { createExpense, updateExpense } from '@/api/expenses'
import { fetchMethods } from '@/api/paymentMethods'
import type { Expense } from '@/interface/expenses'

interface Props {
  modelValue: boolean
  expense?: Expense | null
  isEditing?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  expense: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue)
const expenseFormRef = ref()
const formValid = ref(false)
const saving = ref(false)
const loadingPaymentMethods = ref(false)
const paymentMethods = ref([])

const categories = [
  'Salaries & Wages',
  'Utilities',
  'Office Supplies',
  'Maintenance',
  'Transportation',
  'Food & Beverages',
  'Equipment',
  'Marketing',
  'Insurance',
  'Rent',
  'Training',
  'Other'
]

const currencies = [
  { title: 'KES - Kenyan Shilling', value: 'KES' },
  { title: 'USD - US Dollar', value: 'USD' },
  { title: 'EUR - Euro', value: 'EUR' }
]

const statuses = [
  { title: 'Pending', value: 'PENDING' },
  { title: 'Approved', value: 'APPROVED' },
  { title: 'Paid', value: 'PAID' },
  { title: 'Rejected', value: 'REJECTED' }
]

const form = ref({
  category: '',
  description: '',
  amount: 0,
  currency: 'KES',
  payment_method: '',
  expense_date: '',
  receipt_number: '',
  status: 'PENDING'
})

// Watch for dialog changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
  if (newVal) {
    loadPaymentMethods()
    if (props.expense && props.isEditing) {
      populateForm()
    } else {
      resetForm()
    }
  }
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const loadPaymentMethods = async () => {
  try {
    loadingPaymentMethods.value = true
    const response = await fetchMethods({})
    
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
  if (props.expense) {
    form.value = {
      category: props.expense.category || '',
      description: props.expense.description || '',
      amount: props.expense.amount || 0,
      currency: props.expense.currency || 'KES',
      payment_method: props.expense.payment_method || '',
      expense_date: props.expense.expense_date || '',
      receipt_number: props.expense.receipt_number || '',
      status: props.expense.status || 'PENDING'
    }
  }
}

const resetForm = () => {
  const today = new Date().toISOString().split('T')[0]
  form.value = {
    category: '',
    description: '',
    amount: 0,
    currency: 'KES',
    payment_method: '',
    expense_date: today,
    receipt_number: '',
    status: 'PENDING'
  }
  if (expenseFormRef.value) {
    expenseFormRef.value.resetValidation()
  }
}

const saveExpense = async () => {
  if (!formValid.value) return

  try {
    saving.value = true
    let response

    if (props.isEditing && props.expense) {
      response = await updateExpense(props.expense.id, form.value)
    } else {
      response = await createExpense(form.value)
    }

    if (response && response.data) {
      const isSuccess = response.data.success || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: response.data.message || (props.isEditing ? 'Expense updated successfully' : 'Expense created successfully'),
          type: 'success',
        })
        emit('saved')
        closeDialog()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to save expense',
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
    console.error('Error saving expense:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to save expense',
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

onMounted(() => {
  loadPaymentMethods()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
