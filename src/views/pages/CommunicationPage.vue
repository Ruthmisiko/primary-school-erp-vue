<script setup lang="ts">
import { ref, shallowRef, onMounted, computed, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { fetchClasses } from '@/api/classes';
import { fetchStudents } from '@/api/students';
import { sendSms } from '@/api/communication';
import { ElNotification } from 'element-plus';

type Audience = 'all' | 'class' | 'custom';

const page = ref({ title: 'Communication' });
const breadcrumbs = shallowRef([
  { title: 'Communication', disabled: true, href: '/communication' }
]);

const loadingClasses = ref(false);
const classes = ref<{ id: number; name: string }[]>([]);

const audience = ref<Audience>('all');
const selectedClassIds = ref<number[]>([]);
const customNumbers = ref<string[]>([]);
const senderId = ref('');
const message = ref('');
const isSending = ref(false);

// Parents listing for selected classes
type RecipientRow = { id: number; parentName: string; studentName: string; phone: string; classId?: number };
const classRecipients = ref<RecipientRow[]>([]);
const selectedRecipientPhones = ref<string[]>([]);
const allSelected = computed({
  get: () => classRecipients.value.length > 0 && selectedRecipientPhones.value.length === classRecipients.value.filter(r => !!r.phone).length,
  set: (val: boolean) => {
    if (val) {
      selectedRecipientPhones.value = classRecipients.value.filter(r => !!r.phone).map(r => r.phone);
    } else {
      selectedRecipientPhones.value = [];
    }
  }
});

const messageLength = computed(() => message.value.length);
const smsSegments = computed(() => (messageLength.value === 0 ? 0 : Math.ceil(messageLength.value / 160)));

const canSend = computed(() => {
  if (!message.value.trim()) return false;
  if (audience.value === 'class' && selectedClassIds.value.length === 0 && selectedRecipientPhones.value.length === 0) return false;
  if (audience.value === 'custom' && customNumbers.value.length === 0) return false;
  return true;
});

const loadClasses = async () => {
  try {
    loadingClasses.value = true;
    const resp = await fetchClasses({ page: 1, per_page: 100 });
    const data = resp?.data?.data || [];
    classes.value = Array.isArray(data) ? data.map((c: any) => ({ id: c.id, name: c.name || c.sclass?.name || `Class ${c.id}` })) : [];
  } catch (e) {
    classes.value = [];
  } finally {
    loadingClasses.value = false;
  }
};

const resetAudienceSpecific = () => {
  if (audience.value !== 'class') selectedClassIds.value = [];
  if (audience.value !== 'custom') customNumbers.value = [];
  classRecipients.value = [];
  selectedRecipientPhones.value = [];
};

const handleSend = async () => {
  if (!canSend.value) return;
  try {
    isSending.value = true;
    const payload: any = {
      audience: audience.value,
      message: message.value,
    };
    if (senderId.value) payload.sender_id = senderId.value;
    if (audience.value === 'class') {
      if (selectedRecipientPhones.value.length > 0) {
        payload.phone_numbers = selectedRecipientPhones.value;
      } else {
        payload.class_ids = selectedClassIds.value;
      }
    }
    if (audience.value === 'custom') payload.phone_numbers = customNumbers.value;

    const resp = await sendSms(payload);
    if (resp?.data?.success) {
      ElNotification({ title: 'Success', message: 'SMS queued successfully', type: 'success' });
      message.value = '';
      resetAudienceSpecific();
    } else {
      ElNotification({ title: 'Error', message: resp?.data?.message || 'Failed to send SMS', type: 'error' });
    }
  } catch (e) {
    ElNotification({ title: 'Error', message: 'Failed to send SMS', type: 'error' });
  } finally {
    isSending.value = false;
  }
};

onMounted(() => {
  loadClasses();
});

// Load recipients when classes change
watch(selectedClassIds, async (ids) => {
  try {
    classRecipients.value = [];
    selectedRecipientPhones.value = [];
    if (!ids || ids.length === 0) return;
    // Fetch a larger page and filter locally by class id since backend may not support this filter
    const resp = await fetchStudents({ page: 1, per_page: 1000 });
    const list = resp?.data?.data || resp?.data || [];
    const idSet = new Set((ids || []).map((n: any) => Number(n)));
    const filtered = Array.isArray(list)
      ? list.filter((s: any) => {
          const cid = Number(s.class_id);
          const relCid = Number(s?.sclass?.id);
          return idSet.has(cid) || idSet.has(relCid);
        })
      : [];
    const rows: RecipientRow[] = filtered.map((s: any) => ({
      id: s.id,
      parentName: s.parent?.name || s.parent || 'Parent',
      studentName: s.name || 'Student',
      phone: s.parent?.phone_number || s.phone_number || s.parent_phone || '',
      classId: Number(s.class_id) || Number(s?.sclass?.id) || undefined
    }));
    classRecipients.value = rows.filter(r => !!r.phone);
  } catch (e) {
    classRecipients.value = [];
  }
});
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <VRow>
    <VCol cols="12" md="8">
      <VCard elevation="2">
        <VCardItem>
          <div class="text-h6 font-weight-bold">Send SMS</div>
          <div class="text-body-2 text-grey-darken-1">Communicate with parents by class or broadcast to all.</div>
        </VCardItem>
        <VDivider />
        <VCardText>
          <VRow class="mb-4">
            <VCol cols="12">
              <div class="text-subtitle-2 mb-2">Audience</div>
              <VBtnToggle v-model="audience" mandatory variant="outlined" class="w-100 audience-toggle">
                <VBtn value="all">All Parents</VBtn>
                <VBtn value="class">By Class</VBtn>
                <VBtn value="custom">Custom Numbers</VBtn>
              </VBtnToggle>
            </VCol>
          </VRow>

          <VRow v-if="audience === 'class'" class="mb-2">
            <VCol cols="12">
              <VSelect
                :loading="loadingClasses"
                multiple
                chips
                clearable
                v-model="selectedClassIds"
                :items="classes.map(c => ({ title: c.name, value: c.id }))"
                label="Select Classes"
                variant="outlined"
              />
            </VCol>
          </VRow>

          <VRow v-if="audience === 'class' && classRecipients.length" class="mb-4">
            <VCol cols="12">
              <div class="text-subtitle-2 mb-2">Recipients</div>
              <VTable density="comfortable">
                <thead>
                  <tr>
                    <th style="width:48px;">
                      <VCheckbox v-model="allSelected" :indeterminate="selectedRecipientPhones.length>0 && selectedRecipientPhones.length<classRecipients.length" />
                    </th>
                    <th>Parent</th>
                    <th>Student</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in classRecipients" :key="row.id">
                    <td>
                      <VCheckbox :value="row.phone" v-model="selectedRecipientPhones" />
                    </td>
                    <td>{{ row.parentName }}</td>
                    <td>{{ row.studentName }}</td>
                    <td>{{ row.phone }}</td>
                  </tr>
                </tbody>
              </VTable>
              <div class="text-caption text-grey-darken-1 mt-2">
                Selected {{ selectedRecipientPhones.length }} of {{ classRecipients.length }} recipients
              </div>
            </VCol>
          </VRow>

          <VRow v-if="audience === 'custom'" class="mb-2">
            <VCol cols="12">
              <VCombobox
                v-model="customNumbers"
                multiple
                chips
                clearable
                label="Enter Phone Numbers (press Enter after each)"
                variant="outlined"
                hint="Format: 2547XXXXXXXX or +2547XXXXXXXX"
                persistent-hint
              />
            </VCol>
          </VRow>

          <VRow class="mb-2">
            <VCol cols="12" md="6">
              <VTextField
                v-model="senderId"
                label="Sender ID (optional)"
                variant="outlined"
                clearable
                maxlength="11"
                hint="Max 11 characters (per operator rules)"
                persistent-hint
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="12">
              <VTextarea
                v-model="message"
                label="Message"
                variant="outlined"
                rows="6"
                auto-grow
                :counter="480"
              />
              <div class="text-caption text-grey-darken-1 mt-1">
                {{ messageLength }} characters • ~{{ smsSegments }} SMS segment(s)
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" :disabled="!canSend || isSending" :loading="isSending" @click="handleSend">
            Send SMS
          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>

    <VCol cols="12" md="4">
      <VCard elevation="2">
        <VCardItem>
          <div class="text-subtitle-1 font-weight-bold">Tips</div>
        </VCardItem>
        <VDivider />
        <VCardText class="text-body-2">
          <ul class="tips">
            <li>Use sender ID recognizable to parents.</li>
            <li>Keep messages concise; costs scale with segments.</li>
            <li>For classes, select one or more classes to target.</li>
            <li>Custom numbers accept multiple entries; press Enter after each.</li>
          </ul>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.audience-toggle :deep(.v-btn) {
  flex: 1 1 0;
}
.tips {
  margin: 0;
  padding-left: 18px;
}
</style>

