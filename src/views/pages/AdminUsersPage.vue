<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Admin Users Management</h1>
          <VBtn
              @click="handleCreateItem"
              color="primary"
          >
            <template v-slot:prepend>
              <PlusOutlined />
            </template>
            Add User
          </VBtn>
        </div>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.userType="{ item }">
                <v-chip
                  :color="item.userType === 'admin' ? 'primary' : 'success'"
                  size="small"
                >
                  {{ item.userType }}
                </v-chip>
              </template>
              <template v-slot:item.school="{ item }">
                <span v-if="item.school">{{ item.school.name }}</span>
                <v-chip v-else color="warning" size="small">No School Assigned</v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  size="small"
                  color="primary"
                  class="mr-2"
                  @click="editUser(item)"
                >
                  Edit
                </v-btn>
                <v-btn
                  size="small"
                  color="info"
                  class="mr-2"
                  @click="assignSchool(item)"
                >
                  Assign School
                </v-btn>
                <v-btn
                  size="small"
                  color="warning"
                  @click="removeSchoolAssignment(item)"
                  v-if="item.school"
                >
                  Remove School
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit User Dialog -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Edit User' : 'Create New User' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Full Name"
                  :rules="[v => !!v || 'Name is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                  :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.username"
                  label="Username"
                  :rules="[v => !!v || 'Username is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone_number"
                  label="Phone Number"
                  :rules="[v => !!v || 'Phone number is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" v-if="!isEditing">
                <v-text-field
                  v-model="form.password"
                  label="Password"
                  type="password"
                  :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Password must be at least 6 characters']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.userType"
                  :items="userTypes"
                  label="User Type"
                  :rules="[v => !!v || 'User type is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.school_id"
                  :items="schools"
                  item-title="name"
                  item-value="id"
                  label="School"
                  :rules="[v => !!v || 'School is required']"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveUser" :loading="saving">
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign School Dialog -->
    <v-dialog v-model="showAssignDialog" max-width="400px">
      <v-card>
        <v-card-title>Assign School to User</v-card-title>
        <v-card-text>
          <v-form ref="assignForm" v-model="assignFormValid">
            <v-select
              v-model="assignForm.school_id"
              :items="schools"
              item-title="name"
              item-value="id"
              label="Select School"
              :rules="[v => !!v || 'School is required']"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showAssignDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="confirmAssignSchool" :loading="assigning">
            Assign
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { getAdminUsers, createAdminUser, updateAdminUser, assignSchoolToUser, removeSchoolAssignment } from '@/api/admin'
import { fetchSchools } from '@/api/schools'
import { useRoute } from "vue-router";
import {router} from "@/router";
import { PlusOutlined } from '@ant-design/icons-vue';

const loading = ref(false)
const saving = ref(false)
const assigning = ref(false)
const users = ref([])
const schools = ref([])
const showDialog = ref(false)
const showAssignDialog = ref(false)
const showCreateDialog = ref(false)
const formValid = ref(false)
const assignFormValid = ref(false)
const isEditing = ref(false)
const selectedUser = ref(null)
const route = useRoute();

const form = ref({
  id: null,
  name: '',
  email: '',
  username: '',
  phone_number: '',
  password: '',
  userType: '',
  school_id: ''
})

const assignForm = ref({
  user_id: null,
  school_id: ''
})

const userTypes = [
  { title: 'Admin', value: 'admin' },
  { title: 'Client', value: 'client' }
]

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Username', key: 'username' },
  { title: 'Phone', key: 'phone_number' },
  { title: 'User Type', key: 'userType' },
  { title: 'School', key: 'school' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const loadUsers = async () => {
  try {
    loading.value = true
    const response = await getAdminUsers()
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        // Handle different possible data structures
        users.value = response.data.data || response.data || []
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to load users',
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
    console.error('Error loading users:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to load users',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const loadSchools = async () => {
  try {
    const response = await fetchSchools()
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        // Handle different possible data structures
        schools.value = response.data.data || response.data || []
      }
    }
  } catch (error) {
    console.error('Error loading schools:', error)
  }
}

const editUser = (user: any) => {
  isEditing.value = true
  selectedUser.value = user
  form.value = { ...user }
  showDialog.value = true
}

const assignSchool = (user: any) => {
  selectedUser.value = user
  assignForm.value.user_id = user.id
  assignForm.value.school_id = user.school_id || ''
  showAssignDialog.value = true
}

const handleCreateItem = () => {
  router.replace(route.query.to ? String(route.query.to) : '/admin/user/form');
};

const confirmAssignSchool = async () => {
  if (!assignFormValid.value) return

  try {
    assigning.value = true
    const response = await assignSchoolToUser(assignForm.value)
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: 'School assigned successfully',
          type: 'success',
        })
        showAssignDialog.value = false
        await loadUsers()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to assign school',
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
    console.error('Error assigning school:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to assign school',
      type: 'error',
    })
  } finally {
    assigning.value = false
  }
}

const removeSchoolAssignment = async (user: any) => {
  try {
    const response = await removeSchoolAssignment(user.id)
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: 'School assignment removed successfully',
          type: 'success',
        })
        await loadUsers()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to remove school assignment',
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
    console.error('Error removing school assignment:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to remove school assignment',
      type: 'error',
    })
  }
}


const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    email: '',
    username: '',
    phone_number: '',
    password: '',
    userType: '',
    school_id: ''
  }
  isEditing.value = false
  selectedUser.value = null
}

const handleCreateItem = () => {
  showCreateDialog.value = true
}

// Watch for dialog changes to reset form when creating new user
watch(showCreateDialog, (newVal) => {
  if (newVal) {
    showDialog.value = true
    resetForm()
  }
})

onMounted(async () => {
  await Promise.all([loadUsers(), loadSchools()])
})
</script> 