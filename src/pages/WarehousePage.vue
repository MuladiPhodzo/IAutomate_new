
<template>
	<q-layout view="hHh lpr fFf">
		<q-header elevated>
			<q-toolbar>

				<q-btn	flat dense round icon= "home" aria-label="Menu" @click="GoHome"/>
				<q-toolbar-title class="title">Warehouse</q-toolbar-title>
				<q-btn flat dense	round icon="search" @click="SeetingsMenu"/>

			</q-toolbar>
		</q-header>

		<q-page-container >
      <q-page>
      
      <!-- Add content here -->
        <div >
           <!-- Show loading message while data is being fetched -->
          <div v-if="loading" class="loading-state" align="center" style="padding: 30%;">
            <q-icon name="update" size="150px" color="grey-5" />
            <p>Loading robots...</p>
            
          </div>

          <!-- Show empty state if there are no robots -->
          <div v-else="List.length === 0" class="empty-state">
            <q-icon name="robot" size="100px" color="grey-5" />
            <p>No robots available</p>
          </div>

          <!-- Show robot cards if available -->
          <div v-else class="robot-grid">
            <q-card 
              v-for="robot in List"
              :key="robot.id"
              class="robot-card position-relative"
            >
  
              <q-card-section class="q-pt-none q-pb-none"
                @click="expandedRobotId !== robot.id ? viewRobotDetails(robot.id) : null"
                :class="{ 'no-pointer-events': expandedRobotId === robot.id }" > 
                <q-btn 
                  @click.stop="navigateToEditRobot(robot.id)" 
                  icon="edit" 
                  dense 
                  flat 
                  class="edit-btn" 
                /> 

                <h3 class="q-robot-title q-pa-none">{{ robot.name }}</h3>
                <q-badge align="top" style="background-color: red;">{{ robot.version }}</q-badge>
                <q-separator />

            
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-none">
                <ul class="robot-stats-list">
                  <li v-for="(stat, index) in robot.stats" :key="index" class="q-robot-stats">
                    {{ stat }}
                  </li>
                </ul>
              </q-card-section>
              
              <q-card-actions align="right" class="card-actions p-qt-none">
                <q-btn 
                  :label="robot.stats.find(stat => stat.startsWith('Status:')) === 'Status: running' ? 'Stop' : 'Deploy'" 
                  color="primary" 
                  @click.stop="deployRobot(robot.id)" 
                />
                <q-btn icon="delete" color="red" size="25px" flat @click.stop="deleteRobot(robot.id)" />
              </q-card-actions>
            </q-card>
          </div>  
        </div>
        <!-- FAB Button -->
        <q-btn fab icon="add" color="primary" @click="newRobot" class="q-fab" />
      </q-page>
    </q-page-container>
	</q-layout>
</template>
      
    

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter} from 'vue-router'
import { useRobotStore } from 'stores/robotStore.js'
import writeIcon from 'assets/funtinalities/write.png';
import { db } from '../firebase/firebase.js';
import { collection, onSnapshot } from 'firebase/firestore';


const robotStore = useRobotStore();
const { addRobot, deleteRobotFirestore, updateRobot } = robotStore;

const router = useRouter();
const loading = robotStore.loading;
const expandedRobotId = ref(null);
const currentPage = ref(1);
let unsubscribe = null;

const List = computed(() => {
  return robotStore.robotsList || []
});


// Load robots and set up real-time listener
onMounted(async () => {
  unsubscribe = await robotStore.loadList();
});

// Clean up the listener on unmount
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

function GoHome() {
	router.push('/home')
}

function SeetingsMenu() {
  // Define the action for the settings menu button here
	router.push('/warehouse/robotsettings');
}

function newRobot() {
  router.push('/warehouse/robot/new') // Or navigate to any route for adding new robots
}

// View robot details when clicking on the card
function viewRobotDetails(id) {
  router.push(`/warehouse/robot/${id}`);
}

function navigateToEditRobot(robotId) {
  router.push(`/warehouse/robot/edit/${robotId}`);
}


async function saveRobot(robot) {
  // Update robot in the store
  await robotStore.updateRobot(robot);
  if (robotIndex !== -1) {
    robotStore.robotsList[robotIndex] = robot; // Update the local store with the new robot data
  }
  // Optionally close the edit mode
  expandedRobotId.value = null;
}

async function deployRobot(robotId) {
  // Wait until robots have loaded
  if (loading.value) {
    console.error("Robots are still loading. Try again shortly.");
    return;
  }

  const robot = robotStore.robotsList.find(r => r.id === robotId); // Directly access from robotStore
  
  if (!robot) {
    console.error(`Robot with ID ${robotId} not found.`);
    return;
  }

  const statusIndex = robot.stats.findIndex(stat => stat.startsWith("Status:"));

  if (statusIndex !== -1) {
    robot.stats[statusIndex] = robot.stats[statusIndex] === "Status: running" ? "Status: idle" : "Status: running";
    await robotStore.updateRobot(robot);
  } else {
    console.error("Status field not found in stats array");
  }
}


function deleteRobot(id) {
  console.log(`Delete robot with ID: ${id}`)
  const robotIndex = robotStore.robotsList.findIndex(robot => robot.id === id);
  if (robotIndex !== -1) {
    robotStore.robotsList.splice(robotIndex, 1); // Remove robot from list
    console.log(`Robot with ID: ${id} has been deleted`);
    deleteRobotFirestore(id);
  } else {
    console.log(`Robot with ID: ${id} not found`);
  }
  // Handle delete action here
}
</script>

<style scoped>
  .title {
    text-align: center;
    color: white;
  }

  /* Position the floating button at the bottom-right corner */
  .q-fab {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000; /* Ensures the button is above other content */
  }

  .robot-stats-list {
  padding-left: 20px;
  color: white;
  font-size: 12px;
  }

  .no-pointer-events {
  pointer-events: none; /* Disable all pointer events */
}


  .robot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
  padding: 10px;
}

.robot-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px;
  cursor: pointer;
  height: auto; /* Adjust this value to control card height */
  background: linear-gradient(to top, #DCA23A, #00BFFF); /* Sky-blue gradient */
  color: white;
  padding-top: 0%;
  position: relative;
}
.edit-btn {
  position: absolute; /* Positioning the button absolutely */
  top: 10px; /* Adjust the top offset as needed */
  right: 10px; /* Adjust the right offset as needed */
  /* Add any additional styles as needed, like size */
}

.q-robot-stats {
  color: white;
  
}

.q-robot-title {
  color: white;
  font-size: 25px;
  padding-bottom: 5px;
  text-align: top;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-bottom: 15px;
}

.q-layout {
  background-color: #a0cef1;
}
</style>