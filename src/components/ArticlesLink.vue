<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="props.link"
  >
    <q-item-section avatar>
      <!-- Display the image, if provided -->
      <img v-if="image" :src="image" alt="Article Image" class="article-image" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="q-article-title">{{ props.title }}</q-item-label>
      <q-item-label caption class="q-article-caption">{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineOptions({
  name: 'ArticlesLink'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },
  image: {
    type: [String, Object], // Allow both string and object (for dynamic imports)
    default: ""
  },

  link: {
    type: String,
    default: '#'
  },
})
</script>

<style scoped>
  .article-item {
    margin: 10px;
    display: flex;
    align-items: center;
  }
  
  .article-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
  }

  .q-article-title {
    color:#D69404; /* Use a CSS variable for consistency */
  }

  .q-article-caption {
    color:#D69404; /* Match caption color */
    font-size: 20px;
  }
</style>
