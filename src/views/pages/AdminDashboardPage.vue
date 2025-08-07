<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Admin Dashboard</h1>
          <v-chip
            :color="isSuperAdmin() ? 'error' : 'primary'"
            size="large"
          >
            {{ getUserTypeDisplay('super_admin') }}
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-text>
            <div class="text-h4 font-weight-bold text-primary">{{ statistics.total_schools || 0 }}</div>
            <div class="text-subtitle-1">Total Schools</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-text>
            <div class="text-h4 font-weight-bold text-success">{{ statistics.total_users || 0 }}</div>
            <div class="text-subtitle-1">Total Users</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-text>
            <div class="text-h4 font-weight-bold text-info">{{ statistics.total_admins || 0 }}</div>
            <div class="text-subtitle-1">Total Admins</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="400">
          <v-card-text>
            <div class="text-h4 font-weight-bold text-warning">{{ statistics.total_clients || 0 }}</div>
            <div class="text-subtitle-1">Total Clients</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Management Actions -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>School Management</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              block
              class="mb-3"
              @click="$router.push('/admin/schools')"
            >
              Manage Schools
            </v-btn>
            <v-btn
              color="success"
              block
              class="mb-3"
              @click="showCreateSchoolDialog = true"
            >
              Create New School
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>User Management</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              block
              class="mb-3"
              @click="$router.push('/admin/users')"
            >
              Manage Users
            </v-btn>
            <v-btn
              color="success"
              block
              class="mb-3"
              @click="showCreateUserDialog = true"
            >
              Create New User
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Schools -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Recent Schools</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="schoolHeaders"
              :items="recentSchools"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  size="small"
                  color="primary"
                  @click="editSchool(item)"
                >
                  Edit
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create School Dialog -->
    <v-dialog v-model="showCreateSchoolDialog" max-width="500px">
      <v-card>
        <v-card-title>Create New School</v-card-title>
        <v-card-text>
          <v-form ref="schoolForm" v-model="schoolFormValid">
            <v-text-field
              v-model="schoolForm.name"
              label="School Name"
              :rules="[v => !!v || 'School name is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="schoolForm.address"
              label="Address"
            ></v-text-field>
            <v-text-field
              v-model="schoolForm.email"
              label="Email"
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="schoolForm.phone"
              label="Phone"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showCreateSchoolDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="createSchool" :loading="creating">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create User Dialog -->
    <v-dialog v-model="showCreateUserDialog" max-width="500px">
      <v-card>
        <v-card-title>Create New User</v-card-title>
        <v-card-text>
          <v-form ref="userForm" v-model="userFormValid">
            <v-text-field
              v-model="userForm.name"
              label="Full Name"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="userForm.email"
              label="Email"
              type="email"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
              required
            ></v-text-field>
            <v-text-field
              v-model="userForm.username"
              label="Username"
              :rules="[v => !!v || 'Username is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="userForm.phone_number"
              label="Phone Number"
              :rules="[v => !!v || 'Phone number is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="userForm.password"
              label="Password"
              type="password"
              :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Password must be at least 6 characters']"
              required
            ></v-text-field>
            <v-select
              v-model="userForm.userType"
              :items="userTypes"
              label="User Type"
              :rules="[v => !!v || 'User type is required']"
              required
            ></v-select>
            <v-select
              v-model="userForm.school_id"
              :items="schools"
              item-title="name"
              item-value="id"
              label="School"
              :rules="[v => !!v || 'School is required']"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showCreateUserDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="createUser" :loading="creating">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { getAdminStatistics, getAdminSchools, createSchool, createAdminUser } from '@/api/admin'
import { fetchSchools } from '@/api/schools'
import { isSuperAdmin, getUserTypeDisplay } from '@/utils/auth'

const loading = ref(false)
const creating = ref(false)
const statistics = ref({})
const recentSchools = ref([])
const schools = ref([])

const showCreateSchoolDialog = ref(false)
const showCreateUserDialog = ref(false)
const schoolFormValid = ref(false)
const userFormValid = ref(false)

const schoolForm = ref({
  name: '',
  address: '',
  email: '',
  phone: ''
})

const userForm = ref({
  name: '',
  email: '',
  username: '',
  phone_number: '',
  password: '',
  userType: '',
  school_id: ''
})

const userTypes = [
  { title: 'Admin', value: 'admin' },
  { title: 'Client', value: 'client' }
]

const schoolHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Address', key: 'address' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const loadStatistics = async () => {
  try {
    const response = await getAdminStatistics()
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        statistics.value = response.data.data || response.data || {}
      }
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
  }
}

const loadSchools = async () => {
  try {
    loading.value = true
    const response = await fetchSchools()
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        const schoolsData = response.data.data || response.data || []
        recentSchools.value = schoolsData.slice(0, 5) // Show only 5 recent schools
        schools.value = schoolsData
      }
    }
  } catch (error) {
    console.error('Error loading schools:', error)
  } finally {
    loading.value = false
  }
}

const createSchool = async () => {
  if (!schoolFormValid.value) return

  try {
    creating.value = true
    const response = await createSchool(schoolForm.value)
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: 'School created successfully',
          type: 'success',
        })
        showCreateSchoolDialog.value = false
        schoolForm.value = { name: '', address: '', email: '', phone: '' }
        await loadSchools()
        await loadStatistics()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to create school',
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
    console.error('Error creating school:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to create school',
      type: 'error',
    })
  } finally {
    creating.value = false
  }
}

const createUser = async () => {
  if (!userFormValid.value) return

  try {
    creating.value = true
    const response = await createAdminUser(userForm.value)
    
    // Check if response exists and has data
    if (response && response.data) {
      // Check for success in different possible formats
      const isSuccess = response.data.success || response.data.message || response.status === 200
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: 'User created successfully',
          type: 'success',
        })
        showCreateUserDialog.value = false
        userForm.value = { name: '', email: '', username: '', phone_number: '', password: '', userType: '', school_id: '' }
        await loadStatistics()
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to create user',
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
    console.error('Error creating user:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to create user',
      type: 'error',
    })
  } finally {
    creating.value = false
  }
}

const editSchool = (school: any) => {
  // Navigate to school edit page
  // This would be implemented in a separate school management page
  console.log('Edit school:', school)
}

onMounted(async () => {
  await Promise.all([loadStatistics(), loadSchools()])
})
</script> 