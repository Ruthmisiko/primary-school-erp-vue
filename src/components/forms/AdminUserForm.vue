<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {createAdminUser,updateAdminUser,getAdminSchools } from "@/api/admin";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { User } from '@/interface/adminUsers';
import type { IFilter } from '@/interface/shared';

const sub_loading = ref(false)
const loading = ref(false)
const route = useRoute()
const refUserForm = ref()
const schools = ref([]);
const router = useRouter();
const page = ref({ title: 'User Form' });
const breadcrumbs = shallowRef([
  {
    title: 'Users',
    disabled: false,
    href: '#'
  },
  {
    title: 'User Form',
    disabled: true,
    href: '#'
  }
]);

const form = reactive<User>({
  id:'',
  name: '',
  email: '',
  phone_number: '',
  userType: '',
  password: '',
  username: '',
  school_id: '',
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
onMounted(async () => {

  form.id = <string>route.params.uuid
  if(form.id){
    await fetchUser();
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
  const response = await getAdminSchools('filter');

  if (response.data?.data) {
    schools.value = response.data.data;
  } else {
    schools.value = [];
  }
} catch (error) {
  console.error("Error fetching classes:", error);
}
};

const submitForm = async () => {
  try {
    loading.value = true
    refUserForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        if(form.id){
          updateAdminUser(form.id,{
            name: form.name,
            userType: form.userType,
            email: form.email,
            phone_number: form.phone_number,
            password: form.password,
            username: form.username,
            school_id: form.school_id,
          }).then(async (data) => {
            if (data.data.success) {
              ElNotification({
                title: "Success",
                message: data.data.message,
                type: "success",
              });
              await router.replace('/admin/user');
            } else {
              Object.values(data.data.errors).forEach((val) =>
           (val as string[]).forEach((message) => {
             ElNotification({
               title: "Error",
               message: message,
               type: "error",
             });
           })
       );
            }
          }).catch((err) => {
            ElNotification({
              title: "Error",
              message: err.message,
              type: "error",
            });
          }).finally(() => {
            sub_loading.value = false;
          });

        }else{
          createAdminUser({
            name: form.name,
            userType: form.userType,
            email: form.email,
            phone_number: form.phone_number,
            password: form.password,
            username: form.username,
            school_id: form.school_id,
          }).then(async (data) => {
            if (data.data.success) {
              ElNotification({
                title: "Success",
                message: data.data.message,
                type: "success",
              });
              await router.replace('/admin/users');
            } else {
              Object.values(data.data.errors).forEach((val) =>
                  (val as string[]).forEach((message) => {
                    ElNotification({
                      title: "Error",
                      message: message,
                      type: "error",
                    });
                  })
              );
            }
          }).catch((err) => {
            ElNotification({
              title: "Error",
              message: err.message,
              type: "error",
            });
          }).finally(() => {
            sub_loading.value = false;
          });

        }
      } else {
        loading.value = false
        // toast.error('Kindly fill in all required fields')
      }

    });
  }catch (error) {
    loading.value = false
    console.log(error)
  }
}

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
      <UiParentCard title="User Form">
        <VCard>
          <VCol>
            <VForm  ref="refUserForm"  @submit.prevent="submitForm">
              <VRow>
                <!-- 👉 User Name -->
                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.name"
                      label="Name"
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
                      v-model="form.username"
                      label="Username"
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
                      v-model="form.userType"
                      label="User Type"
                      variant="outlined"
                      validate-on="submit"
                  />               
                </VCol>

                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.phone_number"
                      variant="outlined"
                      label="Phone Number"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>

                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.password"
                      label="Password"
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
                      v-model="form.school_id"
                      label="School"
                      :items="schools"
                      item-title="name"
                      clearable
                      item-value="id"
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
                      href="/users"
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
