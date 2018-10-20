<template>
  <div class="map-container">
    <StoresList 
      :selectStore="selectStore"
      :selectCountry="selectCountry" 
    />
    <div id="map"></div>
    <template v-if="!!this.google && !!this.map">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState } from "vuex";
import MapProvider from "./MapProvider";
import StoresList from "./StoresList";

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },
  components: {
    MapProvider,
    StoresList
  },
  data() {
    return {
      google: null,
      map: null,
      geocoder: null,
      keyword: ""
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
      stores: state => state.stores.all,
      pending: state => state.stores.pending,
      error: state => state.stores.error,
      selectedStoreId: state => state.stores.selectedStoreId
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
    panTo() {
      let storeSelected = this.$store.state.stores.all.filter(
        store => store.ID === this.$store.state.stores.selectedStoreId
      )[0];
      if (storeSelected.lat !== "" && storeSelected.lng !== "") {
        this.map.panTo({
          lat: parseFloat(storeSelected.lat),
          lng: parseFloat(storeSelected.lng)
        });
        this.map.setZoom(14);
      }
    },
    selectStore(clickedId) {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
      this.panTo();
    },
    selectCountry(selectedTermId) {
      const map = this.map;
      const countrySelected = this.$store.state.stores.countries.filter(
        country => country.term_id === selectedTermId
      )[0];
      this.geocoder.geocode({ address: countrySelected.name }, function(
        results,
        status
      ) {
        if (status === "OK") {
          map.setCenter(results[0].geometry.location);
          map.setZoom(6);
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
#map {
  height: 500px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.stores-map {
  display: flex;
}
.map {
  width: 100%;
}
.store-name {
  font-weight: bold;
}
</style>
