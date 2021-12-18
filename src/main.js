import { createApp } from "vue";
import App from "./App.vue";
import pineapple from "./store/index";



createApp(App).use(pineapple).mount("#app");
