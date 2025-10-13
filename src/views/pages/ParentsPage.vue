<script setup lang="ts">
import {ref, shallowRef, onMounted, reactive} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ParentsTable from "@/components/tables/ParentsTable.vue";
import { fetchParents, updateParent} from "@/api/parents";
import { fetchStudents } from "@/api/students";
import { useRoute } from "vue-router";
import {router} from "@/router";
import type {Parent} from "@/interface/parents";
import type {IFilter, IPagination} from "@/interface/shared";
import { ElNotification } from 'element-plus';
import { PlusOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const loading = ref(true);
const saving = ref(false);
const searchField = ref('');
const showEditModal = ref(false);
const showFilter = ref(true);
const dialog = ref(false);
const parents = ref<Parent[]>([])
const students = ref<any[]>([])
const selectedParent = ref<any>(null);
const page = ref({ title: 'Parents' });

const parentForm = reactive({
  id: null,
  name: '',
  student_id: null,
  phone_number: '',
  address: '',
  id_number: '',
  gender: '',
});
const pagination = reactive<IPagination>({
  total: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
});
const breadcrumbs = shallowRef([
  {
    title: 'Parents',
    disabled: true,
    href: '/parents'
  }
]);



onMounted(async () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
  await loadStudents();
})

const handleCreateItem = () => {
  router.replace(route.query.to ? String(route.query.to) : '/student/form');
};
const loadDataa = async (filter: IFilter) => {
  loading.value = true

  try {
    const response = await fetchParents(filter) 
    const data = response.data?.data
    parents.value = response.data?.data;
    if (data.per_page && data.total && data.current_page) {
      pagination.per_page = data.per_page ?? 0;
      pagination.total = data.total ?? 0;
      pagination.current_page = data.current_page;

      pagination.total_pages = (pagination.per_page > 0 && pagination.total > 0)
          ? Math.ceil(pagination.total / pagination.per_page)
          : 0;
    } else {
      pagination.total_pages = 0;
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}
const loadData = async (filter: IFilter) => {
  loading.value = true;
  try {
    const response = await fetchParents(filter);
   
    if (response.data?.data) {
      parents.value = response.data.data; 
    } else {
      parents.value = [];
    }

    const data = response.data;
    pagination.per_page = data.per_page ?? 10;
    pagination.total = data.total ?? 0;
    pagination.current_page = data.current_page ?? 1;
    pagination.total_pages = pagination.per_page > 0 ? Math.ceil(pagination.total / pagination.per_page) : 0;
  } catch (error) {
    console.error("Error fetching customers:", error);
  } finally {
    loading.value = false;
  }
};
const searcher = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc'
  }
  loadData(filter)
}
const refreshEvent = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
}

const handleApplyFilter = () => {

  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: searchField.value,
    searchFields: `name:like;tittle:like;location:like;subtitle:like;city:like;country:like;`,
  }
  loadData(filter);
};
const handleRefreshItem = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }

  loadData(filter);
};
const handleClear = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }

  loadData(filter);
};
const loadStudents = async () => {
  try {
    const response = await fetchStudents({});
    if (response && response.data) {
      students.value = response.data.data || response.data || [];
    }
  } catch (error) {
    console.error('Error loading students:', error);
  }
};

const handleEditParent = (parent: any) => {
  selectedParent.value = parent;
  Object.assign(parentForm, {
    id: parent.id,
    name: parent.name,
    student_id: parent.student_id,
    phone_number: parent.phone_number,
    address: parent.address || '',
    id_number: parent.id_number || '',
    gender: parent.gender || '',
  });
  showEditModal.value = true;
};

const saveParent = async () => {
  if (!parentForm.name || !parentForm.phone_number || !parentForm.student_id) {
    ElNotification({
      title: 'Validation Error',
      message: 'Please fill in all required fields',
      type: 'warning',
    });
    return;
  }

  try {
    saving.value = true;
    const response = await updateParent(parentForm.id, parentForm);
    
    if (response && response.data) {
      const isSuccess = response.data.success || response.status === 200;
      
      if (isSuccess) {
        ElNotification({
          title: 'Success',
          message: 'Parent updated successfully',
          type: 'success',
        });
        showEditModal.value = false;
        await loadData({ page: 1, orderBy: 'created_at', sortedBy: 'desc' });
      } else {
        ElNotification({
          title: 'Error',
          message: response.data.message || 'Failed to update parent',
          type: 'error',
        });
      }
    }
  } catch (error) {
    console.error('Error updating parent:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to update parent',
      type: 'error',
    });
  } finally {
    saving.value = false;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedParent.value = null;
};

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow>
    <VCol cols="12" md="12">
      <VCard>
        <VCardItem>
          <VRow class="d-flex justify-space-between">
            <VCol cols="4">
              <VTextField
                  variant="outlined"
                  placeholder="Type something"
                  hide-details
                  clearable
                  v-model="searchField"
                  class="search"
                  @keyup.enter="handleApplyFilter"
                  @click:prepend="showFilter = !showFilter"
                  @click:clear="handleClear"
              />
            </VCol>
           
          </VRow>
        </VCardItem>
        <VCardText class="pa-0 pb-5">
          <VDivider />
          <ParentsTable
            :parents="parents"
            :pagination="pagination"
            :dialog="dialog"
            :loading="loading"
            @form:cancel="dialog = false"
            @edit:parent="handleEditParent"
          />
        </VCardText>
      </VCard>

      <!-- Edit Parent Modal -->
      <v-dialog v-model="showEditModal" max-width="600px" persistent>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center pa-4 bg-gradient-primary">
            <span class="text-h5 text-white font-weight-bold">Edit Parent</span>
            <v-btn icon="mdi-close" variant="text" color="white" @click="closeEditModal"></v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="parentForm.name"
                    label="Parent Name *"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="parentForm.student_id"
                    :items="students"
                    item-title="name"
                    item-value="id"
                    label="Student *"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account-school"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="parentForm.phone_number"
                    label="Phone Number *"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-phone"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="parentForm.id_number"
                    label="ID Number"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-card-account-details"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="parentForm.gender"
                    :items="['male', 'female', 'other']"
                    label="Gender"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-gender-male-female"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="parentForm.address"
                    label="Address"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="closeEditModal"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :loading="saving"
              @click="saveParent"
            >
              Update Parent
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </VCol>
  </VRow>
</template>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
