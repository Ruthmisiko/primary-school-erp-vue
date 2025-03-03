<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {createTeacher , updateTeacher , getTeacher} from "@/api/teachers";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import { VueTelInput } from 'vue-tel-input'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { Teacher } from '@/interface/teachers';


const sub_loading = ref(false)
const isLoading = ref(true);
const route = useRoute()
const refForm = ref()
const router = useRouter();
const page = ref({ title: 'Teacher Form' });
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
  subjects_taught: '',
  assigned_class:'',

})

const phoneBindingProps = {
  mode: 'international',
  styleClasses: 'has-default',
  defaultCountry: 'KE',
  onlyCountries: ['KE', 'RW', 'UG', 'TZ', 'ET', 'BW'],
  inputOptions: {
    showDialCode: false,
    placeholder: 'Mobile Number',
    name: 'phone',
  },
}
const checkMobileNumber = (event: any) => {
  if (event.valid)
    phoneBindingProps.styleClasses = ''

  else
    phoneBindingProps.styleClasses = 'v-input--error'
}

onMounted(async () => {

  form.id = <string>route.params.uuid
  if(form.id){
    await fetchTeacher();
  }

})

const fetchTeacher = async () => {
  if (route.params.id) {
    try {
      isLoading.value = true;
      const response = await getTeacher(route.params.id as string);
      if (response.data.success) {
        Object.assign(form, response.data.data); 
      } else {
        console.log("Error fetching teachers data:", response);
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
                  <vue-tel-input
                      v-bind="phoneBindingProps"
                      v-model="form.contact_number"
                      @validate="checkMobileNumber($event)"
                  />
                </VCol>
                <VCol
                    cols="12"
                    md="6"
                >
                <VTextField
                      v-model="form.gender"
                      label="gender"
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
                      v-model="form.designation"
                      variant="outlined"
                      type="designation"
                      label="Designation"
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
                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.assigned_class"
                      label="Assigned Class"
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



