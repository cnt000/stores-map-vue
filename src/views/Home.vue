<template>
  <div class="home">
    <StoresList />
     <Map :markers='[
        {"lat":35.6432027,"lng":139.6729435},
        {"lat":35.5279833,"lng":139.6989209},
        {"lat":35.6563623,"lng":139.7215211},
        {"lat":35.6167531,"lng":139.5469376},
        {"lat":35.6950961,"lng":139.5037899}
      ]'>
      </Map>
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
