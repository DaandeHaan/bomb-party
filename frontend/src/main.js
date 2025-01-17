import { createApp } from 'vue';
import App from './App.vue';
import index from './router/index';
import './style.css';

createApp(App).use(index).mount('#app');
