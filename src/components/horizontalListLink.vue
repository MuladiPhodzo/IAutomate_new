<template>
  <div class="horizontal-scroll-container q-pa-md">
    <q-card 
      v-for="sale in items" 
      :key="sale.id" 
      class="sale-card q-pt-none"
      flat 
      bordered
    >
      <div class="image-container">
        <q-img 
          :src="sale.image || defaultImage" 
          class="sale-image"
          alt="sale image"
				>
					<div 
						class="name absolute-bottom text-h6" 
						style="font-size: large;"
					>
						{{ sale.name }}
					</div>
				</q-img>
      </div>

      <q-card-section>
        <q-card-section 
          style="font-size: xx-small; display: flex; align-items: center; justify-content: space-between;"
        >
          <q-badge color="yellow" class="overlay-text" style="font-size: x-small; margin: 0;" rounded>
            {{ sale.dev }}
          </q-badge>
          <q-badge color="red" floating rounded>
            {{ sale.version }}
          </q-badge>
        </q-card-section>

       
        <q-btn
          class="addToWarehouse q-mr-sm"
          flat
          round
          dense
          icon="add"
          @click="addToWarehouse(sale)"
        />
      </q-card-section>  
    </q-card>
  </div>
</template>

<script setup>
	
	defineOptions({
			name: "HorizontalCardList"
	})
  
  const props = defineProps ({
    items: {
      type: Array,
      required: true,
    },
    shoppingCart: {
      type: String,
      default: "shopping-cart-icon-path",
    },
    defaultImage: {
      type: String,
      default: "default-image-path",
    },
  })
 
	function addToWarehouse(sale) {
		if (this.isAddable(sale)) {
			this.$emit("add-to-warehouse", sale); // Emit event to parent
		} else {
			console.warn("Cannot add to warehouse: conditions not met.");
		}
	}
	function isAddable(sale) {
		return sale.isAvailable && sale.stock > 0; // Sample condition
	}
 
</script>

<style>
.horizontal-scroll-container {
  display: flex;
  flex-wrap: nowrap; /* Prevents wrapping */
  overflow-x: auto; /* Horizontal scrolling */
  gap: 1rem; /* Spacing between cards */
  padding-bottom: 1rem; /* Optional padding */
}

.sale-card {
  flex: 0 0 auto; /* Prevents resizing */
  max-width: 250px; /* Fixed card width */
  width: 100%; 
  height: auto;
  background: linear-gradient(to bottom, #496173, #00BFFF);
  color: white;
}

.sale-image {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0 0;
  display: block;
}
</style>
