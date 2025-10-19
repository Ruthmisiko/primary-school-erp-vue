<template>
  <div class="parent-dashboard">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6 text-primary">
          Welcome to Parent Portal
        </h1>
        <p class="text-h6 text-grey-darken-1 mb-8">
          Stay connected with your child's academic journey
        </p>
      </v-col>
    </v-row>

    <!-- Quick Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="primary" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-account-school</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ studentCount }}</h3>
          <p class="text-white">Children Enrolled</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="success" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-chart-line</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ averageGrade }}</h3>
          <p class="text-white">Average Grade</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="warning" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-credit-card</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">${{ totalFees }}</h3>
          <p class="text-white">Total Fees</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="info" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-calendar</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ upcomingEvents }}</h3>
          <p class="text-white">Upcoming Events</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Row -->
    <v-row>
      <!-- Recent Activities -->
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-timeline</v-icon>
            Recent Activities
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              class="mb-2"
            >
              <template v-slot:prepend>
                <v-avatar :color="activity.color" size="40">
                  <v-icon color="white">{{ activity.icon }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">
                {{ activity.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ activity.description }}
              </v-list-item-subtitle>
              <template v-slot:append>
                <span class="text-caption text-grey">{{ activity.time }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Quick Actions -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="(action, index) in quickActions"
              :key="index"
              class="mb-2"
              :to="action.route"
              link
            >
              <template v-slot:prepend>
                <v-icon :color="action.color">{{ action.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ action.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upcoming Events Preview -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-calendar-star</v-icon>
            Upcoming Events
          </v-card-title>
          <v-row>
            <v-col
              v-for="(event, index) in upcomingEventsList"
              :key="index"
              cols="12"
              md="4"
            >
              <v-card
                :color="event.color"
                variant="flat"
                class="pa-4 text-white"
              >
                <h4 class="text-h6 font-weight-bold mb-2">{{ event.title }}</h4>
                <p class="text-body-2 mb-2">{{ event.description }}</p>
                <div class="d-flex align-center">
                  <v-icon class="mr-1" size="small">mdi-calendar</v-icon>
                  <span class="text-caption">{{ event.date }}</span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores';
import { api } from '@/api';

const userStore = useUserStore();

// Data
const studentCount = ref(1);
const averageGrade = ref('A-');
const totalFees = ref('2,500');
const upcomingEvents = ref(3);

const recentActivities = ref([
  {
    title: 'New Grade Posted',
    description: 'Mathematics - Grade A',
    time: '2 hours ago',
    icon: 'mdi-chart-line',
    color: 'success'
  },
  {
    title: 'Payment Received',
    description: 'Monthly fee payment processed',
    time: '1 day ago',
    icon: 'mdi-credit-card',
    color: 'primary'
  },
  {
    title: 'Parent-Teacher Meeting',
    description: 'Scheduled for next week',
    time: '2 days ago',
    icon: 'mdi-account-group',
    color: 'info'
  },
  {
    title: 'Assignment Submitted',
    description: 'Science project completed',
    time: '3 days ago',
    icon: 'mdi-file-document',
    color: 'warning'
  }
]);

const quickActions = ref([
  {
    title: 'View Results',
    route: '/parent/results',
    icon: 'mdi-chart-line',
    color: 'success'
  },
  {
    title: 'Make Payment',
    route: '/parent/payments',
    icon: 'mdi-credit-card',
    color: 'primary'
  },
  {
    title: 'View Events',
    route: '/parent/events',
    icon: 'mdi-calendar',
    color: 'info'
  },
  {
    title: 'Contact School',
    route: '#',
    icon: 'mdi-phone',
    color: 'warning'
  }
]);

const upcomingEventsList = ref([]);

onMounted(() => {
  // Load parent dashboard data
  loadDashboardData();
});

const loadDashboardData = async () => {
  try {
    // Load dashboard data from API
    const response = await api.get('/parent/dashboard');
    const data = response.data.data;
    
    if (data) {
      studentCount.value = data.children_count || 0;
      totalFees.value = data.total_fees || 0;
      paidAmount.value = data.paid_amount || 0;
      pendingAmount.value = data.pending_amount || 0;
      upcomingEvents.value = data.upcoming_events || 0;
      recentActivities.value = data.recent_activities || [];
      
      // Calculate average grade (you can implement this based on your results data)
      if (data.children && data.children.length > 0) {
        // This is a placeholder - you might want to calculate this from results
        averageGrade.value = 'A-';
      }
    }

    // Load upcoming events
    const eventsResponse = await api.get('/parent/events');
    const events = eventsResponse.data.data || [];
    
    // Get upcoming events (limit to 3 for dashboard preview)
    upcomingEventsList.value = events
      .filter(event => event.status === 'Upcoming')
      .slice(0, 3)
      .map(event => ({
        title: event.tittle,
        description: event.description,
        date: formatEventDate(event.date),
        color: event.color
      }));
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

const formatEventDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.parent-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.v-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>