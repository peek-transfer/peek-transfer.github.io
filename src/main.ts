import { createApp } from 'vue'
import App from './App.vue'
import { router } from "./router";

import 'uno.css'
import { registerActualWindowSizeCss } from './utils/screen';
import { initI18n } from './locale';

registerActualWindowSizeCss()

const app = createApp(App)
app.use(router)
initI18n().then((i18n) => {
    app.use(i18n)
    app.mount('#app')
})
