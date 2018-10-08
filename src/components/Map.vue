<template>
  <div class="map-container">
    <map-loader 
      :map-config="mapConfig"
      apiKey="AIzaSyBNzPxDEDzlMCA9cedItIPCwtbdk037BGg"
    >
      <template v-for="marker in markers">
        <child-marker :key="marker.lat" :position="marker" />
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
    markers: Array
  },
  data() {
    return {
      mapConfig: {
        zoom: 12,
        center: this.markers[0]
      }
    };
  },
  components: {
    MapLoader,
    ChildMarker
  }
};
</script>
