<template>
  <div class="parent-results">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-2 text-primary">
          Academic Results
        </h1>
        <p class="text-h6 text-grey-darken-1 mb-6">
          Track your child's academic performance and progress
        </p>
      </v-col>
    </v-row>

    <!-- Student Selection -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedStudent"
          :items="students"
          label="Select Student"
          variant="outlined"
          item-title="name"
          item-value="id"
          @update:model-value="loadStudentResults"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedTerm"
          :items="terms"
          label="Select Term"
          variant="outlined"
          @update:model-value="loadStudentResults"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedYear"
          :items="academicYears"
          label="Select Academic Year"
          variant="outlined"
          @update:model-value="loadStudentResults"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Performance Overview -->
    <v-row class="mb-6" v-if="selectedStudent">
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="primary" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-chart-line</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ overallGrade }}</h3>
          <p class="text-white">Overall Grade</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="success" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-trophy</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ rank }}</h3>
          <p class="text-white">Class Rank</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="info" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-percent</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ percentage }}%</h3>
          <p class="text-white">Percentage</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 text-center" color="warning" variant="flat">
          <v-icon size="48" color="white" class="mb-2">mdi-trending-up</v-icon>
          <h3 class="text-h5 text-white font-weight-bold">{{ improvement }}</h3>
          <p class="text-white">Improvement</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Subject-wise Results -->
    <v-row v-if="selectedStudent">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-book-open</v-icon>
            Subject-wise Results
          </v-card-title>
          
          <v-data-table
            :headers="subjectHeaders"
            :items="subjectResults"
            :loading="isLoadingResults"
            class="elevation-1"
          >
            <template v-slot:item.subject="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getSubjectColor(item.subject)" size="32" class="mr-3">
                  <v-icon color="white" size="16">{{ getSubjectIcon(item.subject) }}</v-icon>
                </v-avatar>
                <span class="font-weight-medium">{{ item.subject }}</span>
              </div>
            </template>
            
            <template v-slot:item.marks="{ item }">
              <span class="font-weight-bold">{{ item.marks }}/{{ item.totalMarks }}</span>
            </template>
            
            <template v-slot:item.grade="{ item }">
              <v-chip
                :color="getGradeColor(item.grade)"
                size="small"
                class="font-weight-bold"
              >
                {{ item.grade }}
              </v-chip>
            </template>
            
            <template v-slot:item.percentage="{ item }">
              <div class="d-flex align-center">
                <v-progress-linear
                  :model-value="item.percentage"
                  :color="getGradeColor(item.grade)"
                  height="8"
                  rounded
                  class="mr-2"
                  style="width: 60px"
                ></v-progress-linear>
                <span class="text-caption">{{ item.percentage }}%</span>
              </div>
            </template>
            
            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chart-line</v-icon>
                <h3 class="text-h6 font-weight-bold text-grey-darken-1 mb-2">
                  No Results Found
                </h3>
                <p class="text-grey-darken-1">
                  No results available for the selected criteria.
                </p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Performance Chart -->
    <v-row v-if="selectedStudent" class="mt-6">
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-chart-areaspline</v-icon>
            Performance Trend
          </v-card-title>
          
          <div class="chart-container">
            <!-- TODO: Implement chart component -->
            <div class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chart-line</v-icon>
              <h3 class="text-h6 font-weight-bold text-grey-darken-1 mb-2">
                Performance Chart
              </h3>
              <p class="text-grey-darken-1">
                Chart visualization will be implemented here.
              </p>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-medal</v-icon>
            Achievements
          </v-card-title>
          
          <v-list>
            <v-list-item
              v-for="(achievement, index) in achievements"
              :key="index"
              class="mb-2"
            >
              <template v-slot:prepend>
                <v-avatar :color="achievement.color" size="32">
                  <v-icon color="white" size="16">{{ achievement.icon }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">
                {{ achievement.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ achievement.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Student Selected Message -->
    <v-row v-if="!selectedStudent">
      <v-col cols="12" class="text-center">
        <v-card class="pa-8" elevation="1">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-school</v-icon>
          <h3 class="text-h5 font-weight-bold text-grey-darken-1 mb-2">
            Select a Student
          </h3>
          <p class="text-grey-darken-1">
            Please select a student to view their academic results.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api } from '@/api';

// Data
const selectedStudent = ref(null);
const selectedTerm = ref('Term 1');
const selectedYear = ref('2023-2024');
const isLoadingResults = ref(false);

const overallGrade = ref('A-');
const rank = ref('5th');
const percentage = ref('85');
const improvement = ref('+5%');

const students = ref([]);

const terms = ref([
  'Term 1',
  'Term 2',
  'Term 3',
  'All Terms'
]);

const academicYears = ref([
  '2023-2024',
  '2022-2023',
  '2021-2022'
]);

const subjectHeaders = ref([
  { title: 'Subject', key: 'subject', sortable: true },
  { title: 'Marks', key: 'marks', sortable: true },
  { title: 'Grade', key: 'grade', sortable: true },
  { title: 'Percentage', key: 'percentage', sortable: true },
  { title: 'Remarks', key: 'remarks', sortable: false }
]);

const subjectResults = ref([
  {
    subject: 'Mathematics',
    marks: '85',
    totalMarks: '100',
    grade: 'A',
    percentage: 85,
    remarks: 'Excellent work!'
  },
  {
    subject: 'English',
    marks: '78',
    totalMarks: '100',
    grade: 'B+',
    percentage: 78,
    remarks: 'Good progress'
  },
  {
    subject: 'Science',
    marks: '92',
    totalMarks: '100',
    grade: 'A+',
    percentage: 92,
    remarks: 'Outstanding!'
  },
  {
    subject: 'Social Studies',
    marks: '80',
    totalMarks: '100',
    grade: 'A-',
    percentage: 80,
    remarks: 'Well done'
  },
  {
    subject: 'Art',
    marks: '88',
    totalMarks: '100',
    grade: 'A',
    percentage: 88,
    remarks: 'Creative work'
  }
]);

const achievements = ref([
  {
    title: 'Top Performer',
    description: 'Mathematics - Term 1',
    icon: 'mdi-trophy',
    color: 'gold'
  },
  {
    title: 'Perfect Attendance',
    description: 'No absences this term',
    icon: 'mdi-calendar-check',
    color: 'success'
  },
  {
    title: 'Science Fair Winner',
    description: '1st place in school science fair',
    icon: 'mdi-medal',
    color: 'primary'
  }
]);

// Methods
const getSubjectColor = (subject: string) => {
  const colors = {
    'Mathematics': 'blue',
    'English': 'green',
    'Science': 'purple',
    'Social Studies': 'orange',
    'Art': 'pink'
  };
  return colors[subject] || 'grey';
};

const getSubjectIcon = (subject: string) => {
  const icons = {
    'Mathematics': 'mdi-calculator',
    'English': 'mdi-book-open',
    'Science': 'mdi-flask',
    'Social Studies': 'mdi-earth',
    'Art': 'mdi-palette'
  };
  return icons[subject] || 'mdi-book';
};

const getGradeColor = (grade: string) => {
  if (grade.includes('A+')) return 'success';
  if (grade.includes('A')) return 'success';
  if (grade.includes('B+')) return 'info';
  if (grade.includes('B')) return 'info';
  if (grade.includes('C+')) return 'warning';
  if (grade.includes('C')) return 'warning';
  if (grade.includes('D')) return 'error';
  return 'grey';
};

const loadStudentResults = async () => {
  if (!selectedStudent.value) return;
  
  isLoadingResults.value = true;
  
  try {
    // Load results from API
    const params = new URLSearchParams();
    if (selectedStudent.value) params.append('student_id', selectedStudent.value);
    if (selectedTerm.value) params.append('term', selectedTerm.value);
    if (selectedYear.value) params.append('year', selectedYear.value);
    
    const response = await api.get(`/parent/children/results?${params.toString()}`);
    const results = response.data.data || [];
    
    // Update subject results with real data
    subjectResults.value = results.map(result => ({
      subject: result.subject,
      marks: result.marks,
      totalMarks: result.total_marks,
      grade: result.grade,
      percentage: Math.round((result.marks / result.total_marks) * 100),
      remarks: result.remarks || 'Good work'
    }));
    
    // Calculate overall statistics
    if (results.length > 0) {
      const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
      const totalPossibleMarks = results.reduce((sum, r) => sum + r.total_marks, 0);
      percentage.value = Math.round((totalMarks / totalPossibleMarks) * 100);
      
      // Calculate grade based on percentage
      if (percentage.value >= 90) overallGrade.value = 'A+';
      else if (percentage.value >= 80) overallGrade.value = 'A';
      else if (percentage.value >= 70) overallGrade.value = 'B+';
      else if (percentage.value >= 60) overallGrade.value = 'B';
      else if (percentage.value >= 50) overallGrade.value = 'C+';
      else overallGrade.value = 'C';
    }
    
  } catch (error) {
    console.error('Error loading results:', error);
  } finally {
    isLoadingResults.value = false;
  }
};

const loadStudents = async () => {
  try {
    const response = await api.get('/parent/children');
    students.value = response.data.data || [];
    
    if (students.value.length > 0) {
      selectedStudent.value = students.value[0].id;
      studentName.value = students.value[0].name;
      studentClass.value = students.value[0].class;
    }
  } catch (error) {
    console.error('Error loading students:', error);
  }
};

onMounted(() => {
  // Load initial data
  loadStudents();
});
</script>

<style scoped>
.parent-results {
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

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>