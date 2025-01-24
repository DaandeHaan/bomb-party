import { createApp } from 'vue';
import App from './App.vue';
import index from './router/index';
import './style.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUser, faGlobe, faSkull } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUser, faGlobe, faSkull)

const app = createApp(App);

app.use(Toast);

app.use(index);

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');
