<template>
  <v-dialog v-model="isOpen" max-width="800px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">{{ isEditing ? 'Edit Supplier' : 'Add Supplier' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="supplierFormRef" v-model="formValid">
          <v-row>
            <!-- Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Supplier Name *"
                placeholder="e.g., ABC Suppliers Ltd"
                :rules="[
                  v => !!v || 'Supplier name is required',
                  v => (v && v.length >= 2) || 'Name must be at least 2 characters'
                ]"
                required
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

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

            <!-- Contact Person -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contact_person"
                label="Contact Person *"
                placeholder="e.g., John Doe"
                :rules="[v => !!v || 'Contact person is required']"
                required
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Email -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email *"
                type="email"
                placeholder="supplier@example.com"
                :rules="[
                  v => !!v || 'Email is required',
                  v => /.+@.+\..+/.test(v) || 'Email must be valid'
                ]"
                required
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Phone -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                label="Phone *"
                placeholder="e.g., +254712345678"
                :rules="[v => !!v || 'Phone is required']"
                required
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Address -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.address"
                label="Address"
                placeholder="e.g., 123 Main St, Nairobi"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                placeholder="Brief description of the supplier"
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
          @click="saveSupplier"
        >
          {{ isEditing ? 'Update' : 'Save' }} Supplier
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { createSupplier, updateSupplier } from '@/api/suppliers'
import type { Supplier } from '@/interface/suppliers'

interface Props {
  modelValue: boolean
  supplier?: Supplier | null
  isEditing?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  supplier: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue)
const supplierFormRef = ref()
const formValid = ref(false)
const saving = ref(false)

const categories = [
  'Stationery',
  'Food & Beverages',
  'Cleaning Supplies',
  'Office Equipment',
  'Sports Equipment',
  'Educational Materials',
  'IT & Technology',
  'Furniture',
  'Maintenance',
  'Other'
]

const form = ref({
  name: '',
  category: '',
  contact_person: '',
  email: '',
  phone: '',
  address: '',
  description: ''
})

// Watch for dialog changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
  if (newVal) {
    if (props.supplier && props.isEditing) {
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
  if (props.supplier) {
    form.value = {
      name: props.supplier.name || '',
      category: props.supplier.category || '',
      contact_person: props.supplier.contact_person || '',
      email: props.supplier.email || '',
      phone: props.supplier.phone || '',
      address: props.supplier.address || '',
      description: props.supplier.description || ''
    }
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    category: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  }
  if (supplierFormRef.value) {
    supplierFormRef.value.resetValidation()
  }
}

const saveSupplier = async () => {
  if (!formValid.value) return

  try {
    saving.value = true
    let response

    if (props.isEditing && props.supplier) {
      response = await updateSupplier(props.supplier.id, form.value)
    } else {
      response = await createSupplier(form.value)
    }

    if (response && response.data) {
      const isSuccess = response.data.success || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: response.data.message || (props.isEditing ? 'Supplier updated successfully' : 'Supplier created successfully'),
          type: 'success',
        })
        emit('saved')
        closeDialog()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to save supplier',
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
    console.error('Error saving supplier:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to save supplier',
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
