import { createRouter, createWebHistory } from 'vue-router';
import Lobby from '../views/Lobby.vue';
import GamePage from '../views/GamePage.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const routes = [
  { path: '/', name: 'lobby', component: Lobby, beforeEnter: (to, from, next) => {
    next();
  }},
  { 
    path: '/game/:gameID',
    name: 'Game', 
    component: GamePage,
    beforeEnter: async (to, from, next) => {
      try {
        const username = localStorage.getItem('username');

        const response = await axios.post(
          `http://localhost:3000/api/game/${to.params.gameID}/connect`, 
          { username },
          { withCredentials: true }
        );

        if(response.status != 200){
            console.log('Redirecting to the home page due to unsuccessful response');
            next({ name: 'lobby', query: { message: 'Unable to join the game. Please try again.' } });
            return;
        }

        to.params.webSocketUrl = response.data.webSocket;

        next();

      } catch (error) {
        if (error.response && error.response.status === 404) {
          useToast().error('Lobby does not exist');
          next({ name: 'lobby' });
        } else if (error.response && error.response.status === 400) {
          useToast().error('The game is full');
          next({ name: 'lobby' });
        } else {
          useToast().error('An error occurred');
          next({ name: 'lobby' });
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
