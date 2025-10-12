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
  school_logo: null,
});

const logoFile = ref<File | null>(null);
const logoPreview = ref<string | null>(null);
const currentLogoUrl = ref<string | null>(null);

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
      
      // Set current logo URL if exists
      if (response.data.data.school_logo) {
        currentLogoUrl.value = `${import.meta.env.VITE_APP_API_ROOT}/storage/${response.data.data.school_logo}`;
      }
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

const handleLogoFileInput = (files: any) => {
  console.log('Logo file input changed:', files);
  
  if (!logoFile.value) {
    console.log('No file selected');
    logoPreview.value = null;
    return;
  }
  
  const file = Array.isArray(logoFile.value) ? logoFile.value[0] : logoFile.value;
  
  if (!file) {
    console.log('File is null or undefined');
    return;
  }
  
  console.log('Selected file:', file.name, file.type, file.size);
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    ElNotification({
      title: 'Error',
      message: 'Please select an image file',
      type: 'error',
    });
    logoFile.value = null;
    return;
  }
  
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    ElNotification({
      title: 'Error',
      message: 'Image size should not exceed 2MB',
      type: 'error',
    });
    logoFile.value = null;
    return;
  }
  
  console.log('Logo file validated and set:', file);
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.value = e.target?.result as string;
    console.log('Preview created successfully');
  };
  reader.readAsDataURL(file);
  
  ElNotification({
    title: 'Success',
    message: 'Logo selected! Click "Update Settings" to save.',
    type: 'success',
  });
};

const removeLogo = () => {
  logoFile.value = null;
  logoPreview.value = null;
  const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

const triggerFileUpload = () => {
  console.log('Triggering file upload...');
  const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
  console.log('File input element:', fileInput);
  if (fileInput) {
    fileInput.click();
  } else {
    console.error('File input not found!');
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
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('business_name', form.business_name);
    formData.append('business_email', form.business_email);
    formData.append('business_phone', form.business_phone);
    formData.append('location', form.location || '');
    
    // Add logo if selected
    if (logoFile.value) {
      const file = Array.isArray(logoFile.value) ? logoFile.value[0] : logoFile.value;
      console.log('Appending logo to FormData:', file);
      formData.append('school_logo', file);
    }

    console.log('Submitting FormData...');
    const response = await updateSettings(formData);
    console.log('Update response:', response);
    
    if (response.data.success) {
      ElNotification({
        title: 'Success',
        message: response.data.message || 'Settings updated successfully!',
        type: 'success',
      });
      
      // Clear logo file and preview
      logoFile.value = null;
      logoPreview.value = null;
      
      // Reload settings to get updated logo URL
      await fetchSettings();
      
      // Reload sidebar to show new logo
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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

              <!-- School Logo Upload -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <h3 class="text-h6 font-weight-bold mb-4">School Logo</h3>
              </v-col>

              <!-- Current Logo Display -->
              <v-col cols="12" md="6" v-if="currentLogoUrl && !logoPreview">
                <v-card variant="outlined" class="pa-4">
                  <p class="text-subtitle-2 mb-2">Current Logo</p>
                  <v-img
                    :src="currentLogoUrl"
                    max-height="150"
                    max-width="150"
                    contain
                    class="mx-auto"
                  ></v-img>
                </v-card>
              </v-col>

              <!-- Logo Preview -->
              <v-col cols="12" md="6" v-if="logoPreview">
                <v-card variant="tonal" color="primary" class="pa-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <p class="text-subtitle-2 font-weight-medium">New Logo Preview</p>
                    <v-btn
                      icon="mdi-close"
                      size="small"
                      variant="text"
                      @click="removeLogo"
                    ></v-btn>
                  </div>
                  <v-img
                    :src="logoPreview"
                    max-height="150"
                    max-width="150"
                    contain
                    class="mx-auto"
                  ></v-img>
                </v-card>
              </v-col>

              <!-- Upload Button -->
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="logoFile"
                  label="Upload School Logo"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  show-size
                  chips
                  @change="handleLogoFileInput"
                >
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-image-plus</v-icon>
                  </template>
                </v-file-input>
                <p class="text-caption text-medium-emphasis mt-2">
                  Max size: 2MB | Formats: JPG, PNG, GIF, SVG
                </p>
              </v-col>

              <v-col cols="12" class="d-flex gap-4 mt-4">
                <VBtn
                  color="primary"
                  size="large"
                  :loading="sub_loading"
                  type="submit"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  Update Settings
                </VBtn>
              </v-col>
            </v-row>
          </VForm>
        </VCard>
      </UiParentCard>
    </v-col>
  </v-row>
</template>