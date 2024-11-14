<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="arrow_back" @click="goBack" aria-label="Go back" />
        <q-toolbar-title>Settings</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="settings-section">
          <h2>Account Settings</h2>
          <q-input v-model="username" label="Username" outlined />
          <q-input v-model="email" label="Email" outlined type="email" />
          <q-input v-model="password" label="Password" outlined type="password" />
        </div>

        <q-separator spaced />

        <div class="settings-section">
          <h2>Notifications</h2>
          <q-toggle v-model="notifications" label="Enable Notifications" />
          <q-toggle v-model="emailNotifications" label="Email Notifications" />
          <q-toggle v-model="smsNotifications" label="SMS Notifications" />
        </div>

        <q-separator spaced />
        <div class="settings-section">
          <h2>App Preferences</h2>
          <q-select
            v-model="theme"
            label="Theme"
            :options="themes"
            outlined
          />
          <q-toggle v-model="darkMode" label="Enable Dark Mode" />
          <q-checkbox v-model="autoUpdate" label="Enable Auto-Update" />
        </div>

        <!-- Save Button -->
        <q-btn
          label="Save Settings"
          color="primary"
          class="save-btn"
          @click="saveSettings"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const username = ref('');
const email = ref('');
const password = ref('');
const notifications = ref(true);
const emailNotifications = ref(true);
const smsNotifications = ref(false);
const theme = ref('light');
const darkMode = ref(false);
const autoUpdate = ref(false);

// Theme options
const themes = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System Default', value: 'system' }
];

// Save settings
function saveSettings() {
  // Implement save logic here, e.g., API call or store action
  console.log('Settings saved:', {
    username: username.value,
    email: email.value,
    password: password.value,
    notifications: notifications.value,
    emailNotifications: emailNotifications.value,
    smsNotifications: smsNotifications.value,
    theme: theme.value,
    darkMode: darkMode.value,
    autoUpdate: autoUpdate.value,
  });
}

// Navigation function
function goBack() {
  router.back();
}
</script>

<style scoped>
.settings-section {
  margin-bottom: 24px;
}

.settings-section h2 {
  font-weight: bold;
  margin-bottom: 16px;
}

.save-btn {
  width: 100%;
  margin-top: 20px;
}
</style>
