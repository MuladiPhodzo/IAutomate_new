<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="home"
          aria-label="Menu"
          @click="GoHome"
        />

        <q-toolbar-title class="title">
          Create New Robot:
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="form-container">
        <q-form color="skyblue" @submit.prevent="createRobot" class="robotform">
          <q-input
            v-model="robotName"
            label="Robot Name"
            outlined
            required
          />
          <q-input
            v-model="Developer"
            label="Developer"
            outlined
            required
          />
          <q-input
          v-model="efficiency"
          label="Efficiency"
          hint="Enter efficiency percentage (e.g., 89%)"
          outlined
          stack-label
          required
        />
        
        <q-input
          v-model="rwRatio"
          label="R/W Ratio"
          hint="Enter read/write ratio (e.g., 2:3)"
          outlined
          stack-label
          required
        />
        
        <q-input
          v-model="status"
          label="Status"
          hint="Enter robot status (e.g., Running)"
          outlined
          stack-label
          required
        />
          <q-input
            v-model="robotVersion"
            label="Robot Version"
            outlined
            type="textarea"
            required
          />

          <q-toggle 
            v-model="publishRobot" 
            label="Publish to Marketplace" 
            color="primary" 
          />

          <q-btn
            label="Create Robot"
            style="background: goldenrod; color: white"
            type="submit"
            class="full-width"
          />
        </q-form>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

import { useRobotStore } from 'stores/robotStore.js'
import { useMarketStore } from 'stores/salesStore.js'
import { useUserStore } from 'stores/userStore';
import { auth } from '../firebase/firebase.js'

defineOptions({
  name: 'NewRobotPage'
})

const router = useRouter();
const userStore = useUserStore();
const marketStore = useMarketStore();

// Store initialization
const robotStore = useRobotStore()

// Model to hold form input values
const robotName = ref('');
const robotStats = ref('');
const robotVersion = ref('');
const efficiency = ref('');
const rwRatio = ref('');
const status = ref('');
const publishRobot = ref('false');
const Developer = ref('');

const userID = userStore.userID;

console.log('robot/userID:', userID)

// Function to handle form submission and create a new robot
async function createRobot() {
  // Create a new robot object
  const newRobot = {
    id: userID, // Using timestamp as a unique ID
    developer: Developer.value,
    name: robotName.value,
    stats: [
      `Efficiency: ${efficiency.value}`,
      `R/W Ratio: ${rwRatio.value}`,
      `Status: ${status.value}`
    ], // Converting stats to a list
    version: robotVersion.value,
    publish: publishRobot.value
  }
  if (publishRobot.value){
    await marketStore.addRobot(newRobot);
    await robotStore.addRobot(newRobot);
  } else {
    await robotStore.addRobot(newRobot);
  }

 
  // Store the robot details (can be persisted in a real backend, but we'll use local storage here)
  // Navigate back to the warehouse page
}

// Function to navigate back to the warehouse
function GoHome() {
  router.push('/warehouse')
}

  robotVersion.value = '';
  efficiency.value = '';
  rwRatio.value = '';
  status.value = '';
  robotVersion.value = '';
  publishRobot.value = false;
</script>

<style scoped>
.title {
  text-align: center;
  color: white;
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
 
}

.full-width {
  width: 100%;
}

.q-form{
	background-color: skyblue;

}
</style>
