<template>
	<q-page padding>
	  <q-toolbar class="q-pa-md bg-primary text-white">
		<q-btn flat dense round icon="arrow_back" @click="goBack" />
		<q-toolbar-title>Robot Details</q-toolbar-title>
	  </q-toolbar>
  
	  <q-card class="q-my-md robot-details-card">
		<q-card-section>
		  <div class="text-h5">{{ robot.name }}</div>
		  <div class="text-subtitle1 text-grey">Version: {{ robot.version }}</div>
		</q-card-section>
  
		<q-separator />
  
		<q-card-section>
		  <div class="text-h6 q-mb-sm">Stats</div>
		  <ul>
			<li v-for="(stat, index) in robot.stats" :key="index" class="q-my-xs">
			  {{ stat }}
			</li>
		  </ul>
		</q-card-section>
  
		<q-card-actions align="right">
		  <q-btn label="Edit" color="primary" @click="editRobot" />
		  <q-btn label="Delete" color="negative" @click="deleteRobot" />
		</q-card-actions>
	  </q-card>
	</q-page>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from 'vue-router'
  import { useRobotStore } from 'stores/robotStore'
  
  const router = useRouter()
  const route = useRoute()
  const robotStore = useRobotStore()
  const robotId = route.params.id
  const robot = robotStore.robotsList.find(r => r.id === robotId)
  
  function goBack() {
	router.push('/warehouse')
  }
  
  function editRobot() {
	router.push(`/warehouse/robot/${robotId}/edit`)
  }
  
  function deleteRobot() {
	robotStore.deleteRobot(robotId)
	goBack()
  }
  </script>
  
  <style scoped>
  .robot-details-card {
	max-width: 600px;
	margin: auto;
  }
  </style>
  