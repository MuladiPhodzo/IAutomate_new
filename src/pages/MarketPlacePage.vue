
<template>
	<q-layout view="hHh lpr fFf">
		<div class="q-pa-md" style="font-size: x-large;">
			Marketplace
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

			<div v-else>
        <HorizontalCardList 
          :items="List"
          :shoppingCart="shoppingCart"
          :defaultImage="backgroundImp"
          @add-to-warehouse="AddToWarehouse"
        />
      </div>

			<q-separator/>

			<div 
			class="q-pa-md"
			style="font-size: x-large;"
			> 
			Offers
			<q-card rounded class="offers-card q-pa-md" style="color: #496173; font-size: medium;"> Sale </q-card>
		 </div>
			

		</div>
	</q-layout>
</template>
      
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter} from 'vue-router'
import { useMarketStore } from 'stores/salesStore.js'
import HorizontalCardList from 'components/horizontalListLink.vue';
import robotPic from 'assets/3-robot.jpg';
import { db } from '../firebase/firebase.js';
import { collection, onSnapshot } from 'firebase/firestore';
import shoppingCart from 'assets/funtinalities/shopping-cart.png';
import background from 'assets/background_geo.jpg';


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

const backgroundImp = background 
function isAddable(sale) {
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
		background-image: url('assets/background_geo.jpg');
		color: white;
		width: 100%;
  	max-width: 250px;
		height: auto; /* Adjust card height automatically */
		size: auto;
		flex: 0 0 auto; /* Prevents cards from growing or shrinking */
	}



	.sales-section {
  display: flex; 
  flex-wrap: wrap; /* Allows cards to wrap to the next line */
	justify-content: flex-start;
}

.image-container {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.sale-image {
		width: 100%;
		border-radius: 8px 8px 0 0;
		height: auto;
  	display: block
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