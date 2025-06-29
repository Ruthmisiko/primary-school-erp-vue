<script setup lang="ts">
import { ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { createUser } from '@/api/auth';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

const checkbox = ref(false);
const show1 = ref(false);
const password = ref('');
const password_confirmation = ref('');
const email = ref('');
const Regform = ref();
const username = ref('');
const name = ref('');
const phone_number = ref('');
const loading = ref(false);
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length <= 10) || 'Password must be less than 10 characters'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

const handleErrors = (data: any) => {
  if (data?.data?.errors) {
    Object.values(data.data.errors).forEach((val: any) => {
      ElNotification({ title: "Error", message: val[0], type: "error" });
    });
  } else {
    ElNotification({ title: "Error", message: data?.data?.message || "Something went wrong", type: "error" });
  }
};

async function validate() {
  const isValid = await Regform.value?.validate();
  if (isValid) {
    loading.value = true;

    const payload = {
      name: name.value,
      username: username.value,
      email: email.value,
      phone_number: phone_number.value,
      password: password.value,
      password_confirmation: password.value
    };

    try {
      const response = await createUser(payload);
      if (response.status === 201 && response.data?.message) {
        ElNotification({
          title: "Success",
          message: response.data.message || "Registration successful",
          type: "success"
        });
        router.push('/dashboard');
      } else {
        handleErrors(response);
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      loading.value = false;
    }
  }
}
</script>

<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Sign up with Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">OR</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Sign up with Email address</h5>
  <v-form ref="Regform" lazy-validation action="/dashboards/analytical" class="mt-7 loginForm">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="name"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          label="name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="username"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          label="Username"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email Address / Username"
      class="mt-4 mb-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="phone_number"
      label="Phone Number"
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
     <v-text-field
      v-model="password_confirmation"
      :rules="passwordRules"
      label="Confirm Password"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput mt-8"
    ></v-text-field>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="Agree with?"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <a href="#" class="ml-1 text-lightText">Terms and Condition</a>
    </div>
    <v-btn color="secondary" block class="mt-2" variant="flat" size="large" @click="validate()">Sign Up</v-btn>
  </v-form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/login1" class="mt-2 text-capitalize mr-n2">Already have an account?</v-btn>
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
</style>
