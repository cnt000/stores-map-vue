<template>
  <div>
    <template v-if="!!this.google && !!this.map">
      <slot :google="google" :map="map"/>
    </template>
    <div class="map-container">
      <div id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState } from "vuex";

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },
  data() {
    return {
      google: null
    };
  },
  mounted() {
    GoogleMapsApiLoader({
      apiKey: this.apiKey
    }).then(google => {
      this.google = google;
      this.initializeMap();
    });
  },
  computed: {
    ...mapState({
      store: state => state.stores.selectedStoreId,
      country: state => state.stores.selectedCountryId,
      mapLoaded: state => state.stores.mapLoaded,
      selectedStoreId: state => state.stores.selectedStoreId
    })
  },
  watch: {
    store: function() {
      this.mapLoaded && this.selectedStoreId && this.panToSelectedStore();
    },
    country: function(val) {
      this.selectCountry(val);
    },
    mapLoaded: function() {
      this.selectedStoreId && this.panToSelectedStore();
    }
  },
  methods: {
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
      const { Geocoder } = this.google.maps;
      this.geocoder = new Geocoder();
      this.mapIsLoaded();
    },
    mapIsLoaded() {
      this.$store.dispatch({
        type: "stores/mapLoaded"
      });
    },
    panToSelectedStore() {
      const storeSelected = this.$store.getters["stores/getSelectedStore"];
      if (storeSelected.lat !== "" && storeSelected.lng !== "") {
        this.panToAndZoom(storeSelected.lat, storeSelected.lng, 14);
      } else {
        const storeAddress = storeSelected.custom["wpcf-yoox-store-address"][0];
        this.geocoder.geocode({ address: storeAddress }, function(
          results,
          status
        ) {
          if (status !== "OK") {
            console.log("Geocode was not successful: " + status);
          }
          this.panToAndZoom(
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng(),
            18
          );
        });
      }
    },
    selectCountry(selectedCountryId) {
      if (selectedCountryId === 0) {
        this.panToAndZoom(
          this.mapConfig.center.lat,
          this.mapConfig.center.lng,
          this.mapConfig.zoom
        );
        return;
      }
      const countrySelected = this.$store.getters["stores/getSelectedCountry"];
      this.geocoder.geocode(
        { address: countrySelected.name },
        (results, status) =>
          status === "OK"
            ? this.panToAndZoom(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng(),
                6
              )
            : console.log("Geocode was not successful: " + status)
      );
    },
    panToAndZoom(lat, lng, zoom) {
      this.map.panTo({
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
      this.map.setZoom(zoom);
    }
  }
};
</script>

<style lang="scss">
.app-container {
  display: grid;
  grid-template-areas: "nav content";
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  grid-gap: 10px;
}
.map-container {
  grid-area: content;
  height: 100vh;
}
.map {
  height: 100%;
}
</style>
