<template>
  <q-page class="login-page">
    <div class="login-container">
      <q-card class="login-card">
        <q-card-section>
          <div class="text-h6 text-center">{{ log ? 'Login' : 'Register' }}</div>
          <div class="q-mt-md">
            <q-btn-group spread>
              <q-btn flat color="white" text-color="black" label="Login" @click="log = true" />
              <q-btn flat color="white" text-color="black" label="Register" @click="log = false" />
            </q-btn-group>
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="log ? Login() : Register()">
            <div v-if="!log" class="q-pb-md">
              <q-btn-dropdown color="primary" label="Reg. type">
                <q-list>
                  <q-item clickable v-close-popup @click="regType = 'User'">
                    <q-item-section>
                      <q-item-label>User</q-item-label>
                    </q-item-section>
                  </q-item>
          
                  <q-item clickable v-close-popup @click="regType = 'Dev'">
                    <q-item-section>
                      <q-item-label>Dev</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <q-input v-model="email" label="Email" outlined dense clearable required autofocus />
            <q-input v-model="password" label="Password" type="password" outlined dense clearable required />
            <div v-if="!log" class="q-mt-md">
              <q-input v-model="username" label="Username" outlined dense clearable required />
            </div>
            <div class="q-mt-md">
              <q-btn :label="log ? 'Login' : 'Register'" color="primary" type="submit" class="full-width" />
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" v-if="log">
          <q-btn flat label="Forgot Password?" color="primary" @click="forgotPassword" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/userStore'
import background from 'assets/black-wallpaper.jpg'


const router = useRouter()
const userStore = useUserStore();

const log = ref(true)
const email = ref('')
const regType = ref('')
const password = ref('')
const username = ref('')
const userID = ref(null)



async function Login() {
   await userStore.handleLogin(email.value, password.value);
}

async function Register() {
  await handleRegister(username.value, email.value, password.value);
}

function forgotPassword() {
  console.log("Forgot password clicked.")
  // Add logic for "Forgot Password"
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('assets/black-wallpaper.jpg');
}

.login-container {
  max-width: 400px;
  width: 100%;
}

.login-card {
  padding: 20px;
  background-color: rgba(103, 101, 101, 0.764);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.full-width {
  width: 100%;
}
</style>
