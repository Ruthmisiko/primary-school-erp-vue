<script setup lang="ts">

import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import {ref, onMounted, reactive, computed } from "vue";
import {useRoute} from "vue-router";
import {getTeacher} from "@/api/teachers";


const page = ref({ title: 'View Teacher' });
const route = useRoute()
const breadcrumbs = ref([
  {
    title: 'teacher',
    disabled: false,
    href: '/teacher'
  },
  {
    title: 'View',
    disabled: true,
    href: '#'
  }
]);
const teacher_id = ref('')
const loading = ref(false)
const teacher= ref([])


onMounted(async () => {
 teacher_id.value = <string>route.params.id

  if (teacher_id.value) {
    await loadTeacher();
  }
})


const loadTeacher =  async () => {
  loading.value = true
  try {
    const response = await getTeacher(teacher_id.value);
    if (response.data.success) {
      teacher.value = response.data.data;
    } else {
      console.error("Failed to fetch teacher:", response.data.message);
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

</script>

<template>

  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <VCard>
    <VCol>
      
      <VDivider/>
      <VCardText>
            <VCol>    
              <VSheet class="pa-2 ma-2">                        
                <VRow class="mt-1">
                  <VCol>
                    <h4><b>Teacher's Name</b> </h4>
                    <p>
                      {{ teacher?.name }}
                    </p>
                    <h4><b>Phone Number</b> </h4>
                    <p>
                      {{ teacher?.contact_number }}
                    </p>
                  </VCol>
                </VRow>
                <VRow class="mt-1">
                  <VCol>
                    <h4><b>Email</b> </h4>
                    <p>
                      {{ teacher?.email}}
                    </p>
                    <h4><b>Gender</b> </h4>
                    <p>
                      {{ teacher?.gender}}
                    </p>
                    <h4><b>Subjects</b> </h4>
                    <p>
                      {{ teacher?.subjects }}
                    </p>
                    <h4><b>Designation</b> </h4>
                    <p>
                      {{ teacher?.designation }}
                    </p>
                  </VCol>
                </VRow>
              </VSheet>
            </VCol>
            
      </VCardText>
    </VCol>
  </VCard>
</template>

<style lang="scss">

</style>