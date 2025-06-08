<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {createTeacher , updateTeacher , getTeacher} from "@/api/teachers";
import {fetchClasses} from "@/api/classes";
import {fetchSubjects} from "@/api/subjects";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { Teacher } from '@/interface/teachers';
import type { IFilter } from '@/interface/shared';
import { de } from 'element-plus/es/locale/index.mjs';

const sub_loading = ref(false)
const isLoading = ref(true);
const route = useRoute()
const refForm = ref()
const classes = ref([]);
const subjects = ref([]);
const router = useRouter();
const page = ref({ title: 'Teacher Form' });
const gender = ref([
  {name: 'Male', id:'Male'},
  {name:'Female',id:'Female'},
])

const designation = ref([
  {name: 'Teacher', id:'teacher'},
  {name:'Head Teacher',id:'head_teacher'},
  {name:'Deputy HeadTeacher',id:'deputy_head_teacher'},
  {name:'Senior Teacher',id:'head_teacher'},
  {name:'Class Teacher',id:'class_teacher'},
  {name:'HOD',id:'hod'},
]);
const breadcrumbs = shallowRef([
  {
    title: 'Teachers',
    disabled: false,
    href: '#'
  },
  {
    title: 'Teacher Form',
    disabled: true,
    href: '#'
  }
]);

const form = reactive<Teacher>({
  id:'',
  name: '',
  gender: '',
  contact_number: '',
  designation: '',
  email: '',
  assigned_class:'',
  subjects: []

})


onMounted(async () => {

form.id = <string>route.params.id
if(form.id){
  await fetchTeacher();
}
const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);
  loadSubjects(filter);

})
const loadData = async (filter: IFilter) => {

  try {
    const response = await fetchClasses('filter');

    if (response.data?.data) {
      classes.value = response.data.data;
    } else {
      classes.value = [];
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};

const loadSubjects = async (filter: IFilter) => {

try {
  const response = await fetchSubjects('filter');

  if (response.data?.data) {
    subjects.value = response.data.data;
  } else {
    subjects.value = [];
  }
} catch (error) {
  console.error("Error fetching classes:", error);
}
};

const fetchTeacher= async () => {
  isLoading.value = true
  try {
    getTeacher(form.id).then(response => {
      if (response?.data?.success) {
        form.name=response?.data?.data?.name;
        form.contact_number=response?.data?.data?.contact_number;
        form.email=response?.data?.data?.email;
        form.gender=response?.data?.data?.gender;
        form.assigned_class=response?.data?.data?.assigned_class;
        form.designation=response?.data?.data?.designation;
        form.subjects=response?.data?.data?.subjects;
      }
      else { console.log(response) }
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}
const handleErrors = (data: any) => {
  Object.values(data.errors).forEach((val: any) => {
    ElNotification({ title: "Error", message: val[0], type: "error" });
  });
};

const submitForm = async () => {
  sub_loading.value = true;
  try {
    if (route.params.id) {
      
      await updateTeacher(route.params.id as string, form).then(data => {
        if (data.data.success) {
          ElNotification({ 
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/teachers');
        } else {
          sub_loading.value = false;
          handleErrors(data);
        }
      });
    } else {
    
      await createTeacher(form).then(data => {
        if (data.data.success) {
          ElNotification({
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/teachers');
        } else {
          sub_loading.value = false;
          handleErrors(data);
        }
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    sub_loading.value = false;
  }
};

const requiredRule = ref<Array<(value: string) => boolean | string>>([
  value => {
    if (value)
      return true

    return 'Field is required.'
  },
])

</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Student Form">
        <VCard>
          <VCol>
            <VForm  ref="refForm"  @submit.prevent="submitForm">
              <VRow>
                <!-- 👉 User Name -->
                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.name"
                      label="Teachers name"
                      variant="outlined"
                      placeholder="Name"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>           

                <VCol
                    cols="12"
                    md="6"
                >
                <VTextField
                      v-model="form.contact_number"
                      label="Phone Number"
                      variant="outlined"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>
                <VCol
                    cols="12"
                    md="6"
                >
                <VSelect
                      v-model="form.gender"
                      label="gender"
                      :items="gender"
                      item-title="name"
                      clearable
                      item-value="id"
                      variant="outlined"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>

                <VCol
                    cols="12"
                    md="6"
                >
                <VSelect
                      v-model="form.designation"
                      label="designation"
                      :items="designation"
                      item-title="name"
                      clearable
                      item-value="id"
                      variant="outlined"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>

                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.email"
                      label="Email"
                      variant="outlined"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>  
                <VCol cols="12" md="6">
                  <VSelect
                    v-model="form.subjects"
                    label="Subjects"
                    :items="subjects"
                    item-title="name"
                    item-value="name" 
                    multiple
                    chips
                    clearable
                    variant="outlined"
                    validate-on="submit"
                    :rules="requiredRule"
                  />
                </VCol>
                
                <VCol
                    cols="12"
                    md="6"
                >
                <VSelect
                      v-model="form.assigned_class"
                      label="assigned class"
                      :items="classes"
                      item-title="name"
                      clearable
                      item-value="name"
                      variant="outlined"
                   
                  />
                </VCol>

                <VCol
                    cols="12"
                    class="d-flex gap-4"
                >
                  <VBtn
                color="primary"
                      class="me-4"
                      :loading="sub_loading"
                      type="submit"
                  >
                    Submit
                  </VBtn>

                  <VBtn
                      type="reset"
                      color="info"
                      variant="tonal"
                      href="/teachers"
                  >
                    Back
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCol>
        </VCard>
      </UiParentCard>
    </v-col>
  </v-row>
</template>



