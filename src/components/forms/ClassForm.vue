<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {createClass , updateClass , getClass} from "@/api/classes";
import {fetchTeachers} from "@/api/teachers";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { Class } from '@/interface/classes';


const sub_loading = ref(false)
const isLoading = ref(true);
const route = useRoute()
const refForm = ref();
const teachers = ref([]);
const router = useRouter();
const page = ref({ title: 'Class Form' });
const breadcrumbs = shallowRef([
  {
    title: 'Classes',
    disabled: false,
    href: '#'
  },
  {
    title: 'Class Form',
    disabled: true,
    href: '#'
  }
]);

const form = reactive<Class>({
  id:'',
  name: '',
  teacher_id: ''
})


onMounted(async () => {

  form.id = <string>route.params.uuid
  if(form.id){
    await fetchClass();
  }
  getTeacherList({})

})

const getTeacherList = async (filter) => {
  try {
    fetchTeachers(filter).then(response => {
      if (response.data.success) {
       teachers.value = response.data?.data
      }
      else {
        console.log(response)
      }
    })
  }
  catch (error) {
    console.log(error)
  }
}

const fetchClass = async () => {
  if (route.params.id) {
    try {
      isLoading.value = true;
      const response = await getClass(route.params.id as string);
      if (response.data.success) {
        Object.assign(form, response.data.data); 
      } else {
        console.log("Error fetching classes data:", response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
};


const handleErrors = (data: any) => {
  Object.values(data.errors).forEach((val: any) => {
    ElNotification({ title: "Error", message: val[0], type: "error" });
  });
};

const submitForm = async () => {
  sub_loading.value = true;
  try {
    if (route.params.id) {
      
      await updateClass(route.params.id as string, form).then(data => {
        if (data.data.success) {
          ElNotification({ 
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/classes');
        } else {
          sub_loading.value = false;
          handleErrors(data);
        }
      });
    } else {
    
      await createClass(form).then(data => {
        if (data.data.success) {
          ElNotification({
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/classes');
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
      <UiParentCard title="Class Form">
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
                      label="Class name"
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
                <VAutocomplete
                v-model="form.teacher_id"
                :rules="requiredRule"
                label="Class Teacher"
                :items="teachers"
                item-title="name"
                item-value="id"
                clearable
                validate-on="submit"
                variant="outlined"
                color="primary"
                required
                density="comfortable"
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



