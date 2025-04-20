<script setup lang="ts">
import { ref } from 'vue';
import { importStudents, downloadStudentTemplate } from '@/api/students';
import { ElNotification } from 'element-plus';

const emit = defineEmits(['close']);

const visible = ref(true);
const uploading = ref(false);
const selectedFile = ref<File | null>(null);
const message = ref('');

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    selectedFile.value = target.files[0];
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    message.value = 'Please select a file first.';
    return;
  }

  uploading.value = true;
  const response = await importStudents(selectedFile.value);

  if (response?.status === 200) {
    message.value = 'Products imported successfully.';
    ElNotification({
      title: 'Success',
      message: message.value,
      type: 'success',
    });
    emit('close');
  } else {
    message.value = response?.data?.message || 'Upload failed.';
    ElNotification({
      title: 'Error',
      message: message.value,
      type: 'error',
    });
  }

  uploading.value = false;
};

const downloadTemplate = () => {
  downloadStudentTemplate();
};
</script>

<template>
  <VDialog v-model="visible" max-width="500">
    <VCard class="pa-6 rounded-xl elevation-3">

      <div class="d-flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Upload Students</h2>   
      </div>
      <div class="mb-6">
        <VBtn
          color="primary"
          block
          @click="downloadTemplate"
          class="rounded-md"
        >
          Download Sample Excel File
        </VBtn>
      </div>
      <div class="mb-6">
        <v-file-input 
          label="Select file"
          variant="solo"          
          @change="handleFileChange"
        >
       </v-file-input>
      </div>

      <div class="d-flex align-center">
        
        <VBtn
          color="primary"
          @click="emit('close')"
          class="ml-8"     
        >
          Cancel
        </VBtn>
        <VBtn
          color="success"
          :loading="uploading"
          @click="uploadFile"
          class="ml-8"     
        >
          Upload File
        </VBtn>
      </div>

      <div v-if="message" class="mt-4">
        <p
          class="text-sm"
          :class="message.includes('success') ? 'text-green' : 'text-error'"
        >
          {{ message }}
        </p>
      </div>

    </VCard>
  </VDialog>
</template>