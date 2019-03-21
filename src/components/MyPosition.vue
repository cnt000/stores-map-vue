<template>
  <div class="geolocalize">
    <button class="geolocalize_button" @click="localize">GeoLocalize Me</button>
  </div>
</template>

<script>
export default {
  props: {
    google: Object,
    map: Object
  },
  methods: {
    localize() {
      const map = this.map;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(pos);
            map.setZoom(10);
          },
          function() {
            // handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        // handleLocationError(false, infoWindow, map.getCenter());
      }
    }
  }
};
</script>

<style lang="scss">
.geolocalize {
  &_button {
    // background-image: url(img/icons/my-location.svg);
    position: absolute;
    left: 350px;
    bottom: 50px;
    width: 100px;
    height: 100px;
    z-index: 1;
    border-radius: 30px;
  }
}
</style>
