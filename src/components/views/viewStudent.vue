<script setup lang="ts">

import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import {ref, onMounted, reactive, computed } from "vue";
import {useRoute} from "vue-router";
import {getStudent} from "@/api/students";


const page = ref({ title: 'View Student' });
const route = useRoute()
const breadcrumbs = ref([
  {
    title: 'student',
    disabled: false,
    href: '/student'
  },
  {
    title: 'View',
    disabled: true,
    href: '#'
  }
]);
const student_id = ref('')
const loading = ref(false)
const student = ref([])
const tab = ref()

onMounted(async () => {
 student_id.value = <string>route.params.id

  if (student_id.value) {
    await loadStudent();
  }
})

const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'SUBJECTS', key: 'subject_id' },
  { title: 'TOTAL MARKS', key: 'marks_obtained' },
  { title: 'GRADE', key: 'grade' },


]);

const scheme_headers = reactive([
  { title: '#', key: 'index' },
  { title: 'SCHEME', key: 'scheme_id' },
  { title: 'DEPARTMENT', key: 'department_id' },
  { title: 'SPECIALIZATION', key: 'speciality_id' },
  { title: 'DOCTOR FEE TYPE', key: 'service_id' },
  { title: 'AMOUNT', key: 'value' },
  { title: 'EFFECTIVE DATE', key: 'effective_date' },
]);

const changesInTab = () => {
  console.log(tab.value)
}

const loadStudent =  async () => {
  loading.value = true
  try {
    const response = await getStudent(student_id.value);
    if (response.data.success) {
      student.value = response.data.data;
    } else {
      console.error("Failed to fetch student:", response.data.message);
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

const loadResults=  async () => {
  loading.value = true
  try {
    const response = await getStudent(student_id.value);
    if (response.data.success) {
      student.value = response.data.data;
    } else {
      console.error("Failed to fetch Personal Information:", response.data.message);
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

const formattedResults = computed(() => {
  if (!student.value || !student.value.results) {
    return [];
  }

  return student.value.results.map((result: any, index: number) => ({
    
    index: index + 1,
    subject_id: result?.subject?.name || student.value.sclass?.name || "N/A",
    marks_obtained: result.marks_obtained,
    grade: result.marks_obtained,
  }));
});

</script>

<template>

  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <VCard>
    <VCol>
      <VTabs @update:modelValue="changesInTab" color="primary" v-model="tab">
        <VTab value="personal_details"> Personal Information</VTab>
        <VTab value="results"> Results</VTab>
        <!-- <VTab value="reports"> Reports</VTab> -->
      </VTabs>
      <VDivider/>
      <VCardText>
        <VTabsWindow v-model="tab">
          <VTabsWindowItem value="personal_details">
            <VRow class="mt-1">
            <VCol>    
              <VSheet class="pa-2 ma-2">                        
                <VRow class="mt-1">
                  <VCol>
                    <h4>Student Name </h4>
                    <p>
                      {{ student?.name }}
                    </p>
                  </VCol>
                </VRow>
                <VRow class="mt-1">
                  <VCol>
                    <h4>Class </h4>
                    <p>
                      {{ student?.sclass?.name}}
                    </p>
                  </VCol>
                </VRow>
              </VSheet>
            </VCol>
            <VCol>    
              <VSheet class="pa-2 ma-2">                        
                <VRow class="mt-1">
                  <VCol>
                    <h4>Age</h4>
                    <p>
                      {{ student?.age}}
                    </p>
                  </VCol>
                </VRow>
                <VRow class="mt-1">
                  <VCol>
                    <h4>Parent </h4>
                    <p>
                      {{ student?.parent }}
                    </p>
                  </VCol>
                </VRow>
              </VSheet>
            </VCol>
            <VCol>    
              <VSheet class="pa-2 ma-2">                        
                <VRow class="mt-1">
                  <VCol>
                    <h4>Age</h4>
                    <p>
                      {{ student?.age}}
                    </p>
                  </VCol>
                </VRow>
                <VRow class="mt-1">
                  <VCol>
                    <h4>Parent </h4>
                    <p>
                      {{ student?.parent }}
                    </p>
                  </VCol>
                </VRow>
              </VSheet>
            </VCol>
            <VCol>    
              <VSheet class="pa-2 ma-2">                        
                <VRow class="mt-1">
                  <VCol>
                    <h4>Age</h4>
                    <p>
                      {{ student?.age}}
                    </p>
                  </VCol>
                </VRow>
                <VRow class="mt-1">
                  <VCol>
                    <h4>Parent </h4>
                    <p>
                      {{ student?.parent }}
                    </p>
                  </VCol>
                </VRow>
              </VSheet>
            </VCol>
          </VRow> 
          </VTabsWindowItem>

          <VTabsWindowItem value="results">
            <VDataTable
                :headers="headers"
                :items="formattedResults"
                :loading="loading"
                height="450"
                fixed-header
            >
            </VDataTable>
          </VTabsWindowItem>

          <VTabsWindowItem value="reports">
            <VDataTable
                :headers="scheme_headers"
                :loading="loading"
                height="450"
                fixed-header
            >
            </VDataTable>
          </VTabsWindowItem>
        </VTabsWindow>
      </VCardText>
    </VCol>
  </VCard>
</template>

<style lang="scss">

</style>