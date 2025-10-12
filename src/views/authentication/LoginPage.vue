<script setup lang="ts">
import Logo from '@/layouts/full/logo/LogoDark.vue';
import AuthLogin from './authForms/AuthLogin.vue';
</script>

<template>
  <v-row class="h-screen auth-background" no-gutters>
    <!---Left Part-->
    <v-col cols="12" class="d-flex align-center">
      <v-container>
        <div class="pa-7 pa-sm-12">
          <v-row justify="center">
            <v-col cols="12" lg="10" xl="6" md="7">
              <v-card elevation="8" class="loginBox auth-card">
                <v-card variant="flat">
                  <v-card-text class="pa-9">
                    <!---Left Part Logo -->
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <Logo />
                        <h2 class="text-secondary text-h2 mt-8">Hi, Welcome Back</h2>
                        <h4 class="text-disabled text-h4 mt-3">Enter your credentials to continue</h4>
                      </v-col>
                    </v-row>
                    <!---Left Part Logo -->

                    <!---Left Part Form-->
                    <AuthLogin />
                    <!---Left Part Form-->
                  </v-card-text>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Left Part-->
  </v-row>
</template>
<style lang="scss">
.auth-background {
  background: linear-gradient(135deg, #e8ebfa 0%, #f0ebf8 100%) !important;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
}

.loginBox {
  max-width: 475px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15) !important;
}
</style>
