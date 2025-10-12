<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {createMethod , updateMethod , getMethod} from "@/api/paymentMethods";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { PaymentMethod } from '@/interface/paymentMethods';
import type { IFilter } from '@/interface/shared';

const sub_loading = ref(false)
const isLoading = ref(true);
const route = useRoute()
const refForm = ref()
const router = useRouter();
const page = ref({ title: 'Payment Method Form' });

const breadcrumbs = shallowRef([
  {
    title: 'Payment Methods',
    disabled: false,
    href: '#'
  },
  {
    title: 'Payment Method Form',
    disabled: true,
    href: '#'
  }
]);

const form = reactive<PaymentMethod>({
  id:'',
  name: '',
  description: '',
})


onMounted(async () => {

form.id = <string>route.params.id
if(form.id){
  await fetchMethod();
}
const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
})


const fetchMethod= async () => {
  isLoading.value = true
  try {
    getMethod(form.id).then(response => {
      if (response?.data?.success) {
        form.name=response?.data?.data?.name;
        form.description=response?.data?.data?.description;
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
      
      await updateMethod(route.params.id as string, form).then(data => {
        if (data.data.success) {
          ElNotification({ 
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/payment-methods');
        } else {
          sub_loading.value = false;
          handleErrors(data);
        }
      });
    } else {
    
      await createMethod(form).then(data => {
        if (data.data.success) {
          ElNotification({
            title: "Success",
            message: data.data.message,
            type: "success" });
          router.push('/payment-methods');
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
      <UiParentCard title="Payment Method Form">
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
                      label="name"
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
                      v-model="form.description"
                      label="Description"
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
                      href="/payment-methods"
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



