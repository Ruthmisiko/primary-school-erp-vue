<script setup lang="ts">
import {ref, shallowRef, onMounted, reactive} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import StudentsTable from "@/components/tables/StudentsTable.vue";
import { fetchStudents} from "@/api/students";
import { useRoute } from "vue-router";
import {router} from "@/router";
import type {Student} from "@/interface/students";
import type {IFilter, IPagination} from "@/interface/shared";
import UploadStudentModal from "@/components/modals/UploadStudentModal.vue";

const route = useRoute();
const loading = ref(true);
const searchField = ref('');
const showUploadModal = ref(false);
const showFilter = ref(true);
const dialog = ref(false);
const students = ref<Student[]>([])
const page = ref({ title: 'Students' });
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



onMounted(() => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
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
            <VCol class="d-flex justify-end">
              <VBtn
                @click="handleUploadStudent"
                color="info"
                class="mr-4"
              >
                <template v-slot:prepend>
                  <CloudUploadOutlined />
                </template>
                Upload Student
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
