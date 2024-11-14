
<template>
	<q-layout view="hHh lpr fFf">
		<div >
				<!-- Show loading message while data is being fetched -->
			<div v-if="loading" class="loading-state" align="center" style="padding: 30%;">
				<q-icon name="update" size="150px" color="grey-5" />
				<p>Loading robots...</p>
				
			</div>

			<!-- Show empty state if there are no robots -->
			<div v-else="List.length === 0" class="empty-state">
				<q-icon name="robot" size="100px" color="grey-5" />
				<p>No sales available</p>
			</div>

			<div v-else class="q-pa-md row items-start q-gutter-md">
				<q-card 
					v-for="sale in List"
					:key="sale.id"
					class="sale-card q-pt-none"
					flat bordered
				>
					<div class="image-container">
						
						<img src="https://cdn.quasar.dev/img/mountains.jpg" class="sale-image">
					</div>

					<q-card-section >
						<q-card-section style="font-size: xx-small; display: flex; align-items: center; justify-content: space-between;">
							<q-badge color="yellow" class="overlay-text" style="font-size: x-small; margin: 0;" rounded>{{ sale.dev }}</q-badge>
							<q-badge color="red" floating rounded>{{ sale.version }}</q-badge>
						</q-card-section>
					
						<q-card-section class="q-pt-none q-pa-none" style="font-size: small;">
							<h1 class="name q-pb-none" style="font-size: large;">{{sale.name}}</h1>
							<ul class="robot-stats-list">
								<li v-for="(stat, index) in sale.stats" :key="index" class="q-robot-stats">
									{{ stat }}
								</li>
							</ul>
						</q-card-section>
						
						<q-separator />

						
						<q-card-section class="q-pa-none" style="display: flex; justify-content: flex-end;">
							<q-btn
								class="addToWarehouse"
								flat
								:icon="shoppingCart"
								color="primary"
								@click="addToWarehouse(sale)"
								v-if="isAddable(sale)"
							/>
						</q-card-section>
						
						
					</q-card-section>	
				
				</q-card>
			</div>
		</div>
	</q-layout>
</template>
      
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter} from 'vue-router'
import { useMarketStore } from 'stores/salesStore.js'
import robotPic from 'assets/3-robot.jpg';
import { db } from '../firebase/firebase.js';
import { collection, onSnapshot } from 'firebase/firestore';
import shoppingCart from 'assets/funtinalities/shopping-cart.png';


const marketStore = useMarketStore();
const List = computed(() => {
	return marketStore.marketList || [];
});

let unsubscribe = null;
const loading = marketStore.loading;

// Load robots and set up real-time listener
onMounted(async () => {
  unsubscribe = await marketStore.loadstore();
});

// Clean up the listener on unmount
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

function isAddable(sale) {
      // Define the conditions that must be met before adding to the warehouse
      // Example condition: only add if sale has a certain property or status
    return sale.isAvailable && sale.stock > 0; // Sample condition
}

function addToWarehouse(sale) {
	if (this.isAddable(sale)) {
		// Add the robot to the warehouse (you could add Firestore or Vuex logic here)
		console.log(`${sale.name} added to the warehouse!`);
		
		// Implement your warehouse addition logic, for example:
		// this.$store.dispatch('warehouseStore/addRobot', sale);
		
	} else {
		console.warn("Cannot add to warehouse: conditions not met.");
	}
}


</script>

<style>
	.sale-card {
	 /* Adjust this value to control card height */
		background: linear-gradient(to bottom, #496173, #00BFFF);
		color: white;
		width: 100%;
  	max-width: 250px;
		size: auto;
	}

	.sales-section {
  display: flex; 
  flex-wrap: wrap; /* Allows cards to wrap to the next line */
	justify-content: flex-start;
}

.image-container {
		position: relative;
		width: 100%;
	}

	.sale-image {
		width: 100%;
		border-radius: 8px 8px 0 0;
	}

	.overlay-text {
		position: absolute;
		top: 1pt; /* Adjust to position the text */
		left: 8px;
		font-size: x-small;
		background-color: rgba(0, 0, 0, 0); /* Semi-transparent background */
		color: rgb(0, 0, 0);
		border-radius: 4px;
	}
</style>