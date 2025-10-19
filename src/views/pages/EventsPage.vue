<template>
  <div class="events-page">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-2 text-primary">
          Events Management
        </h1>
        <p class="text-h6 text-grey-darken-1 mb-6">
          Manage school events and activities
        </p>
      </v-col>
    </v-row>

    <!-- Action Bar -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search events..."
          variant="outlined"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          label="Filter by Status"
          variant="outlined"
          clearable
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="3" class="text-right">
        <v-btn
          color="primary"
          size="large"
          @click="openEventModal()"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Add Event
        </v-btn>
      </v-col>
    </v-row>

    <!-- Events Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <VDataTable
            :headers="headers"
            :items="filteredEvents"
            :loading="isLoading"
            height="500"
            fixed-header
          >
            <template #item.tittle="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getEventColor(item.status)" size="32" class="mr-3">
                  <v-icon color="white" size="16">mdi-calendar</v-icon>
                </v-avatar>
                <div class="font-weight-medium">{{ item.tittle }}</div>
              </div>
            </template>

            <template #item.description="{ item }">
              <div class="text-body-2">{{ item.description }}</div>
            </template>

            <template #item.date="{ item }">
              <div class="font-weight-medium">{{ formatDate(item.date) }}</div>
            </template>

            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template #item.actions="{ item }">
              <VMenu>
                <template #activator="{ props }">
                  <VBtn v-bind="props" color="primary" size="large" variant="tonal" density="compact" :icon="true">
                    <MoreOutlined />
                  </VBtn>
                </template>
                <VList>
                  <VListItem @click="viewEvent(item)">
                    <EyeOutlined /> <span>VIEW</span>
                  </VListItem>
                  <VListItem @click="editEvent(item)">
                    <EditOutlined /> <span>EDIT</span>
                  </VListItem>
                  <VListItem @click="deleteEvent(item)">
                    <DeleteOutlined /> <span>DELETE</span>
                  </VListItem>
                </VList>
              </VMenu>
            </template>

            <template #no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-calendar-blank</v-icon>
                <h3 class="text-h6 font-weight-bold text-grey-darken-1 mb-2">
                  No Events Found
                </h3>
                <p class="text-grey-darken-1">
                  No events match your current filters.
                </p>
              </div>
            </template>
          </VDataTable>
        </v-card>
      </v-col>
    </v-row>

    <!-- Event Modal -->
    <v-dialog v-model="eventModal" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold pa-4">
          <v-icon class="mr-2">
            {{ isEditing ? 'mdi-pencil' : selectedEvent ? 'mdi-eye' : 'mdi-calendar-plus' }}
          </v-icon>
          {{ isEditing ? 'Edit Event' : selectedEvent ? 'View Event' : 'Add New Event' }}
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="eventForm" v-model="isFormValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="eventForm.tittle"
                  label="Event Title"
                  variant="outlined"
                  :rules="[v => !!v || 'Title is required']"
                  :readonly="selectedEvent && !isEditing"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="eventForm.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                  :readonly="selectedEvent && !isEditing"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="eventForm.date"
                  label="Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                  :readonly="selectedEvent && !isEditing"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="eventForm.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  :rules="[v => !!v || 'Status is required']"
                  :readonly="selectedEvent && !isEditing"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closeEventModal"
          >
            {{ selectedEvent && !isEditing ? 'Close' : 'Cancel' }}
          </v-btn>
          <v-btn
            v-if="!selectedEvent || isEditing"
            color="primary"
            :disabled="!isFormValid"
            :loading="isSaving"
            @click="saveEvent"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
          <v-btn
            v-if="selectedEvent && !isEditing"
            color="primary"
            @click="editEvent(selectedEvent)"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this event? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import { api } from '@/api';
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';

// Data
const searchQuery = ref('');
const selectedStatus = ref('');
const isLoading = ref(false);
const isSaving = ref(false);
const isFormValid = ref(false);
const eventModal = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const selectedEvent = ref(null);

const statusOptions = ref([
  'Upcoming',
  'Ongoing',
  'Completed',
  'Cancelled'
]);

