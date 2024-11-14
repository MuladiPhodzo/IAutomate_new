<template>
  <q-item
    clickable
    @click="goToLink(route)"
    class="widget-item"
  >
    <q-item-section
      v-if="iconSrc"
      avatar
      class="icon-section"
    >
      <img :src="iconSrc" alt="Icon" class="widget-icon" />
    </q-item-section>
    <q-item-section>
      <span class="widget-title">{{ title }}</span>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: [String, Object], // Allow both string and object (for dynamic imports)
    required: true
  },
  route: {
    type: String,
    required: true
  }
});

const iconSrc = ref('');

onMounted(async () => {
  if (typeof props.icon === 'function') {
    iconSrc.value = await props.icon();
  } else {
    iconSrc.value = props.icon;
  }
});

function goToLink(page) {
  router.push(page);
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-around; /* Distribute space evenly */
  align-items: center; /* Center items vertically */
  
}

.widget-item {
  display: flex;
  flex-direction: column; /* Stack icon and title vertically */
  align-items: center; /* Center items */
  flex: 1; /* Allow items to grow */
  padding: 10px;
}

.icon-section {
  display: flex;
  justify-content: center; /* Center the icon */
}

.widget-icon {
  width: 32px; /* Set the width of the icon */
  height: 32px; /* Set the height of the icon */
  padding: auto;
}

.widget-title {
  margin-top: 4px; /* Space between icon and title */
  text-align: center; /* Center align title */
  font-size: 12px;
  color: #D69404
}
</style>
