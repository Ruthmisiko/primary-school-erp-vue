<script setup lang="ts">
import { ref, shallowRef, onMounted, reactive } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import SuppliersTable from "@/components/tables/SuppliersTable.vue";
import SupplierFormModal from "@/components/forms/SupplierFormModal.vue";
import { fetchSuppliers } from "@/api/suppliers";
import { useRoute } from "vue-router";
import type { Supplier } from "@/interface/suppliers";
import type { IFilter, IPagination } from "@/interface/shared";
import { PlusOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const loading = ref(true);
const searchField = ref('');
const showFilter = ref(true);
const dialog = ref(false);
const showSupplierModal = ref(false);
const selectedSupplier = ref<Supplier | null>(null);
const isEditing = ref(false);
const suppliers = ref<Supplier[]>([])
const page = ref({ title: 'Suppliers' });
const pagination = reactive<IPagination>({
  total: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
});
const breadcrumbs = shallowRef([
  {
    title: 'Suppliers',
    disabled: true,
    href: '/suppliers'
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
  selectedSupplier.value = null;
  isEditing.value = false;
  showSupplierModal.value = true;
};

const handleEditItem = (supplier: Supplier) => {
  selectedSupplier.value = supplier;
  isEditing.value = true;
  showSupplierModal.value = true;
};

const handleSupplierSaved = () => {
  showSupplierModal.value = false;
  selectedSupplier.value = null;
  isEditing.value = false;
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
};

const loadData = async (filter: IFilter) => {
  loading.value = true;
  try {
    const response = await fetchSuppliers(filter);
   
    if (response.data?.data) {
      suppliers.value = response.data.data; 
    } else {
      suppliers.value = [];
    }

    const data = response.data;
    pagination.per_page = data.per_page ?? 10;
    pagination.total = data.total ?? 0;
    pagination.current_page = data.current_page ?? 1;
    pagination.total_pages = pagination.per_page > 0 ? Math.ceil(pagination.total / pagination.per_page) : 0;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  } finally {
    loading.value = false;
  }
};

const handleApplyFilter = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: searchField.value,
    searchFields: `name:like;category:like;contact_person:like;email:like;phone:like;`,
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
  searchField.value = '';
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
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
                placeholder="Search suppliers..."
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
                @click="handleCreateItem"
                color="primary"
              >
                <template v-slot:prepend>
                  <PlusOutlined />
                </template>
                Add Supplier
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardText class="pa-0 pb-5">
          <VDivider />
          <SuppliersTable
            :suppliers="suppliers"
            :pagination="pagination"
            :dialog="dialog"
            :loading="loading"
            @form:cancel="dialog = false"
            @edit:item="handleEditItem"
            @refresh-supplier="handleRefreshItem"
          />
        </VCardText>
      </VCard>
      
      <!-- Supplier Form Modal -->
      <SupplierFormModal 
        v-model="showSupplierModal" 
        :supplier="selectedSupplier"
        :is-editing="isEditing"
        @saved="handleSupplierSaved"
      />
    </VCol>
  </VRow>
</template>
