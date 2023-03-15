import { createApp } from 'vue';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(fas);

import i18n from './components/i18n';

import App from './App.vue';

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(i18n)
  .mount('#app');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/a2hs/sw.js')
    .then(() => {
      console.log('Service Worker Registered');
    });
}
