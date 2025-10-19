<template>
  <div class="parent-events">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-2 text-primary">
          Upcoming Events
        </h1>
        <p class="text-h6 text-grey-darken-1 mb-6">
          Stay updated with school events and activities
        </p>
      </v-col>
    </v-row>

    <!-- Filter and Search -->
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
          v-model="selectedCategory"
          :items="categories"
          label="Category"
          variant="outlined"
          clearable
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Month"
          variant="outlined"
          clearable
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <!-- Events List -->
    <v-row>
      <v-col
        v-for="(event, index) in filteredEvents"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="event-card"
          elevation="2"
          :color="event.color"
          variant="flat"
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center mb-3">
              <v-avatar :color="event.iconColor" size="48" class="mr-3">
                <v-icon color="white" size="24">{{ event.icon }}</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold text-white mb-1">
                  {{ event.title }}
                </h3>
                <p class="text-caption text-white mb-0">
                  {{ event.category }}
                </p>
              </div>
            </div>
            
            <p class="text-white mb-3">
              {{ event.description }}
            </p>
            
            <div class="d-flex align-center mb-3">
              <v-icon color="white" size="small" class="mr-2">mdi-calendar</v-icon>
              <span class="text-white text-body-2">{{ event.date }}</span>
            </div>
            
            <div class="d-flex align-center mb-3">
              <v-icon color="white" size="small" class="mr-2">mdi-clock</v-icon>
              <span class="text-white text-body-2">{{ event.time }}</span>
            </div>
            
            <div class="d-flex align-center mb-3">
              <v-icon color="white" size="small" class="mr-2">mdi-map-marker</v-icon>
              <span class="text-white text-body-2">{{ event.location }}</span>
            </div>
            
            <v-chip
              :color="event.statusColor"
              size="small"
              class="text-white"
            >
              {{ event.status }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Events Message -->
    <v-row v-if="filteredEvents.length === 0">
      <v-col cols="12" class="text-center">
        <v-card class="pa-8" elevation="1">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-calendar-blank</v-icon>
          <h3 class="text-h5 font-weight-bold text-grey-darken-1 mb-2">
            No Events Found
          </h3>
          <p class="text-grey-darken-1">
            No events match your current filters. Try adjusting your search criteria.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api } from '@/api';
import { ElNotification } from 'element-plus';

// Data
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedMonth = ref('');

const categories = ref([
  'Academic',
  'Sports',
  'Cultural',
  'Parent-Teacher',
  'Holiday',
  'Exam'
]);

const months = ref([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]);

const events = ref([]);

// Computed
const filteredEvents = computed(() => {
  let filtered = events.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(event => event.category === selectedCategory.value);
  }

  if (selectedMonth.value) {
    filtered = filtered.filter(event => event.date.includes(selectedMonth.value));
  }

  return filtered;
});

onMounted(() => {
  loadEvents();
});

const loadEvents = async () => {
  try {
    // Load events from API
    const response = await api.get('/parent/events');
    events.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading events:', error);
    ElNotification({
      title: 'Error',
      message: 'Failed to load events',
      type: 'error',
    });
  }
};
</script>

<style scoped>
.parent-events {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.event-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  height: 100%;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>