import { createRouter, createWebHistory } from 'vue-router';
import Lobby from '../views/Lobby.vue';
import GamePage from '../views/GamePage.vue';
import axios from 'axios';

const routes = [
  { path: '/', name: 'lobby', component: Lobby },
  { 
    path: '/game/:lobbyId',
     name: 'Game', 
     component: GamePage,
     beforeEnter: async (to, from, next) => {
      try {
        const userName = localStorage.getItem('userName');

        const response = await axios.get(`/game/${to.params.lobbyId}`, {
          params: { userName }
        });
        
        if (response.data.exists) {
          next(); 
        } else {
          next({ name: 'lobby', query: { message: 'Lobby does not exist' } });
        }
      } catch (error) {
        console.error('Error checking lobby existence:', error);
        next({ name: 'lobby', query: { message: 'An error occurred. Please try again.' } });
      }
    }, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
