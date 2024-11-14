<template>
  <q-layout view="hHh lpr fFf">
    <q-drawer v-show="leftDashboard" persistent side="left" :width="250" bordered>
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section>Dashboard Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>accounts</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section></q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <!-- Add more items as needed -->
      </q-list>
    </q-drawer>
    <q-page-container>
      <div v-for="article in articles" :key="article.title">
        <a
          :href="article.link"
          target="_blank"
          rel="noopener noreferrer"
          style="text-decoration: none;"
        >
          <div >
            <q-card 
              v-for="article in articles" 
              :key="article.id" 
              v-bind="article" 
              :style="{
                backgroundImage: `url(${article.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }"
              >
                <q-card-section>
                  <h2 class="q-article-title q-pt-none" >{{ article.title }}</h2>
                  <p caption class="q-article-caption">{{ article.caption }}</p>
                </q-card-section>
            </q-card>
          </div>
        </a>
      </div>
    </q-page-container>
    
  </q-layout>
</template>
      
    

<script setup>
import { ref } from 'vue'
import ArticlesLink from 'components/ArticlesLink.vue'
import TwittierImage from 'assets/Twitter-X-Threads.jpg'
import discordImg from 'assets/Discord.jpg'
import gitImage from 'assets/GitHub_headpic.webp'
import quasarImg from 'assets/quasar_brand_identity.jpg'
import FaceImg from 'assets/facebook.png'
import QuasarImg from 'assets/quasar.webp'
import CommunityImg from 'assets/Quasar_comm.png'


defineOptions ({
    name:'MainHomepage'
})



const articles = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    link: 'https://quasar.dev',
    image: QuasarImg
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    link: 'https://github.com/quasarframework',
    image: gitImage
  },
  {
    title: 'Discord',
    caption: 'chat.quasar.dev',
    link: 'https://chat.quasar.dev',
    image: discordImg
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    link: 'https://forum.quasar.dev',
    image: quasarImg
  },
  {
    title: 'Tritter',
    caption: '@quasarframework',
    link: 'https://twitter.quasar.dev',
    image: TwittierImage
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    link: 'https://facebook.quasar.dev',
    image: FaceImg
  },
  {
    title: 'Community',
    caption: 'Community Quasar projects',
    link: 'https://awesome.quasar.dev',
    image: CommunityImg
     
  }]
const leftDashboard = ref(true)
  
const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
    }

function handleClick(link){
    router.push(link);
}
</script>

<style scoped>
    .q-card {
        margin: 10px;
        cursor: pointer;
    }
    .q-article-caption {
      color: #D69404;
      text-align: bottom;
    }

    .q-article-title {
      color: accent;
    }
</style>