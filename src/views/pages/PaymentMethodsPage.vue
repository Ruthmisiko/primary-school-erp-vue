<script setup lang="ts">
import {ref, shallowRef, onMounted, reactive} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import PaymentMethodsTable from "@/components/tables/PaymentMethodsTable.vue";
import { fetchMethods} from "@/api/paymentMethods";
import { useRoute } from "vue-router";
import {router} from "@/router";
import type {PaymentMethod} from "@/interface/paymentMethods";
import type {IFilter, IPagination} from "@/interface/shared";

const route = useRoute();
const loading = ref(true);
const searchField = ref('')
const showFilter = ref(true);
const dialog = ref(false);
const methods = ref<PaymentMethod[]>([])
const page = ref({ title: 'Payment Methods' });
const pagination = reactive<IPagination>({
  total: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
});
const breadcrumbs = shallowRef([
  {
    title: 'Payment Methods',
    disabled: true,
    href: '/payment-methods'
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
  router.replace(route.query.to ? String(route.query.to) : '/payment-method/form');
};

const loadData = async (filter: IFilter) => {
  loading.value = true;
  try {
    const response = await fetchMethods(filter);
   
    if (response.data?.data) {
      methods.value = response.data.data; 
    } else {
      methods.value = [];
    }

    const data = response.data;
    pagination.per_page = data.per_page ?? 10;
    pagination.total = data.total ?? 0;
    pagination.current_page = data.current_page ?? 1;
    pagination.total_pages = pagination.per_page > 0 ? Math.ceil(pagination.total / pagination.per_page) : 0;
  } catch (error) {
    console.error("Error fetching methods:", error);
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
                  @click="handleCreateItem"
                  color="primary"
              >
                <template v-slot:prepend>
                  <PlusOutlined />
                </template>
                Add Payment Method
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardText class="pa-0 pb-5">
          <VDivider />
          <PaymentMethodsTable
            :methods="methods"
            :pagination="pagination"
            :dialog="dialog"
            :loading="loading"
            @form:cancel="dialog = false"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
