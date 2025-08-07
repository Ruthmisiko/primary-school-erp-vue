<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Schools Management</h1>
          <VBtn
                  @click="handleCreateItem"
                  color="primary"
              >
                <template v-slot:prepend>
                  <PlusOutlined />
                </template>
                Add School
              </VBtn>
        </div>
      </v-col>
    </v-row>

    <!-- Schools Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="schools"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  size="small"
                  color="primary"
                  class="mr-2"
                 @click="handleEditItem(item.id)"
                >
                  Edit
                </v-btn>
                <v-btn
                  size="small"
                  color="error"
                  @click="deleteSchool(item)"
                >
                  Delete
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

   
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ selectedSchool?.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showDeleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" text @click="confirmDelete" :loading="deleting">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { fetchSchools, createSchool, updateSchool, removeSchool } from '@/api/schools'
import { useRoute } from "vue-router";
import {router} from "@/router";

const loading = ref(false)
const route = useRoute();
const saving = ref(false)
const deleting = ref(false)
const schools = ref([])
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const showCreateDialog = ref(false)
const formValid = ref(false)
const isEditing = ref(false)
const selectedSchool = ref(null)

const form = ref({
  id: null,
  name: '',
  address: '',
  email: '',
  phone: ''
})

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Address', key: 'address' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const loadSchools = async () => {
  try {
    loading.value = true
    const response = await fetchSchools()
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        // Handle different possible data structures
        schools.value = response.data.data || response.data || []
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to load schools',
          type: 'error',
        })
      }
    } else {
      console.error('Invalid response structure:', response)
      ElNotification({
        title: 'Error',
        message: 'Invalid response from server',
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error loading schools:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to load schools',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handleEditItem =  (id: string) => {
  router.push(`/edit/school/${id}`)
};

const deleteSchool = (school: any) => {
  selectedSchool.value = school
  showDeleteDialog.value = true
}

const handleCreateItem = () => {
  router.replace(route.query.to ? String(route.query.to) : '/school/form');
};

const confirmDelete = async () => {
  if (!selectedSchool.value) return

  try {
    deleting.value = true
    const response = await removeSchool(selectedSchool.value.id)
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: 'School deleted successfully',
          type: 'success',
        })
        showDeleteDialog.value = false
        selectedSchool.value = null
        await loadSchools()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to delete school',
          type: 'error',
        })
      }
    } else {
      console.error('Invalid response structure:', response)
      ElNotification({
        title: 'Error',
        message: 'Invalid response from server',
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error deleting school:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to delete school',
      type: 'error',
    })
  } finally {
    deleting.value = false
  }
}

const saveSchool = async () => {
  console.log('Form valid:', formValid.value)
  console.log('Form data:', form.value)
  
  if (!formValid.value) {
    console.log('Form validation failed')
    return
  }

  try {
    saving.value = true
    let response

    console.log('Saving school:', { isEditing: isEditing.value, formData: form.value })

    if (isEditing.value) {
      response = await updateSchool(form.value.id, form.value)
    } else {
      response = await createSchool(form.value)
    }

    console.log('API Response:', response)

    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: isEditing.value ? 'School updated successfully' : 'School created successfully',
          type: 'success',
        })
        showDialog.value = false
        resetForm()
        await loadSchools()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to save school',
          type: 'error',
        })
      }
    } else {
      // Handle case where response might be undefined or doesn't have data
      console.error('Invalid response structure:', response)
      ElNotification({
        title: 'Error',
        message: 'Invalid response from server',
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error saving school:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to save school',
      type: 'error',
    })
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    address: '',
    email: '',
    phone: ''
  }
  isEditing.value = false
  selectedSchool.value = null
}

// Watch for dialog changes to reset form when creating new school
watch(showCreateDialog, (newVal) => {
  if (newVal) {
    showDialog.value = true
    resetForm()
  }
})

onMounted(async () => {
  await loadSchools()
})
</script> 