<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fetchEnrollmentStats } from '@/api/dashboard';

const loading = ref(true);
const enrollmentData = ref<any>(null);
const selectedYear = ref(new Date().getFullYear());

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    yearsList.push(i);
  }
  return yearsList;
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      height: 350,
      fontFamily: `'Roboto', sans-serif`,
      foreColor: '#a1aab2',
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    colors: ['#5e35b1', '#1e88e5'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      type: 'category',
      categories: enrollmentData.value?.monthly_data?.map((m: any) => m.month) || [],
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Students',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        formatter: (value: number) => Math.round(value).toString()
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '13px',
      fontWeight: 600,
      markers: {
        width: 12,
        height: 12,
        radius: 12
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => `${value} students`
      }
    },
    markers: {
      size: 4,
      colors: ['#5e35b1'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    }
  };
});

const chartSeries = computed(() => {
  if (!enrollmentData.value?.monthly_data) {
    return [];
  }

  return [
    {
      name: 'New Enrollments',
      data: enrollmentData.value.monthly_data.map((m: any) => m.count)
    }
  ];
});

const loadEnrollmentData = async () => {
  loading.value = true;
  try {
    const response = await fetchEnrollmentStats(selectedYear.value);
    
    if (response && response.data) {
      if (response.data.success || response.data.data) {
        enrollmentData.value = response.data.data || response.data;
        console.log('Enrollment data loaded:', enrollmentData.value);
      }
    }
  } catch (error) {
    console.error('Error loading enrollment stats:', error);
  } finally {
    loading.value = false;
  }
};

const changeYear = async () => {
  await loadEnrollmentData();
};

onMounted(async () => {
  await loadEnrollmentData();
});
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <h4 class="text-h4 font-weight-bold">Monthly Enrollment Statistics</h4>
            <p class="text-subtitle-2 text-medium-emphasis mt-1">Student enrollment trends for {{ selectedYear }}</p>
          </div>
          <v-select
            v-model="selectedYear"
            :items="years"
            density="compact"
            variant="outlined"
            style="max-width: 120px"
            @update:model-value="changeYear"
          ></v-select>
        </div>

        <!-- Statistics Summary -->
        <v-row class="mb-4" v-if="enrollmentData">
          <v-col cols="12" md="4">
            <v-card variant="tonal" color="primary" class="pa-3">
              <p class="text-subtitle-2 mb-1">Total Enrollments {{ selectedYear }}</p>
              <h3 class="text-h3 font-weight-bold">{{ enrollmentData.total_for_year || 0 }}</h3>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="tonal" color="info" class="pa-3">
              <p class="text-subtitle-2 mb-1">Previous Year ({{ selectedYear - 1 }})</p>
              <h3 class="text-h3 font-weight-bold">{{ enrollmentData.previous_year_total || 0 }}</h3>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card 
              variant="tonal" 
              :color="enrollmentData.percentage_change >= 0 ? 'success' : 'error'" 
              class="pa-3"
            >
              <p class="text-subtitle-2 mb-1">Growth Rate</p>
              <h3 class="text-h3 font-weight-bold">
                {{ enrollmentData.percentage_change >= 0 ? '+' : '' }}{{ enrollmentData.percentage_change }}%
              </h3>
            </v-card>
          </v-col>
        </v-row>

        <!-- Loading State -->
        <div v-if="loading" class="text-center pa-10">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4">Loading enrollment data...</p>
        </div>

        <!-- Chart -->
        <div v-else-if="enrollmentData && chartSeries.length > 0">
          <apexchart 
            type="line" 
            height="350" 
            :options="chartOptions" 
            :series="chartSeries"
          ></apexchart>
        </div>

        <!-- No Data State -->
        <div v-else class="text-center pa-10">
          <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
          <p class="mt-4 text-h6">No enrollment data available</p>
          <p class="text-body-2 text-medium-emphasis">Students will appear here as they are enrolled</p>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped>
/* Add custom styles if needed */
</style>
