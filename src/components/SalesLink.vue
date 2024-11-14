<template>
  <q-item
    clickable
    @click="goToRobotDetails(route)"
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