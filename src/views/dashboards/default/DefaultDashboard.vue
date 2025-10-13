<script setup lang="ts">
// imported components
import TotalEarning from './components/TotalEarning.vue';
import TotalOrder from './components/TotalOrder.vue';
import TotalIncome from './components/TotalIncome.vue';
import TotalGrowth from './components/TotalGrowth.vue';
import PopularStocks from './components/PopularStocks.vue';
import MonthlyEnrollment from './components/MonthlyEnrollment.vue';
import TotalSuppliers from './components/TotalSuppliers.vue';
import TotalExpenses from './components/TotalExpenses.vue';
import MonthlyExpenseChart from './components/MonthlyExpenseChart.vue';
</script>

<template>
  <v-row>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Earning -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalEarning />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Order -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalOrder />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Income -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalIncome />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Monthly Enrollment Statistics -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <MonthlyEnrollment />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Total Suppliers and Expenses -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="4">
      <v-row>
        <v-col cols="12">
          <TotalSuppliers />
        </v-col>
        <v-col cols="12">
          <TotalExpenses />
        </v-col>
        <v-col cols="12">
          <MonthlyExpenseChart />
        </v-col>
      </v-row>
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Total Growth (Optional - can be removed or kept) -->
    <!-- -------------------------------------------------------------------- -->
    <!-- <v-col cols="12" lg="8">
      <TotalGrowth />
    </v-col> -->
  </v-row>
</template>
