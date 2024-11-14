<template>
    <q-card :key="id" class="custom-card" @click="navigateToDetails">
      <q-card-section>
        <div class="card-header">
          <h3>{{ name }}</h3>
        </div>
        <div class="card-body">
          <p class="card-stats">{{ stats }}</p>
        </div>
      </q-card-section>
    </q-card>
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

defineOptions ({
    name: 'RobotLink'
})

const router = useRouter();

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String, // Allow both string and object (for dynamic imports)
    required: true
  },
  stats: {
    type: String,
    required: true
  }
});

function navigateToDetails() {
  router.push(`/details/${props.id}`);
}
</script>

<style scoped>
    .custom-card {
      margin: 15px;
      cursor: pointer;
    }
    
    .card-header h3 {
      color: #D69404; /* Customize the color */
    }
    
    .card-stats {
      color: #888; /* Customize the color for stats */
    }
    </style>