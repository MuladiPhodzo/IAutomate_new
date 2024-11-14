<template>
  <q-page>
    <q-card class="edit-robot-card">
      <q-card-section>
        <h3>Edit Robot</h3>
      </q-card-section>
      
      <q-card-section>
        <q-input v-model="robot.name" label="Robot Name" />
        <q-input v-model="robot.version" label="Version" />
        <ul class="robot-stats-list">
          <li v-for="(stat, index) in robot.stats" :key="index">
            <q-input v-model="robot.stats[index]" label="Stat" />
          </li>
        </ul>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" @click="saveRobot" />
        <q-btn label="Cancel" color="secondary" @click="cancelEdit" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRobotStore } from 'stores/robotStore.js';

const robotStore = useRobotStore();
const route = useRoute();
const router = useRouter();

const robotId = route.params.id;
const robot = ref({ name: '', version: '', stats: [] });

onMounted(() => {
  const fetchedRobot = robotStore.robotsList.find(r => r.id === robotId);
  if (fetchedRobot) {
    robot.value = { ...fetchedRobot }; // Clone the object to prevent direct mutations
  }
});

async function saveRobot() {
  await robotStore.updateRobot(robot.value);
  router.push('/warehouse'); // Redirect back to the warehouse page after saving
}

function cancelEdit() {
  router.push('/warehouse'); // Redirect back without saving
}
</script>

<style scoped>
.edit-robot-card {
  max-width: 600px;
  margin: auto;
  background-color: beige;
}
.robot-stats-list {
  padding-left: 20px;
}
</style>
