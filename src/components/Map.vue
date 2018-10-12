<template>
  <div class="map-container">
    <map-loader 
      :map-config="mapConfig"
      apiKey="AIzaSyBNzPxDEDzlMCA9cedItIPCwtbdk037BGg"
    >
      <template slot-scope="scopeProps"> <!-- slot-scope -->
        <child-marker 
          v-for="(marker,i) in markers"
          :key="i"
          :position="marker" 
          :google="scopeProps.google"
          :map="scopeProps.map"
        />
      </template>
    </map-loader>
  </div>
</template>

<style scoped>
.map-container {
  height: 100vh;
  width: 100%;
}
</style>

<script>
import MapLoader from "./MapLoader.vue";
import ChildMarker from "./ChildMarker";

export default {
  props: {
    markers: Array,
    selectedStore: Number
  },
  data() {
    return {
      mapConfig: {
        zoom: 8,
        center: { lat: parseFloat(this.selectedStore.lat), lng: parseFloat(this.selectedStore.lng) }
      }
    };
  },
  components: {
    MapLoader,
    ChildMarker
  }
};
</script>