const headers = ref([
  { title: 'EVENT', key: 'tittle', sortable: true },
  { title: 'DESCRIPTION', key: 'description', sortable: true },
  { title: 'DATE', key: 'date', sortable: true },
  { title: 'STATUS', key: 'status', sortable: true },
  { title: 'ACTION', key: 'actions', sortable: false }
]);

const events = ref([]);

const eventForm = ref({
  tittle: '',
  description: '',
  date: '',
  status: 'Upcoming'
});

// Computed
const filteredEvents = computed(() => {
  let filtered = events.value;
  console.log('Filtering events:', filtered);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(event =>
      event.tittle.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(event => event.status === selectedStatus.value);
  }

  console.log('Filtered events:', filtered);
  return filtered;
});

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getEventColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'primary';
    case 'ongoing':
      return 'success';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'grey';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'primary';
    case 'ongoing':
      return 'success';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'grey';
  }
};

const loadEvents = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/events');
    events.value = response.data.data || [];
    console.log('Loaded events:', events.value);
    
    // Add a test event if no events exist
    if (events.value.length === 0) {
      events.value = [{
        id: 1,
        tittle: 'Test Event',
        description: 'This is a test event',
        date: '2024-03-15',
        status: 'Upcoming'
      }];
    }
  } catch (error) {
    console.error('Error loading events:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to load events',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};

const openEventModal = (event = null) => {
  if (event) {
    isEditing.value = true;
    selectedEvent.value = event;
    eventForm.value = {
      tittle: event.tittle || '',
      description: event.description || '',
      date: event.date || '',
      status: event.status || 'Upcoming'
    };
  } else {
    isEditing.value = false;
    selectedEvent.value = null;
    eventForm.value = {
      tittle: '',
      description: '',
      date: '',
      status: 'Upcoming'
    };
  }
  eventModal.value = true;
};

const closeEventModal = () => {
  eventModal.value = false;
  isEditing.value = false;
  selectedEvent.value = null;
  eventForm.value = {
    tittle: '',
    description: '',
    date: '',
    status: 'Upcoming'
  };
};

const saveEvent = async () => {
  try {
    isSaving.value = true;
    
    // Create a plain object to avoid circular reference issues
    const eventData = {
      tittle: eventForm.value.tittle,
      description: eventForm.value.description,
      date: eventForm.value.date,
      status: eventForm.value.status
    };
    
    if (isEditing.value) {
      await api.put(`/events/${selectedEvent.value.id}`, eventData);
      ElNotification({
        title: 'Success',
        message: 'Event updated successfully',
        type: 'success',
      });
    } else {
      await api.post('/events', eventData);
      ElNotification({
        title: 'Success',
        message: 'Event created successfully',
        type: 'success',
      });
    }
    
    closeEventModal();
    loadEvents();
  } catch (error) {
    console.error('Error saving event:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to save event',
      type: 'error',
    });
  } finally {
    isSaving.value = false;
  }
};

const viewEvent = (event: any) => {
  selectedEvent.value = event;
  eventModal.value = true;
  isEditing.value = false;
  // Pre-fill form for viewing (read-only)
  eventForm.value = { ...event };
};

const editEvent = (event: any) => {
  console.log('Editing event:', event);
  isEditing.value = true;
  selectedEvent.value = event;
  eventForm.value = {
    tittle: event.tittle || '',
    description: event.description || '',
    date: event.date || '',
    status: event.status || 'Upcoming'
  };
  eventModal.value = true;
};

const deleteEvent = (event: any) => {
  selectedEvent.value = event;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await api.delete(`/events/${selectedEvent.value.id}`);
    ElNotification({
      title: 'Success',
      message: 'Event deleted successfully',
      type: 'success',
    });
    deleteDialog.value = false;
    loadEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to delete event',
      type: 'error',
    });
  }
};

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.events-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.v-card {
  border-radius: 12px;
}

::v-deep .v-data-table-header th {
  font-weight: bold;
}
</style>