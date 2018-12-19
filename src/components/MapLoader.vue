<template>
  <div class="app-container">
    {{selectedStoreChange}} - {{selectedNationChange}}
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
      selectedStoreChange: function(state) {
        this.centerMap(state.stores.selectedStoreId);
        return state.stores.selectedStoreId;
      },
      selectedNationChange: function(state) {
        this.selectCountry(state.stores.selectedCountryTermId);
        return state.stores.selectedCountryTermId;
      }
    })
  },
  methods: {
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
      const { Geocoder } = this.google.maps;
      this.geocoder = new Geocoder();
    },
    centerMap(storeId) {
      let storeSelected = this.$store.state.stores.all.filter(
        store => store.ID === storeId
      )[0];
      if (this.map && storeSelected.lat !== "" && storeSelected.lng !== "") {
        this.map.panTo({
          lat: parseFloat(storeSelected.lat),
          lng: parseFloat(storeSelected.lng)
        });
        this.map.setZoom(14);
      } else if (this.geocoder) {
        this.geocoder.geocode(
          { address: storeSelected.custom["wpcf-yoox-store-address"][0] },
          function(results, status) {
            if (status === "OK") {
              this.map.setCenter({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
              this.map.setZoom(18);
            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
          }
        );
      }
    },
    selectCountry(selectedTermId) {
      if (selectedTermId === 0 && this.map) {
        this.map.setCenter({ lat: 51, lng: 0 });
        this.map.setZoom(4);
        return;
      }
      const countrySelected = this.$store.state.stores.countries.filter(
        country => country.term_id === selectedTermId
      )[0];
      this.geocoder &&
        this.geocoder.geocode({ address: countrySelected.name }, function(
          results,
          status
        ) {
          if (status === "OK" && this.map) {
            this.map.setCenter(results[0].geometry.location);
            this.map.setZoom(6);
          } else {
            alert(
              "Geocode was not successful for the following reason: " + status
            );
          }
        });
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
  background-color: lightcyan;
}
.map-container {
  grid-area: content;
  height: 100vh;
}
.map {
  height: 100%;
}
</style>
