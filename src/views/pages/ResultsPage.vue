<script setup lang="ts">
import {ref, shallowRef, onMounted, reactive, watch} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ResultsTable from "@/components/tables/ResultsTable.vue";
import { fetchResults} from "@/api/results";
import { useRoute } from "vue-router";
import {router} from "@/router";
import type {Result} from "@/interface/result";
import type {IFilter, IPagination} from "@/interface/shared";
import UploadResultModal from "@/components/modals/UploadResultModal.vue";
import { fetchClasses } from "@/api/classes";
import { fetchSubjects } from "@/api/subjects";
import { FilterOutlined, PlusOutlined } from '@ant-design/icons-vue';


const route = useRoute();
const loading = ref(true);
const loadingClasses = ref(false);
const loadingSubjects = ref(false);
const searchField = ref('')
const showFilter = ref(false);
const showUploadModal = ref(false);
const dialog = ref(false);
const results = ref<Result[]>([])
const classes = ref([])
const subjects = ref([])
const filteredSubjects = ref([])
const page = ref({ title: 'Results' });

// Filter form
const filterForm = reactive({
  class_id: null,
  subject_id: null,
});
const pagination = reactive<IPagination>({
  total: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
});
const breadcrumbs = shallowRef([
  {
    title: 'Results',
    disabled: true,
    href: '/results'
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
  await loadSubjects();
})

const handleCreateItem = () => {
  router.replace(route.query.to ? String(route.query.to) : '/result/form');
};

const loadData = async (filter: IFilter) => {
  loading.value = true;
  try {
    const response = await fetchResults(filter);
    
    console.log('Results API Response:', response);
    console.log('Applied filters:', filter);
   
    if (response && response.data) {
      if (response.data?.data) {
        results.value = response.data.data;
      } else if (Array.isArray(response.data)) {
        results.value = response.data;
      } else {
        results.value = [];
      }

      console.log('Results loaded:', results.value.length, 'items');

      const data = response.data;
      pagination.per_page = data.per_page ?? 10;
      pagination.total = data.total ?? results.value.length;
      pagination.current_page = data.current_page ?? 1;
      pagination.total_pages = pagination.per_page > 0 ? Math.ceil(pagination.total / pagination.per_page) : 0;
    } else {
      results.value = [];
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    results.value = [];
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

const handleUploadResult = () => {
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

const loadSubjects = async () => {
  try {
    loadingSubjects.value = true;
    const response = await fetchSubjects({});
    if (response && response.data) {
      subjects.value = response.data.data || response.data || [];
      filteredSubjects.value = subjects.value; // Initially show all subjects
    }
  } catch (error) {
    console.error('Error loading subjects:', error);
  } finally {
    loadingSubjects.value = false;
  }
};

// Watch for class selection to filter subjects if needed
watch(() => filterForm.class_id, (newClassId) => {
  if (newClassId) {
    // You can filter subjects by class if your API supports it
    // For now, show all subjects
    filteredSubjects.value = subjects.value;
    
    // Auto-apply filter when class changes
    applyFilter();
  } else {
    // Reset subject when class is cleared
    filterForm.subject_id = null;
    filteredSubjects.value = subjects.value;
  }
});

// Watch for subject selection to auto-apply filter
watch(() => filterForm.subject_id, (newSubjectId) => {
  if (newSubjectId && filterForm.class_id) {
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

  if (filterForm.subject_id) {
    filter.subject_id = filterForm.subject_id;
  }

  if (searchField.value) {
    filter.search = searchField.value;
  }

  loadData(filter);
};

const clearFilter = () => {
  filterForm.class_id = null;
  filterForm.subject_id = null;
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
            <span class="text-h6 font-weight-bold">Filter Results</span>
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
                  label="Select Class"
                  placeholder="Choose a class..."
                  variant="outlined"
                  density="comfortable"
                  clearable
                  prepend-inner-icon="mdi-google-classroom"
                >
                  <template v-slot:prepend-inner>
                    <VIcon color="primary">mdi-google-classroom</VIcon>
                  </template>
                </VSelect>
              </VCol>

              <!-- Subject Filter -->
              <VCol cols="12" md="4">
                <VSelect
                  v-model="filterForm.subject_id"
                  :items="filteredSubjects"
                  :loading="loadingSubjects"
                  :disabled="!filterForm.class_id"
                  item-title="name"
                  item-value="id"
                  label="Select Subject"
                  placeholder="Choose a subject..."
                  variant="outlined"
                  density="comfortable"
                  clearable
                  prepend-inner-icon="mdi-book-open-page-variant"
                >
                  <template v-slot:prepend-inner>
                    <VIcon color="success">mdi-book-open-page-variant</VIcon>
                  </template>
                </VSelect>
              </VCol>

              <!-- Action Buttons -->
              <VCol cols="12" md="4" class="d-flex align-center gap-2">
                <VBtn
                  color="primary"
                  variant="flat"
                  block
                  size="large"
                  prepend-icon="mdi-filter"
                  @click="applyFilter"
                  :disabled="!filterForm.class_id && !filterForm.subject_id"
                >
                  Apply Filter
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
            <VRow v-if="filterForm.class_id || filterForm.subject_id" class="mt-2">
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
                    v-if="filterForm.subject_id"
                    closable
                    color="success"
                    size="small"
                    @click:close="filterForm.subject_id = null; applyFilter()"
                  >
                    Subject: {{ subjects.find(s => s.id === filterForm.subject_id)?.name }}
                  </VChip>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VExpandTransition>
      </VCard>

      <!-- Main Results Card -->
      <VCard>
        <VCardItem>
          <VRow class="d-flex justify-space-between align-center">
            <VCol cols="12" md="4">
              <VTextField
                v-model="searchField"
                variant="outlined"
                placeholder="Search results..."
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
                @keyup.enter="applyFilter"
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
                @click="handleUploadResult"
                color="info"
              >
                <template v-slot:prepend>
                  <PlusOutlined />
                </template>
                Upload Results
              </VBtn>
              <VBtn
                @click="handleCreateItem"
                color="primary"
              >
                <template v-slot:prepend>
                  <PlusOutlined />
                </template>
                Add Result
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardText class="pa-0 pb-5">
          <VDivider />
          <ResultsTable
            :results="results"
            :pagination="pagination"
            :dialog="dialog"
            :loading="loading"
            @form:cancel="dialog = false"
          />
        </VCardText>
      </VCard>
      <UploadResultModal v-if="showUploadModal" @close="showUploadModal = false" />
    </VCol>
  </VRow>
</template>

<style scoped>
.bg-light-primary {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.12) 100%);
}

.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.3s ease;
}
</style>
