<template>
  <v-dialog v-model="isOpen" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">{{ isEditing ? 'Edit Payment Method' : 'Add Payment Method' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="paymentMethodFormRef" v-model="formValid">
          <v-row>
            <!-- Name -->
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Name *"
                placeholder="e.g., M-Pesa, Cash, Bank Transfer"
                :rules="[
                  v => !!v || 'Name is required',
                  v => (v && v.length >= 2) || 'Name must be at least 2 characters'
                ]"
                required
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                placeholder="Brief description of this payment method"
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
          @click="savePaymentMethod"
        >
          {{ isEditing ? 'Update' : 'Save' }} Payment Method
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { createMethod, updateMethod } from '@/api/paymentMethods'
import type { PaymentMethod } from '@/interface/paymentMethods'

interface Props {
  modelValue: boolean
  paymentMethod?: PaymentMethod | null
  isEditing?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  paymentMethod: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue)
const paymentMethodFormRef = ref()
const formValid = ref(false)
const saving = ref(false)

const form = ref({
  name: '',
  description: ''
})

// Watch for dialog changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
  if (newVal) {
    if (props.paymentMethod && props.isEditing) {
      populateForm()
    } else {
      resetForm()
    }
  }
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const populateForm = () => {
  if (props.paymentMethod) {
    form.value = {
      name: props.paymentMethod.name || '',
      description: props.paymentMethod.description || ''
    }
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    description: ''
  }
  if (paymentMethodFormRef.value) {
    paymentMethodFormRef.value.resetValidation()
  }
}

const savePaymentMethod = async () => {
  if (!formValid.value) return

  try {
    saving.value = true
    let response

    if (props.isEditing && props.paymentMethod) {
      response = await updateMethod(props.paymentMethod.id, form.value)
    } else {
      response = await createMethod(form.value)
    }

    if (response && response.data) {
      const isSuccess = response.data.success || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: response.data.message || (props.isEditing ? 'Payment Method updated successfully' : 'Payment Method created successfully'),
          type: 'success',
        })
        emit('saved')
        closeDialog()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to save payment method',
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
    console.error('Error saving payment method:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to save payment method',
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
</script>

<style scoped>
/* Add any custom styles here */
</style>
