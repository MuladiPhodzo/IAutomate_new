<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="home" aria-label="Menu" @click="GoHome" />
        <q-toolbar-title class="title">Search</q-toolbar-title>
        
      </q-toolbar>
    </q-header>

    <q-page-container class="layout">
      <q-page>
        <div>
          <!-- Filtering and Sorting Options -->
          <div class="filter-sort-container">
            <input
              v-model="robotStore.filterText"
              placeholder="Search"
              @input="robotStore.loadList"
              style="padding: 8px; border-radius: 16px; border: 1px solid #ccc;"
            />
            <select v-model="robotStore.sortField" @change="robotStore.loadList" style="padding: 8px; border-radius: 16px; border: 1px solid #ccc;">
              <option value="name" rounded>Name</option>
              <option value="createdAt">Created At</option>
            </select>
            <select v-model="robotStore.sortOrder" @change="robotStore.loadList" style="padding: 8px; border-radius: 16px; border: 1px solid #ccc;">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <!-- Show loading message while data is being fetched -->
          <div v-if="robotStore.loading" class="loading-state" align="center">
            <q-icon name="update" size="150px" color="grey-5"/>
            <p>Loading robots...</p>
          </div>

          <!-- Show empty state if there are no robots -->
          <div v-else-if="List.length === 0" class="empty-state">
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

          <!-- Pagination Controls -->
          <div class="pagination-controls">
            <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
            <button
              @click="nextPage"
              :disabled="robotStore.robotsList.length < robotStore.pageSize"
            >
              Next
            </button>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRobotStore } from 'stores/robotStore.js'

const robotStore = useRobotStore()

const { deleteRobotFirestore, updateRobot } = robotStore;
const router = useRouter();
const loading = robotStore.loading;

const List = computed(()=> {
  return robotStore.robotsList || []
});

const currentPage = ref(1);
const expandedRobotId = ref(null);

let unsubscribe = null;

// Load robots and set up real-time listener
onMounted(async () => {
  unsubscribe = await robotStore.loadList()
  console.log(List)
})

// Clean up the listener on unmount
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})


function GoHome() {
  router.push('/home')
}

function navigateToEditRobot(robotId) {
  router.push(`/warehouse/robot/edit/${robotId}`)
}

async function deployRobot(robotId) {
  if (loading.value) return
  const robot = robotStore.robotsList.find(r => r.id === robotId)
  if (!robot) return
  const statusIndex = robot.stats.findIndex(stat => stat.startsWith("Status:"))
  if (statusIndex !== -1) {
    robot.stats[statusIndex] = robot.stats[statusIndex] === "Status: running" ? "Status: idle" : "Status: running"
    await robotStore.updateRobot(robot)
  }
}

function deleteRobot(id) {
  const robotIndex = robotStore.robotsList.findIndex(robot => robot.id === id)
  if (robotIndex !== -1) {
    robotStore.robotsList.splice(robotIndex, 1)
    robotStore.deleteRobotFirestore(id)
  }
}

async function previousPage() {
  if (currentPage.value > 1) {
    robotStore.prevPage()
    currentPage.value--
  }
  
}

async function nextPage() {
  robotStore.nextPage()
  currentPage.value++

}
</script>

<style scoped>
.title {
  text-align: center;
  color: white;
}

.filter-sort-container {
  display: flex;
  justify-content: space-around;
  padding: 10px;
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

.loading-state, .empty-state {
  text-align: center;
  padding: 20px;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.delete-btn {
  color: red;
}

.layout{
  background-color: #a0cef1;
}
</style>
