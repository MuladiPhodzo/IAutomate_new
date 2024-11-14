
<template>
  <q-page class="charts-page">
      <div class="content-wrapper">
          <h1>Charts</h1>
      </div>
  </q-page>
</template>
    
  

<script setup>
import { ref } from 'vue'

defineOptions ({
  name:'ChartsPage'
})

  const leftDrawerOpen = ref(false)

  
  function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
</script>

<style scoped>
.charts-page{
  
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('assets/forex1.png');
  background-size: cover; /* Ensures the image covers the full screen */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  height: 100vh; /* Full viewport height */
  width: 100vw;
  margin: 0; /* Remove any extra margins */
  padding: 0;
}
</style>