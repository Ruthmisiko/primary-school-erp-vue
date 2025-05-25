<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {addResult , updateResult , getResult} from "@/api/results";
import {useRoute, useRouter} from "vue-router";
import {fetchClasses} from "@/api/classes";
import {fetchStudents} from "@/api/students";
import {fetchExams} from "@/api/exams";
import {fetchSubjects} from "@/api/subjects";
import {ElNotification} from "element-plus";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { Result } from '@/interface/results';
import type { IFilter } from '@/interface/shared';


const sub_loading = ref(false)
const loading = ref(false)
const route = useRoute()
const refResultForm = ref()
const classes = ref([]);
const students = ref([]);
const subjects = ref([]);
const exams = ref([]);
const router = useRouter();
const page = ref({ title: 'Result Form' });
const breadcrumbs = shallowRef([
  {
    title: 'results',
    disabled: false,
    href: '#'
  },
  {
    title: 'Result Form',
    disabled: true,
    href: '#'
  }
]);

const form = reactive<Result>({
  id: '',
  class_id: '',
  subject_id: '',
  exam_id: '',
  result_items: []
});


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

const addRow = () => {
  form.result_items.push({
    student_id: '',
    marks_obtained: 0,
    remarks: ''
  });
};

// Remove a row by index
const removeRow = (index: number) => {
  form.result_items.splice(index, 1);
};
onMounted(async () => {

  form.id = <string>route.params.uuid
  if(form.id){
    await fetchResult();
  }
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }
  loadData(filter);

})
const loadData = async (filter: IFilter) => {


  const response = await fetchClasses('filter');

  if (response.data?.data) {
    classes.value = response.data.data;
  } else {
    classes.value = [];
  }

  const studentResponse = await fetchStudents('filter');

  if (studentResponse.data?.data) {
    students.value = studentResponse.data.data;
  } else {
    students.value = [];
  }

  const examResponse = await fetchExams('filter');

  if (examResponse.data?.data) {
    exams.value = examResponse.data.data;
  } else {
    students.value = [];
  }

  const subjectResponse = await fetchSubjects('filter');

  if (subjectResponse.data?.data) {
    subjects.value = subjectResponse.data.data;
  } else {
    subjects.value = [];
  }

};

const fetchResult = async () => {
  loading.value = true
  try {
    getResult(form.id).then(response => {
      if (response?.data?.success) {
        form.marks_obtained=response?.data?.data?.marks_obtained;
        form.class_id=response?.data?.data?.class_id;
        form.grade=response?.data?.data?.grade;
        form.remarks=response?.data?.data?.remarks;
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

const submitForm = async () => {
  try {
    loading.value = true;
    const valid = await refResultForm.value?.validate();

    if (valid.valid) {
      const payload = {
        class_id: form.class_id,
        subject_id: form.subject_id,
        exam_id: form.exam_id,
        result_items: form.result_items
      };

      const request = form.id
        ? updateResult(form.id, payload)
        : addResult(payload);

      request
        .then(async (data) => {
          if (data.data.success) {
            ElNotification({
              title: "Success",
              message: data.data.message,
              type: "success",
            });
            await router.replace("/results");
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
        })
        .catch((err) => {
          ElNotification({
            title: "Error",
            message: err.message,
            type: "error",
          });
        })
        .finally(() => {
          sub_loading.value = false;
        });
    } else {
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
    console.error(error);
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
      <UiParentCard title="Result Form">
        <VCard>
          <VCol>
            <VForm  ref="refResultForm"  @submit.prevent="submitForm">
              <VRow>
                <!-- 👉 User Name -->
                <VCol
                    cols="12"
                    md="6"
                >
                <VSelect
                      v-model="form.exam_id"
                      label="exam"
                      :items="exams"
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
                    md="6"
                >
                <v-select
                  v-model="form.subject_id"
                  :items="subjects"
                  item-title="name"
                  item-value="id"
                  label="Subject"
                  dense
                  variant="outlined"
                  :rules="requiredRule"
                />
                </VCol>          
                <VCol cols="12" class="text-right mb-4">
                  <VBtn color="primary" @click="addRow">Add</VBtn>
                </VCol>
                <VCol cols="12">
                  <v-table>
                    <thead>
                      <tr>
                        <th>STUDENT</th>
                        <th>MARKS</th>
                        <th>REMARKS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(result, index) in form.result_items" :key="index">
                        <td>
                          
                          <VSelect
                            v-model="result.student_id"
                            label="student"
                            :items="students"
                            item-title="name"
                            clearable
                            item-value="id"
                            variant="outlined"
                            validate-on="submit"
                            :rules="requiredRule"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="result.marks_obtained"
                            type="number"
                            label="Marks"
                            dense
                            variant="outlined"
                            :rules="requiredRule"
                          />
                        </td>
                        <td>
                          <v-textarea
                            v-model="result.remarks"
                            label="Remarks"
                            dense
                            variant="outlined"
                            rows="1"
                          />
                        </td>
                        <td>
                          <v-btn icon color="primary" @click="removeRow(index)">
                            -
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
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
                      href="/results"
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
