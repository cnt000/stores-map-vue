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
    markers: Array
  },
  data() {
    return {
      mapConfig: {
        zoom: 8,
        center: this.markers[3]
      }
    };
  },
  actions: {
    increment(context) {
      context.commit("increment");
    }
  },
  components: {
    MapLoader,
    ChildMarker
  }
};
</script>
