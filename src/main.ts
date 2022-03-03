import { createApp } from "vue";
import App from "./App.vue";
import ClickOutside from "./directives/clickOutside";
import "./utils/compability";
import "./styles/index.scss";

const app = createApp(App);
app.directive("clickOutside", ClickOutside);
app.mount("#app");
