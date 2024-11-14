// stores/robotStore.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '../firebase/firebase.js';
import { collection, query, orderBy, limit, startAfter, where, getDocs, doc, deleteDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const useRobotStore = defineStore('robotStore', () => {
  const robotsList = ref([]);
  const filterText = ref('');          // Filter term
  const sortField = ref('name');       // Field to sort by (default: 'name')
  const sortOrder = ref('asc');        // Sort order: 'asc' or 'desc'
  const pageSize = ref(3);            // Items per page
  const lastVisible = ref(null);       // Tracking last document for pagination
  const loading = ref(true);

  const router = useRouter();

  // Watch for localStorage updates on robotsList
  watch(robotsList, (newList) => {
    localStorage.setItem('robotsList', JSON.stringify(newList));
  });

  // Load robots with filtering, sorting, and pagination
  const loadList = async () => {
    try {
      loading.value = true;
      let robotsQuery = collection(db, 'robots');

      // Apply filtering
      if (filterText.value) {
        robotsQuery = query(robotsQuery, where('name', '>=', filterText.value), where('name', '<=', filterText.value + '\uf8ff'));
      }

      // Apply sorting
      const sortFieldExists = ["name", "createdAt"].includes(sortField.value);
      if (sortFieldExists) {
        robotsQuery = query(robotsQuery, orderBy(sortField.value, sortOrder.value));
      } else {
        console.warn(`Sort field ${sortField.value} does not exist on all documents.`);
        robotsQuery = query(robotsQuery, orderBy("name", "asc")); // Default sort
      }

      // Apply pagination
      if (lastVisible.value) {
        robotsQuery = query(robotsQuery, startAfter(lastVisible.value), limit(pageSize.value));
      } else {
        robotsQuery = query(robotsQuery, limit(pageSize.value));
      }

      // Real-time snapshot listener
     const unsubscribe = onSnapshot(robotsQuery, (snapshot) => {
        if (snapshot.empty) {
          // If no documents match the query, reset marketList and lastVisible
          robotsList.value = [];
          lastVisible.value = null;
        } else {
          // Update marketList with new documents
          robotsList.value = snapshot.docs.map(doc => ({
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

  // Action to add a new robot
  async function addRobot(robot) {
    await createRobotEntry(robot);
    robotsList.value.push(robot);
    localStorage.setItem('robotsList', JSON.stringify(robotsList.value));
    router.push('/warehouse');
  }

  // Action to delete a robot
  async function deleteRobotFirestore(id) {
    try {
      if (!id) {
        throw new Error("Invalid robot ID provided for deletion.");
      }
      const docRef = doc(db, 'robots', id);
      await deleteDoc(docRef);
      robotsList.value = robotsList.value.filter(robot => robot.id !== id);
      localStorage.setItem('robotsList', JSON.stringify(robotsList.value));
    } catch (error) {
      console.error("Error deleting robot from Firestore:", error);
    }
  }

  // Action to add a robot to Firestore
  async function createRobotEntry(robot) {
    try {
      const docRef = doc(db, 'robots', robot.id);
      await setDoc(docRef, robot);
    } catch (error) {
      console.error("Error adding robot to Firestore:", error);
    }
  }

  // Action to update a robot
  async function updateRobot(robot) {
    try {
      const docRef = doc(db, 'robots', robot.id);
      await setDoc(docRef, robot, { merge: true });
      router.push('/warehouse');
    } catch (error) {
      console.error("Error updating robot in Firestore:", error);
    }
  }

  // Pagination control: Next page
  const nextPage = async () => {
    if (robotsList.value.length === pageSize.value) {
      lastVisible.value = robotsList.value[robotsList.value.length - 1];
      await loadList();
    }
  };

  // Pagination control: Previous page
  const prevPage = async () => {
    lastVisible.value = null; // Reset lastVisible to go back to the first page
    await loadList();
  };

  return {
    robotsList,
    loadList,
    loading,
    filterText,
    sortField,
    sortOrder,
    pageSize,
    nextPage,
    prevPage,
    addRobot,
    deleteRobotFirestore,
    updateRobot
  };
});
