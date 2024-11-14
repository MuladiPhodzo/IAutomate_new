<template>
  <q-layout view="lHh Lpr lFf">
    <q-header calss="header" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon= "person" 
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="title">
          IAutomate
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      boardered
    >
      <q-list>
        <q-item-label header>
          Profile
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />

        

        <div class="user" align="bottom">
        <!-- User Email Display -->
          <q-item clickable @click="handleLogout">
            <q-item-section>
              <q-item-label>{{ userEmail }}</q-item-label>
            </q-item-section>
          

          <!-- Logout Button -->
          
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
        </div>
    
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <div>
        <q-toolbar class="toolbar">
          <WidgetsLink 
            v-for="widget in widgetsList"
            :key="widget.title"
            v-bind="widget"
          />
        </q-toolbar>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import EssentialLink from 'components/EssentialLink.vue'
import WidgetsLink from 'components/WidgetsLink.vue';
import { auth, logout as firebaseLOgOut } from '../firebase/firebase.js';

import homeIcon from 'assets/funtinalities/home.png';
import chartIcon from 'assets/funtinalities/chart.png';
import chatIcon from 'assets/funtinalities/chat.png';
import warehouseIcon from 'assets/funtinalities/data-warehouse.png';
import shoppingIcon from 'assets/funtinalities/shopping-cart.png';
import settingsIcon from 'assets/funtinalities/settings.png';
import userIcon from 'assets/funtinalities/user.png';

defineOptions({
  name: 'MainLayout'
})

const user = userIcon;

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: '',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]



const widgetsList = [
  {
    title: 'Home',
    icon: homeIcon,
    route: '/home'
  },
  {
    title: 'Market',
    icon: shoppingIcon,
    route: '/market'
  },
  {
    title: 'Charts',
    icon: chartIcon,
    route: '/charts'
  },
  {
    title: 'Warehouse',
    icon: warehouseIcon,
    route: '/warehouse'
  },
  {
    title: 'Hubs',
    icon: chatIcon,
    route: '/hubs'
  },
  {
    title: 'Settings',
    icon: settingsIcon,
    route: '/settings'
  }
]

const router = useRouter()

const leftDrawerOpen = ref(false);
const userEmail = ref(null)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async() => {
  try {
        await firebaseLOgOut();
        router.push({ name: 'Login' }); // Redirect to login page
      } catch (error) {
        console.error("Failed to logout:", error);
      }
    
}

// Fetch the user's email when the component is mounted
onMounted(() => {
  const user = auth.currentUser
  if (user) {
    userEmail.value = user.email
  }

  // Listen for authentication state changes
  auth.onAuthStateChanged(user => {
    userEmail.value = user ? user.email : null
  })
})
</script>

<style>
  .title{
    text-align: center;
    color:#E6A611 ;
  }

  .header {
    background: linear-gradient(to bottom, black, grey );
  }
  
  .q-drawer{
    background-color: #32363C;
  }

  .q-item-label {
    background-color:#D69404;
  }

  .q-layout{
    background-color: #3f3d3d97;
  }
</style>

