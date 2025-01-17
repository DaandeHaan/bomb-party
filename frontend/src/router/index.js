import { createRouter, createWebHistory } from 'vue-router';
import Lobby from '../views/Lobby.vue';
import GamePage from '../views/GamePage.vue';

const routes = [
  { path: '/', name: 'lobby', component: Lobby },
  { path: '/game/:lobbyId', name: 'Game', component: GamePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
