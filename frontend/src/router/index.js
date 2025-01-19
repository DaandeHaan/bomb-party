import { createRouter, createWebHistory } from 'vue-router';
import Lobby from '../views/Lobby.vue';
import GamePage from '../views/GamePage.vue';
import axios from 'axios';

const routes = [
  { path: '/', name: 'lobby', component: Lobby },
  { 
    path: '/game/:gameID',
    name: 'Game', 
    component: GamePage,
    beforeEnter: async (to, from, next) => {
      try {
        const userName = localStorage.getItem('userName');
        console.log(to.params);

        const response = await axios.post(`http://localhost:3000/api/game/${to.params.gameID}/join`, {
          params: { userName }
        });
        
        console.log(response);

        const ws = new WebSocket(response.data.webSocket);

        // Handle WebSocket events
        ws.onopen = () => {
          console.log('WebSocket connection established.');
          // You can store the WebSocket connection in a global state or Vuex store
          // if needed to share it across your app.
        };

        ws.onmessage = (event) => {
          console.log('Message from server:', event.data);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed.');
        };

        // Pass the WebSocket connection to the GamePage component (if necessary)
        to.params.ws = ws;

        next();

      } catch (error) {
        if (error.response && error.response.status === 404) {
          next({ name: 'lobby', query: { message: 'Lobby does not exist' } });
        } else {
          console.error('Error checking lobby existence:', error);
          next({ name: 'lobby', query: { message: 'An error occurred. Please try again.' } });
        }
      }
    }, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
