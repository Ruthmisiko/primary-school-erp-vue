<script setup lang="ts">

import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import {ref, onMounted, reactive, computed } from "vue";
import {useRoute} from "vue-router";
import {getClass} from "@/api/classes";
import {removeStudent, printResult} from "@/api/students";
import {ElMessage, ElMessageBox} from "element-plus";
import {router} from "@/router";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';

const page = ref({ title: 'View Class' });
const route = useRoute()
const breadcrumbs = ref([
  {
    title: 'class',
    disabled: false,
    href: '/class'
  },
  {
    title: 'View',
    disabled: true,
    href: '#'
  }
]);
const class_id = ref('')
const loading = ref(false)
const classs = ref([])
const tab = ref()

onMounted(async () => {
 class_id.value = <string>route.params.id

  if (class_id.value) {
    await loadClass();
  }
})


const headers = reactive([
  { title: '#', key: 'index' },
  { title: 'STUDENTS NAME', key: 'name' },
  { title: 'PARENT', key: 'parent' },
  { title: 'AGE', key: 'age' },
  { title: 'PAID FEE', key: 'fee_balance' },
  { title: 'FEE BALANCE', key: 'paid_fee' },
  { title: 'ACTION', key: 'action' },
]);

const emit = defineEmits(['form:cancel','refresh-student']);
const changesInTab = () => {
  console.log(tab.value)
}

const loadClass =  async () => {
  loading.value = true
  try {
    const response = await getClass(class_id.value);
    if (response.data.success) {
      classs.value = response.data.data;
    } else {
      console.error("Failed to fetch class:", response.data.message);
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

const loadStudents=  async () => {
  loading.value = true
  try {
    const response = await getClass(class_id.value);
    if (response.data.success) {
      classs.value = response.data.data;
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

const formattedStudents = computed(() => {
  if (!classs.value || !classs.value.students) {
    return [];
  }

  return classs.value.students.map((student: any, index: number) => ({
    id: student.id,
    index: index + 1,
    name: student.name,
    parent: student.parent,
    age: student.age,
    fee_balance: student.fee_balance,
    paid_fee: student.paid_fee
  }));
});

const totalStudents = computed(() => {
  return classs.value?.students?.length || 0;
});

const handleDeleteItem = (student: any) => {
  ElMessageBox.confirm(
      `Delete #${student.name} will be deleted. Continue ?`,
      'Delete Student',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error',
        center: true,
      }
  )
      .then(async () => {
        const response = await removeStudent(student.id);
        if (response.data.success) {
          ElMessage({
            type: 'success',
            message: response.data.message,
          });
          emit('refresh-student');
        }
        else {
          ElMessage({
            type: 'error',
            message: response.data.message,
          });
        }
      })
};

const handlePrintItem = async (studentId: string) => {
  try {
    const response = await printResult(studentId);

    if (response && response.status === 200) {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student-result-${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      ElMessage.error("Failed to download result. Please try again.");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("An error occurred while printing the result.");
  }
};

const handleViewItem = (id: string) => {
  router.push(`/view/student/${id}`)
};
</script>

<template>

  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <VCard>
    <VCol>
      <VTabs @update:modelValue="changesInTab" color="primary" v-model="tab">
        <VTab value="personal_details"> Class Information</VTab>
        <VTab value="students"> Students</VTab>
        <VTab value="reports"> Reports</VTab>
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
                    <h4><b>Class Name</b> </h4>
                    <p>
                      {{ classs?.name }}
                    </p>
                    <h4><b>Total Students</b></h4>
                    <p>{{ totalStudents }}</p>
                  </VCol>
                
                </VRow>
                
              </VSheet>
            </VCol>
         
          </VRow> 
          </VTabsWindowItem>

          <VTabsWindowItem value="students">
            <VDataTable
                :headers="headers"
                :items="formattedStudents"
                :loading="loading"
                height="450"
                fixed-header
            >
            <template #item.action="{ item }">
      <VMenu>
        <template #activator="{ props }">
          <VBtn v-bind="props" color="primary" size="large" variant="tonal" density="compact" :icon="true">
            <MoreOutlined />
          </VBtn>
        </template>
        <VList>
          
          <VListItem @click="handlePrintItem(item.id)">
            <EditOutlined /> <span>PRINT RESULT</span>
          </VListItem>
          <VListItem @click="handleViewItem(item.id)">
            <EyeOutlined /> <span>VIEW</span>
          </VListItem>
          <VListItem @click="handleDeleteItem(item)">
            <DeleteOutlined /> <span>DELETE</span>
          </VListItem>
        </VList>
      </VMenu>
    </template>
            </VDataTable>
           
          </VTabsWindowItem>

          
        </VTabsWindow>
      </VCardText>
    </VCol>
  </VCard>
</template>

<style lang="scss">

</style>