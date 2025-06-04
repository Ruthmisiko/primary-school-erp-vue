<script setup lang="ts">
import { ref,h, reactive } from 'vue';
import {useUserStore} from "@/stores"
import { useRoute, useRouter } from 'vue-router';
import {ElMessage, ElNotification} from "element-plus";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import {login} from "@/api/auth";

const submitting = ref(false);
const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref('admin123');
const username = ref('info@codedthemes.com');
const passwordRules = ref([
  (v: string) => !!v || 'Password is required'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
const router = useRouter();
const route = useRoute();

/* eslint-disable @typescript-eslint/no-explicit-any */
function validate(values: any, { setErrors }: any) {
  const authStore = useAuthStore();
  handleSubmit()
  // return authStore.login(username.value, password.value).catch((error) => setErrors({ apiError: error }));
  
}
const userStore = useUserStore();
const formModel = reactive({
  email: '',
  password: ''
});

const handleSubmit = async () => {
  // if (formValid.value === true) {
    submitting.value = true;
    try {
      login({
        // grant_type: import.meta.env.VITE_APP_GRANT_TYPE,
        // client_id: import.meta.env.VITE_APP_CLIENT_ID,
        // client_secret: import.meta.env.VITE_APP_CLIENT_SECRET,
        email: formModel.email,
        password: formModel.password
      }).then((response) => {
        if (response.status == 200) {

          submitting.value = false;
          
          ElMessage({
        message: h(
            'hi',
            {style: 'color: teal'},
            `Welcome ${
                response.data.user?.name
            } to your dashboard`
        ),
        type: 'success',
      });
          router.replace(route.query.to ? String(route.query.to) : '/dashboard');
        } else {
          submitting.value = false;
          ElNotification({
        title: "Error",
        message: response.data.message,
        type: "error",
      });
        }
      });
    } catch (error) {
      submitting.value = false;
      console.log(error);
    }
  // }
};

</script>

<template>
  <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">Login</h3>
    <router-link to="/auth/register" class="text-primary text-decoration-none">Don't Have an account?</router-link>
  </div>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors }">
    <div class="mb-6">
      <v-label>Email Address</v-label>
      <v-text-field
        aria-label="email address"
        v-model="formModel.email"
        :rules="emailRules"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
    </div>
    <div>
      <v-label>Password</v-label>
      <v-text-field
        aria-label="password"
        v-model="formModel.password"
        :rules="passwordRules"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="mt-2"
      >
        <template v-slot:append-inner>
          <v-btn color="secondary" icon rounded variant="text">
            <EyeInvisibleOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == false" @click="show1 = !show1" />
            <EyeOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == true" @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="d-flex align-center mt-4 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="Keep me sign in"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <div class="ml-auto">
        <router-link to="/auth/login" class="text-darkText link-hover">Forgot Password?</router-link>
      </div>
    </div>
    <v-btn color="primary" :loading="submitting" block class="mt-5" variant="flat" size="large" :disabled="valid" type="submit">
      Login</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
<style lang="scss">
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>