<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { updateSettings , getSettings} from "@/api/business";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { Business } from '@/interface/business';


const sub_loading = ref(false)
const isLoading = ref(true);
const route = useRoute()
const refForm = ref();
const router = useRouter();
const page = ref({ title: 'Settings' });


const form = reactive<Business>({
  id:'',
  business_name: '',
  business_email: '',
  business_phone: '',
})


onMounted(async () => {

  form.id = <string>route.params.uuid
  if(form.id){
    await fetchBusiness();
  }
})


const fetchBusiness = async () => {
  if (route.params.id) {
    try {
      isLoading.value = true;
      const response = await getSettings(route.params.id as string);
      if (response.data.success) {
        Object.assign(form, response.data.data); 
      } else {
        console.log("Error fetching users data:", response);
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
  
    if (route.params.id) {
      
      await updateSettings(route.params.id as string, form).then(data => {
        if (data.data.success) {
          ElNotification({ 
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/settings');
        } else {
          sub_loading.value = false;
          handleErrors(data);
        }
      });
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
   <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Class Form">
        <VCard>
          <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
          <VCol>
            <VForm  ref="refForm"  @submit.prevent="submitForm">
             
                <!-- 👉 User Name -->
                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.business_name"
                      label="Business name"
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
                      v-model="form.business_email"
                      label="Business Email Address"
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
                      v-model="form.business_phone"
                      label="Business Phone No"
                      variant="outlined"
                      placeholder="Name"
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
                    Update Business Settings
                  </VBtn>

                 
                </VCol>
          
            </VForm>
          </VCol>
        </VCard>
      </UiParentCard>
    </v-col>
  </v-row>
</template>



