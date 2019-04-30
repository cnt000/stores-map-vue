import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

Vue.config.productionTip = true;

new Vue({
  strict: process.env.NODE_ENV !== "production",
  router,
  store,
  render: h => h(App)
}).$mount("#app");
