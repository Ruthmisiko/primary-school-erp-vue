<script setup lang="ts">
import { ref, shallowRef, onMounted, reactive } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ExpensesTable from "@/components/tables/ExpensesTable.vue";
import ExpenseFormModal from "@/components/forms/ExpenseFormModal.vue";
import { fetchExpenses } from "@/api/expenses";
import { useRoute } from "vue-router";
import type { Expense } from "@/interface/expenses";
import type { IFilter, IPagination } from "@/interface/shared";
import { PlusOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const loading = ref(true);
const searchField = ref('');
const showFilter = ref(true);
const dialog = ref(false);
const showExpenseModal = ref(false);
const selectedExpense = ref<Expense | null>(null);
const isEditing = ref(false);
const expenses = ref<Expense[]>([])
const page = ref({ title: 'Expenses' });
const pagination = reactive<IPagination>({
  total: 0,
  per_page: 0,
  current_page: 0,
  total_pages: 0,
});
const breadcrumbs = shallowRef([
  {
    title: 'Expenses',
    disabled: true,
    href: '/expenses'
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
  selectedExpense.value = null;
  isEditing.value = false;
  showExpenseModal.value = true;
};

const handleEditItem = (expense: Expense) => {
  selectedExpense.value = expense;
  isEditing.value = true;
  showExpenseModal.value = true;
};

const handleExpenseSaved = () => {
  showExpenseModal.value = false;
  selectedExpense.value = null;
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
    const response = await fetchExpenses(filter);
   
    if (response.data?.data) {
      expenses.value = response.data.data; 
    } else {
      expenses.value = [];
    }

    const data = response.data;
    pagination.per_page = data.per_page ?? 10;
    pagination.total = data.total ?? 0;
    pagination.current_page = data.current_page ?? 1;
    pagination.total_pages = pagination.per_page > 0 ? Math.ceil(pagination.total / pagination.per_page) : 0;
  } catch (error) {
    console.error("Error fetching expenses:", error);
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
    searchFields: `category:like;description:like;payment_method:like;`,
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
                placeholder="Search expenses..."
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
                Add Expense
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardText class="pa-0 pb-5">
          <VDivider />
          <ExpensesTable
            :expenses="expenses"
            :pagination="pagination"
            :dialog="dialog"
            :loading="loading"
            @form:cancel="dialog = false"
            @edit:item="handleEditItem"
            @refresh-expense="handleRefreshItem"
          />
        </VCardText>
      </VCard>
      
      <!-- Expense Form Modal -->
      <ExpenseFormModal 
        v-model="showExpenseModal" 
        :expense="selectedExpense"
        :is-editing="isEditing"
        @saved="handleExpenseSaved"
      />
    </VCol>
  </VRow>
</template>
