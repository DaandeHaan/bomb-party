import { createApp } from 'vue';
import App from './App.vue';
import index from './router/index';
import './style.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Import the Toast CSS

const app = createApp(App);

app.use(Toast);

// Use router
app.use(index);

// Mount the app
app.mount('#app');
