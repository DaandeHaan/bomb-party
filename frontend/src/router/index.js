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
        const username = localStorage.getItem('username');
        console.log(to.params);

        const response = await axios.post(`http://localhost:3000/api/game/${to.params.gameID}/join`, {
          username 
        });

        console.log(response);
        
        if(response.status != 200){
            console.log('Redirecting to the home page due to unsuccessful response');
            next({ name: 'lobby', query: { message: 'Unable to join the game. Please try again.' } });
            return;
        }

        to.params.webSocketUrl = response.data.webSocket;

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
