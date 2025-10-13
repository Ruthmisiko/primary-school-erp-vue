<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fetchExpenseStats } from '@/api/dashboard';

const loading = ref(true);
const expenseData = ref<any>(null);

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      height: 200,
      fontFamily: `'Roboto', sans-serif`,
      foreColor: '#a1aab2',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      }
    },
    colors: ['#0288d1'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
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
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    xaxis: {
      type: 'category',
      categories: expenseData.value?.monthly_data?.map((m: any) => m.month) || [],
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: 500
        },
        formatter: (value: number) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M'
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K'
          }
          return value.toFixed(0)
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value)
        }
      }
    },
    markers: {
      size: 3,
      colors: ['#0288d1'],
      strokeColors: '#fff',
      strokeWidth: 1,
      hover: {
        size: 5
      }
    }
  };
});

const chartSeries = computed(() => {
  if (!expenseData.value?.monthly_data) {
    return [];
  }

  return [
    {
      name: 'Expenses',
      data: expenseData.value.monthly_data.map((m: any) => m.amount)
    }
  ];
});

const loadExpenseData = async () => {
  loading.value = true;
  try {
    const currentYear = new Date().getFullYear();
    const response = await fetchExpenseStats(currentYear);
    
    if (response && response.data) {
      if (response.data.success || response.data.data) {
        expenseData.value = response.data.data || response.data;
      }
    }
  } catch (error) {
    console.error('Error loading expense stats:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadExpenseData();
});
</script>

<template>
  <v-card variant="outlined" class="mt-3">
    <v-card-text class="pa-3">
      <h6 class="text-subtitle-2 font-weight-bold mb-2">Monthly Expenses ({{ new Date().getFullYear() }})</h6>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center pa-4">
        <v-progress-circular indeterminate color="info" size="32"></v-progress-circular>
      </div>

      <!-- Chart -->
      <div v-else-if="expenseData && chartSeries.length > 0">
        <apexchart 
          type="line" 
          height="200" 
          :options="chartOptions" 
          :series="chartSeries"
        ></apexchart>
      </div>

      <!-- No Data State -->
      <div v-else class="text-center pa-4">
        <p class="text-caption text-medium-emphasis">No expense data available</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add custom styles if needed */
</style>
