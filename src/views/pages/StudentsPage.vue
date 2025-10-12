<script setup lang="ts">
import {ref, shallowRef, onMounted, reactive, watch} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import StudentsTable from "@/components/tables/StudentsTable.vue";
import { fetchStudents} from "@/api/students";
import { useRoute } from "vue-router";
import {router} from "@/router";
import type {Student} from "@/interface/students";
import type {IFilter, IPagination} from "@/interface/shared";
import UploadStudentModal from "@/components/modals/UploadStudentModal.vue";
import { exportStudents } from "@/api/students";
import { fetchClasses } from "@/api/classes";
import { FilterOutlined, PlusOutlined, CloudUploadOutlined } from '@ant-design/icons-vue';


const route = useRoute();
const loading = ref(true);
const loadingClasses = ref(false);
const searchField = ref('');
const showUploadModal = ref(false);
const showFilter = ref(false);
const dialog = ref(false);
const students = ref<Student[]>([])
const classes = ref([])
const page = ref({ title: 'Students' });

// Filter form
const filterForm = reactive({
  class_id: null,
  name: '',
});
const pagination = reactive<IPagination>({
  total: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
});
const breadcrumbs = shallowRef([
  {
    title: 'Students',
    disabled: true,
    href: '/students'
  }
]);



onMounted(async () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
  await loadClasses();
})

const handleCreateItem = () => {
  router.replace(route.query.to ? String(route.query.to) : '/student/form');
};
const loadDataa = async (filter: IFilter) => {
  loading.value = true

  try {
    const response = await fetchStudents(filter) 
    const data = response.data?.data
    students.value = response.data?.data;
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
    const response = await fetchStudents(filter);
   
    if (response.data?.data) {
      students.value = response.data.data; 
    } else {
      students.value = [];
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
const handleUploadStudent = () => {
  showUploadModal.value = true;
};

const loadClasses = async () => {
  try {
    loadingClasses.value = true;
    const response = await fetchClasses({});
    if (response && response.data) {
      classes.value = response.data.data || response.data || [];
    }
  } catch (error) {
    console.error('Error loading classes:', error);
  } finally {
    loadingClasses.value = false;
  }
};

watch(() => filterForm.class_id, () => {
  applyFilter();
});

watch(() => filterForm.name, () => {
  if (filterForm.name.length >= 2 || filterForm.name.length === 0) {
    applyFilter();
  }
});

const applyFilter = () => {
  const filter: any = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  };

  if (filterForm.class_id) {
    filter.class_id = filterForm.class_id;
  }

  if (filterForm.name) {
    filter.search = filterForm.name;
    filter.searchFields = 'name:like';
  }

  loadData(filter);
};

const clearFilter = () => {
  filterForm.class_id = null;
  filterForm.name = '';
  searchField.value = '';
  showFilter.value = false;
  
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  };
  loadData(filter);
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const handleExportPdf = async () => {
  try {
    const response = await exportStudents();
    
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students-report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to export PDF:', response);
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
  } 
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  
  <VRow>
    <VCol cols="12">
      <!-- Filter Card -->
      <VCard class="mb-4" elevation="2">
        <VCardTitle class="d-flex justify-space-between align-center pa-4 bg-light-primary">
          <div class="d-flex align-center">
            <VIcon size="24" color="primary" class="mr-2">mdi-filter-variant</VIcon>
            <span class="text-h6 font-weight-bold">Filter Students</span>
          </div>
          <VBtn
            :icon="showFilter ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="text"
            @click="toggleFilter"
          ></VBtn>
        </VCardTitle>
        
        <VExpandTransition>
          <VCardText v-show="showFilter" class="pa-4">
            <VRow>
              <!-- Class Filter -->
              <VCol cols="12" md="4">
                <VSelect
                  v-model="filterForm.class_id"
                  :items="classes"
                  :loading="loadingClasses"
                  item-title="name"
                  item-value="id"
                  label="Filter by Class"
                  placeholder="All Classes"
                  variant="outlined"
                  density="comfortable"
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <VIcon color="primary">mdi-google-classroom</VIcon>
                  </template>
                </VSelect>
              </VCol>

              <!-- Name Search -->
              <VCol cols="12" md="5">
                <VTextField
                  v-model="filterForm.name"
                  label="Search by Name"
                  placeholder="Type student name..."
                  variant="outlined"
                  density="comfortable"
                  clearable
                  prepend-inner-icon="mdi-magnify"
                ></VTextField>
              </VCol>

              <!-- Action Buttons -->
              <VCol cols="12" md="3" class="d-flex align-center gap-2">
                <VBtn
                  color="primary"
                  variant="flat"
                  block
                  size="large"
                  prepend-icon="mdi-filter"
                  @click="applyFilter"
                >
                  Apply
                </VBtn>
                <VBtn
                  color="grey"
                  variant="outlined"
                  size="large"
                  icon="mdi-refresh"
                  @click="clearFilter"
                  title="Clear filters"
                ></VBtn>
              </VCol>
            </VRow>

            <!-- Active Filters Display -->
            <VRow v-if="filterForm.class_id || filterForm.name" class="mt-2">
              <VCol cols="12">
                <div class="d-flex align-center gap-2 flex-wrap">
                  <span class="text-subtitle-2 font-weight-medium">Active Filters:</span>
                  <VChip
                    v-if="filterForm.class_id"
                    closable
                    color="primary"
                    size="small"
                    @click:close="filterForm.class_id = null; applyFilter()"
                  >
                    Class: {{ classes.find(c => c.id === filterForm.class_id)?.name }}
                  </VChip>
                  <VChip
                    v-if="filterForm.name"
                    closable
                    color="info"
                    size="small"
                    @click:close="filterForm.name = ''; applyFilter()"
                  >
                    Name: "{{ filterForm.name }}"
                  </VChip>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VExpandTransition>
      </VCard>

      <!-- Main Students Card -->
      <VCard>
        <VCardItem>
          <VRow class="d-flex justify-space-between align-center">
            <VCol cols="12" md="4">
              <VTextField
                v-model="searchField"
                variant="outlined"
                placeholder="Quick search..."
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
                @keyup.enter="handleApplyFilter"
                @click:clear="handleClear"
              />
            </VCol>
            <VCol cols="12" md="8" class="d-flex justify-end gap-2">
              <VBtn
                color="secondary"
                variant="outlined"
                @click="toggleFilter"
              >
                <template v-slot:prepend>
                  <FilterOutlined />
                </template>
                {{ showFilter ? 'Hide' : 'Show' }} Filters
              </VBtn>
              <VBtn
                @click="handleExportPdf"
                color="secondary"
              >
                <template v-slot:prepend>
                  <CloudUploadOutlined />
                </template>
                Download
              </VBtn>
              <VBtn
                @click="handleUploadStudent"
                color="info"
              >
                <template v-slot:prepend>
                  <CloudUploadOutlined />
                </template>
                Upload
              </VBtn>
              <VBtn
                @click="handleCreateItem"
                color="primary"
              >
                <template v-slot:prepend>
                  <PlusOutlined />
                </template>
                Add Student
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardText class="pa-0 pb-5">
          <VDivider />
          <StudentsTable
            :students="students"
            :pagination="pagination"
            :dialog="dialog"
            :loading="loading"
            @form:cancel="dialog = false"
          />
        </VCardText>
      </VCard>
      <UploadStudentModal v-if="showUploadModal" @close="showUploadModal = false" />
    </VCol>
  </VRow>
</template>

<style scoped>
.bg-light-primary {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.12) 100%);
}
</style>
