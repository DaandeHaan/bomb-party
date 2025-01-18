import { createApp } from 'vue';
import App from './App.vue';
import index from './router/index';
import './style.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(Toast);

app.use(index);

app.mount('#app');
