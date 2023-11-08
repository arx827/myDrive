import { createApp } from 'vue';
import { createPinia } from 'pinia';

import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import App from './App.vue';
import router from './router';

import 'virtual:svg-icons-register';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.use(router);

app.component(Menubar.name, Menubar);

app.mount('#app');
