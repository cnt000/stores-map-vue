<template>
  <div class="home">
    <router-link to="/store-locator">
      <div class="cta">Click to visit Boutique Locator</div>
      <div class="background"></div>
    </router-link>
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


<style lang="scss">
.background {
  height: 100vh;
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/4/48/PRADA_BOUTIQUE_AOYAMA.jpg");

  /* Add the blur effect */
  filter: blur(2px);
  -webkit-filter: blur(2px);

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

}
.cta {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
