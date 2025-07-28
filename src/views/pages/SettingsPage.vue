<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { getSettings, updateSettings } from '@/api/business';
import type { Business } from '@/interface/business';

const page = ref({ title: 'Settings' });
const sub_loading = ref(false);
const isLoading = ref(true);
const refForm = ref();
const router = useRouter();

const form = reactive<Business>({
  id: '',
  business_name: '',
  business_email: '',
  business_phone: '',
  location: '',
});

const requiredRule = ref([
  (value: string) => !!value || 'Field is required.',
]);

onMounted(async () => {
  await fetchSettings();
});

const fetchSettings = async () => {
  try {
    isLoading.value = true;
    const response = await getSettings();
    if (response.data.success && response.data.data) {
      Object.assign(form, response.data.data);
    } else {
      ElNotification({
        title: 'Warning',
        message: response.data.message || 'No settings found. Please fill in the form to create settings.',
        type: 'warning',
      });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to fetch settings.',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};

const handleErrors = (data: any) => {
  Object.values(data.errors || {}).forEach((val: any) => {
    ElNotification({ title: 'Error', message: val[0], type: 'error' });
  });
};

const submitForm = async () => {
  sub_loading.value = true;

  try {
    const response = await updateSettings(form);
    if (response.data.success) {
      ElNotification({
        title: 'Success',
        message: response.data.message,
        type: 'success',
      });
      router.push('/settings');
    } else {
      handleErrors(response.data);
    }
  } catch (error) {
    console.error('Update failed:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to update settings.',
      type: 'error',
    });
  } finally {
    sub_loading.value = false;
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="page.title">
        <VCard>
          <BaseBreadcrumb :title="page.title" />
          <VForm ref="refForm" @submit.prevent="submitForm" class="mt-6 ml-4 mr-4">
            <v-row>
              <v-col cols="12" md="6">
                <VTextField
                  v-model="form.business_name"
                  label="Business Name"
                  variant="outlined"
                  :rules="requiredRule"
                />
              </v-col>
              <v-col cols="12" md="6">
                <VTextField
                  v-model="form.business_email"
                  label="Business Email"
                  variant="outlined"
                  :rules="requiredRule"
                />
              </v-col>
              <v-col cols="12" md="6">
                <VTextField
                  v-model="form.business_phone"
                  label="Business Phone"
                  variant="outlined"
                  :rules="requiredRule"
                />
              </v-col>
              <v-col cols="12" md="6">
                <VTextField
                  v-model="form.location"
                  label="Location"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" class="d-flex gap-4">
                <VBtn
                  color="primary"
                  :loading="sub_loading"
                  type="submit"
                >
                  Update Business Settings
                </VBtn>
              </v-col>
            </v-row>
          </VForm>
        </VCard>
      </UiParentCard>
    </v-col>
  </v-row>
</template>