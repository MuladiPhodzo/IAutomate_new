
<template>
    <q-layout view="hHh lpr fFf">
        <div>
            <h1>Hubs</h1>
        </div>
    </q-layout>
</template>
      
    

<script setup>
import { ref } from 'vue'

defineOptions ({
    name:'HubsPage'
})

    const leftDrawerOpen = ref(false)

    
    function toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
</script>