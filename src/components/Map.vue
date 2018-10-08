<template>
  <div class="map-container">
    <!-- Map -->
    <googlemaps-map
        ref="map"
        class="map"
        :center.sync="center"
        :zoom.sync="zoom"
    >
        <!-- User Position -->
        <googlemaps-user-position
            @update:position="setUserPosition" />
        
        <!-- Marker -->
        <googlemaps-marker
            title="Milan"
            :position="{ lat: 45.4646, lng: 9.1903 }" />
    </googlemaps-map>
  </div>
</template>

<style lang="scss">
.map-container {
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
}
.map {
  flex: 100% 1 1;
}
</style>

<script>
import Vue from "vue";
import VueGoogleMaps from "vue-googlemaps";
import "vue-googlemaps/dist/vue-googlemaps.css";
import { mapActions } from "vuex";

Vue.use(VueGoogleMaps, {
  load: {
    // Google API key
    apiKey: "AIzaSyBNzPxDEDzlMCA9cedItIPCwtbdk037BGg",
    // Enable more Google Maps libraries here
    libraries: ["places"],
    // Use new renderer
    useBetaRenderer: false
  }
});

export default {
  data() {
    return {
      center: {
        lat: 48.853,
        lng: 2.298
      },
      userPosition: null,
      zoom: 12
    };
  },
  methods: {
    ...mapActions("layout", ["toggleSideNav"]),
    centerOnUser() {
      if (this.userPosition) {
        this.center = this.userPosition;
      }
    },
    setUserPosition(position) {
      this.userPosition = position;
    }
  }
};
</script>
