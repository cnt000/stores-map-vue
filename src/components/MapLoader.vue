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
      country: state => state.stores.selectedCountryTermId
    })
  },
  watch: {
    store: function(val) {
      this.centerMap(val);
    },
    country: function(val) {
      this.selectCountry(val);
    }
  },
  methods: {
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
      const { Geocoder } = this.google.maps;
      this.geocoder = new Geocoder();
    },
    centerMap() {
      let storeSelected = this.$store.getters["stores/getSelectedStore"];
      if (storeSelected.lat !== "" && storeSelected.lng !== "") {
        this.panToAndZoom(storeSelected.lat, storeSelected.lng, 14);
      } else if (this.geocoder) {
        this.geocoder.geocode(
          { address: storeSelected.custom["wpcf-yoox-store-address"][0] },
          function(results, status) {
            if (status !== "OK") {
              console.log(
                "Geocode was not successful for the following reason: " + status
              );
            }
            this.panToAndZoom(
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng(),
              18
            );
          }
        );
      }
    },
    selectCountry(selectedTermId) {
      if (selectedTermId === 0) {
        this.panToAndZoom(51, 0, 4);
        return;
      }
      const countrySelected = this.$store.getters["stores/getSelectedCountry"];
      const istance = this;
      this.geocoder &&
        this.geocoder.geocode({ address: countrySelected.name }, function(
          results,
          status
        ) {
          if (status !== "OK") {
            console.log(
              "Geocode was not successful for the following reason: " + status
            );
          }
          istance.panToAndZoom(
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng(),
            6
          );
        });
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
