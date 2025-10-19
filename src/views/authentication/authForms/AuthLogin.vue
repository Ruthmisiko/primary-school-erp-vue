
<script setup lang="ts">
import { ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import { useAuthStore } from '@/stores/auth'; // Sync with guard
import { api } from '@/api';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const checkbox = ref(false);
const show1 = ref(false);
const username = ref('');
const password = ref('');
const loading = ref(false);
const loginForm = ref();

const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length <= 10) || 'Password must be less than 10 characters',
]);
const emailRules = ref([
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]);

async function validate() {
  const isValid = await loginForm.value?.validate();
  if (isValid) {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', {
        email: username.value,
        password: password.value,
      });
      const astonish = response.data.message;
      console.log('Response message:', astonish, 'Full response:', response.data);
      if (astonish === 'Login successful') {
        try {
          if (typeof userStore.setToken === 'function') {
            userStore.setToken(response.data.token);
            userStore.setUsername(response.data.user.username);
            userStore.setUser(response.data.user);
            // Sync with authStore for guard
            authStore.user = response.data.user; // Match User interface
            // Store user with token in localStorage so API interceptor can access it
            const userDataWithToken = { ...response.data.user, token: response.data.token };
            localStorage.setItem('user', JSON.stringify(userDataWithToken));
            console.log('Token stored in userStore:', userStore.getAccessToken);
            console.log('User stored in authStore:', authStore.user);
          } else {
            console.error('setToken is not a function');
            throw new Error('User store is not properly configured');
          }
          // Redirect based on user type
          const redirectPath = response.data.user.userType === 'parent' ? '/parent/dashboard' : '/dashboard';
          await router.push(redirectPath).catch((error) => {
            console.error('Navigation error:', error);
            ElNotification({
              title: 'Error',
              message: 'Failed to redirect to dashboard: ' + error.message,
              type: 'error',
            });
            throw error;
          });
          console.log('Redirected to', redirectPath);
        } catch (error) {
          console.error('Router or store error:', error);
          ElNotification({
            title: 'Error',
            message: 'Failed to store data or redirect to dashboard',
            type: 'error',
          });
        }
      } else {
        ElNotification({
          title: 'Error',
          message: astonish || 'Something went wrong',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      ElNotification({
        title: 'Error',
        message: error.response?.data?.message || 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      loading.value = false;
    }
  }
}
</script>

<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Sign in with Google</span>
  </v-btn>
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">OR</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Sign in with Email address</h5>
  <v-form ref="loginForm" lazy-validation class="mt-7 loginForm">
    <v-text-field
      v-model="username"
      :rules="emailRules"
      label="Email Address"
      class="mt-4 mb-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Password"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>
    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="Remember me?"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <div class="ml-auto">
        <a href="javascript:void(0)" class="text-primary text-decoration-none">Forgot password?</a>
      </div>
    </div>
    <v-btn
      color="secondary"
      :loading="loading"
      block
      class="mt-2"
      variant="flat"
      size="large"
      @click="validate"
    >
      Sign In
    </v-btn>
  </v-form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/register" class="mt-2 text-capitalize mr-n2">Don't have an account?</v-btn>
  </div>
</template>

<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>