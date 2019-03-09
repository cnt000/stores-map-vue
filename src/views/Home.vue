<template>
  <div class="home">
    <router-link to="/store-locator">Store locator</router-link>
    baseUrl: {{ baseUrl }}
  </div>
</template>

<script>
import StoreLocator from "@/components/StoreLocator.vue";

export default {
  data() {
    return { baseUrl: process.env.BASE_URL };
  },
  name: "home",
  components: {
    StoreLocator
  }
};
</script>
