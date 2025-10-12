<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {addStudent , updateStudent , getStudent} from "@/api/students";
import {useRoute, useRouter} from "vue-router";
import {fetchClasses} from "@/api/classes";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { Student } from '@/interface/students';
import type { IFilter } from '@/interface/shared';
import { watch } from 'vue';


const sub_loading = ref(false)
const loading = ref(false)
const route = useRoute()
const refStudentForm = ref()
const classes = ref([]);
const router = useRouter();
const page = ref({ title: 'Student Form' });
const selectedClassFee = ref<number | null>(null);

const breadcrumbs = shallowRef([
  {
    title: 'Students',
    disabled: false,
    href: '#'
  },
  {
    title: 'Student Form',
    disabled: true,
    href: '#'
  }
]);

const form = reactive<Student>({
  id:'',
  name: '',
  class_id: '',
  parent: '',
  age: 0,
  fee_balance: 0,
  paid_fee: 0,
  sclass:[],
  results:[],
  address:'',
  phone_number: ''

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
    await fetchStudent();
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

const fetchStudent = async () => {
  loading.value = true
  try {
    getStudent(form.id).then(response => {
      if (response?.data?.success) {
        form.name=response?.data?.data?.name;
        form.class_id=response?.data?.data?.class_id;
        form.parent=response?.data?.data?.parent;
        form.age=response?.data?.data?.age;
        form.fee_balance=response?.data?.data?.fee_balance;
        form.paid_fee=response?.data?.data?.paid_fee;
        form.address=response?.data?.data?.address;
        form.phone_number=response?.data?.data?.phone_number;
      }
      else { console.log(response) }
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

watch(
  () => form.class_id,
  (newClassId) => {
    const selected = classes.value.find((cls) => cls.id === newClassId);
    selectedClassFee.value = selected?.fee ?? null;
  }
);

watch(
  [() => form.paid_fee, selectedClassFee],
  ([paidFee, classFee]) => {
    const paid = parseFloat(paidFee || '0');
    const total = classFee ?? 0;
    const balance = total - paid;
    form.fee_balance = balance >= 0 ? balance.toFixed(2) : '0.00';
  }
);

const submitForm = async () => {
  try {
    loading.value = true
    refStudentForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        if(form.id){
          updateStudent(form.id,{
            name: form.name,
            class_id: form.class_id,
            parent: form.parent,
            age: form.age,
            fee_balance: form.fee_balance,
            paid_fee: form.paid_fee,
            address: form.AddressBookIcon,
            phone_number: form.phone_number

          }).then(async (data) => {
            if (data.data.success) {
              ElNotification({
                title: "Success",
                message: data.data.message,
                type: "success",
              });
              await router.replace('/students');
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
          addStudent({
            name: form.name,
            class_id: form.class_id,
            parent: form.parent,
            age: form.age,
            fee_balance: form.fee_balance,
            paid_fee: form.paid_fee,
            address: form.AddressBookIcon,
            phone_number: form.phone_number
          }).then(async (data) => {
            if (data.data.success) {
              ElNotification({
                title: "Success",
                message: data.data.message,
                type: "success",
              });
              await router.replace('/students');
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
      <UiParentCard title="Student Form">
        <VCard>
          <VCol>
            <VForm  ref="refStudentForm"  @submit.prevent="submitForm">
              <VRow>
                <!-- 👉 User Name -->
                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.name"
                      label="Student name"
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
                      v-model="form.parent"
                      label="Parent"
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
                <VCol cols="12" md="6">
                <VTextField
                  :model-value="selectedClassFee !== null ? selectedClassFee : ''"
                  label="Class Fee"
                  variant="outlined"
                  readonly
                  disabled
                  placeholder="Select a class"
                />
              </VCol>

                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.age"
                      variant="outlined"
                      type="number"
                      label="Age"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>

                
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="form.paid_fee"
                    label="Paid Fee"
                    variant="outlined"
                    type="number"
                    min="0"
                  />
                </VCol>
                <VCol cols="12" md="6">
                <VTextField
                  :model-value="form.fee_balance"
                  label="Fee Balance"
                  variant="outlined"
                  readonly
                  disabled
                />
              </VCol>
              <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.address"
                      label="Location"
                      variant="outlined"
                      placeholder="Location"
                      validate-on="submit"
                      :rules="requiredRule"
                  />
                </VCol>  
                <VCol
                    cols="12"
                    md="6"
                >
                  <VTextField
                      v-model="form.phone_number"
                      label="Parents Phone"
                      variant="outlined"
                      placeholder="Phone Number"
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
                      href="/students"
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
