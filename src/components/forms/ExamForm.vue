<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {createExam , updateExam , getExam} from "@/api/exams";
import {fetchClasses} from "@/api/classes";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { Exam } from '@/interface/exam';
import type { IFilter } from '@/interface/shared';
import { de } from 'element-plus/es/locale/index.mjs';

const sub_loading = ref(false)
const isLoading = ref(true);
const route = useRoute()
const refForm = ref()
const classes = ref([]);
const router = useRouter();
const page = ref({ title: 'Exam Form' });

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

const form = reactive<Exam>({
  id:'',
  name: '',
  year: 2025,
  term: '',
  class_id: '',

})


onMounted(async () => {

form.id = <string>route.params.id
if(form.id){
  await fetchExam();
}
const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);

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

const fetchExam= async () => {
  isLoading.value = true
  try {
    getExam(form.id).then(response => {
      if (response?.data?.success) {
        form.name=response?.data?.data?.name;
        form.term=response?.data?.data?.term;
        form.year=response?.data?.data?.year;
        form.class_id=response?.data?.data?.class_id;
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
      
      await updateExam(route.params.id as string, form).then(data => {
        if (data.data.success) {
          ElNotification({ 
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/exams');
        } else {
          sub_loading.value = false;
          handleErrors(data);
        }
      });
    } else {
    
      await createExam(form).then(data => {
        if (data.data.success) {
          ElNotification({
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/exams');
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
                      label="Exam name"
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
                      v-model="form.year"
                      label="Year"
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
                      v-model="form.term"
                      label="Term"
                      variant="outlined"
                      placeholder="term"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>  
                <VCol
                    cols="12"
                    md="6"
                >
                <VSelect
                      v-model="form.class_id"
                      label="class"
                      :items="classes"
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
                      href="/exams"
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



