import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import { db } from '../firebase/firebase.js';
import { collection, query, orderBy, limit, startAfter, where, onSnapshot, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export const useMarketStore = defineStore('MarketStore', () => {
  const marketList = ref([]);
  const filterText = ref('');          // Filter term
  const sortField = ref('name');       // Field to sort by (default: 'name')
  const sortOrder = ref('asc');        // Sort order: 'asc' or 'desc'
  const pageSize = ref(10);            // Items per page
  const lastVisible = ref(null);       // Tracking last document for pagination
  const loading = ref(true);

  const router = useRouter();
 

  watch(marketList, (newList) => {
    localStorage.setItem('marketList', JSON.stringify(newList));
  });

  const loadstore = async () => {
    try {
      loading.value = true;
      let marketQuery = collection(db, 'market');

      // Apply filtering
      if (filterText.value) {
        marketQuery = query(
          marketQuery,
          where('name', '>=', filterText.value),
          where('name', '<=', filterText.value + '\uf8ff')
        );
      }

      // Apply sorting
      marketQuery = query(marketQuery, orderBy(sortField.value, sortOrder.value));

      // Apply pagination
      if (lastVisible.value) {
        marketQuery = query(marketQuery, startAfter(lastVisible.value), limit(pageSize.value));
      } else {
        marketQuery = query(marketQuery, limit(pageSize.value));
      }

      // Real-time snapshot listener
      const unsubscribe = onSnapshot(marketQuery, (snapshot) => {
        if (snapshot.empty) {
          // If no documents match the query, reset marketList and lastVisible
          marketList.value = [];
          lastVisible.value = null;
        } else {
          // Update marketList with new documents
          marketList.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          // Update last visible document for pagination
          lastVisible.value = snapshot.docs[snapshot.docs.length - 1];
        }
  
        // Set loading to false after data is loaded
        loading.value = false;
      }, (error) => {
        console.error("Error in Firestore snapshot:", error);
        loading.value = false;
      })

      return unsubscribe;
    } catch (error) {
      console.error("Error loading data from Firestore:", error);
      loading.value = false;
    }
  };

  async function addRobot(robot) {
    await createMarketEntry(robot);
    marketList.value.push(robot);
    localStorage.setItem('marketList', JSON.stringify(marketList.value));
    router.push('/warehouse');
  };

  // Action to delete a robot
  async function deleteRobotFirestore(id) {
    try {
      if (!id) {
        throw new Error("Invalid robot ID provided for deletion.");
      }
      const docRef = doc(db, 'market', id);
      await deleteDoc(docRef);
      marketList.value = robotsList.value.filter(robot => robot.id !== id);
      localStorage.setItem('marketList', JSON.stringify(marketList.value));
    } catch (error) {
      console.error("Error deleting robot from Firestore:", error);
    }
  };

  // Action to add a robot to Firestore
  async function createMarketEntry(robot) {
    try {
      const docRef = doc(db, 'market', robot.id);
      await setDoc(docRef, robot);
    } catch (error) {
      console.error("Error adding robot to Firestore:", error);
    }
  };

  // Action to update a robot
  async function updateMarket(robot) {
    try {
      const docRef = doc(db, 'market', robot.id);
      await setDoc(docRef, robot, { merge: true });
      router.push('/market');
    } catch (error) {
      console.error("Error updating robot in Firestore:", error);
    }
  }
  
  // Pagination controls
  const nextPage = async () => {
    if (marketList.value.length === pageSize.value) {
      lastVisible.value = marketList.value[marketList.value.length - 1];
      await loadstore();
    }
  };

  const prevPage = async () => {
    lastVisible.value = null; // Reset to go back to the first page
    await loadstore();
  };

  return {
    marketList,
    loadstore,
    loading,
    filterText,
    sortField,
    sortOrder,
    pageSize,
    nextPage,
    prevPage,
    addRobot,
    updateMarket,
    deleteRobotFirestore
  };
});
