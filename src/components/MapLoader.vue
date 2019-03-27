<template>
  <div>
    <template v-if="!!mapLoaded">
      <slot :google="google" :map="map" />
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
      google: null,
      geocoder: null
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
      mapLoaded: state => state.stores.mapLoaded,
      filters: state => state.stores.filters
    })
  },
  watch: {
    store: function() {
      this.mapLoaded && this.panToSelectedStore();
    },
    mapLoaded: function() {
      this.store && this.panToSelectedStore();
    },
    filters: function() {
      this.filterActive();
    }
  },
  methods: {
    filterActive() {
      this.$store.dispatch({
        type: "stores/filterActive"
      });
    },
    boundsChanged() {
      this.$store.dispatch({
        type: "stores/getActive",
        map: this.map
      });
    },
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map, Geocoder } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
      this.google.maps.event.addListener(this.map, "idle", this.boundsChanged);
      this.geocoder = new Geocoder();
      this.mapIsLoaded({ map: this.map });
    },
    mapIsLoaded({ map }) {
      this.$store.dispatch({
        type: "stores/mapLoaded",
        map
      });
    },
    panToSelectedStore() {
      const storeSelected = this.$store.getters["stores/getSelectedStore"];
      let zoom = !storeSelected.id ? 10 : 16;
      this.panToAndZoom(storeSelected.lat, storeSelected.lng, zoom);
    },
    panToAndZoom(lat, lng, zoom) {
      this.map.panTo({
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
      const actualZoom = this.map.getZoom();
      if (actualZoom < zoom) this.map.setZoom(zoom);
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
  grid-gap: 2px;
}
.map-container {
  grid-area: content;
  height: 100vh;
}
.map {
  height: 100%;
}
</style>
