<template>
  <div class="home">
    <StoresList />
    <Map />
  </div>
</template>

<style lang="scss">
.home {
  display: flex;
}
</style>



<script>
// @ is an alias to /src
import StoresList from "@/components/StoresList.vue";
import Map from "@/components/Map.vue";

export default {
  name: "home",
  components: {
    StoresList,
    Map
  }
};
</script>
