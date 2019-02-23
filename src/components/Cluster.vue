<template>
  <div class="cluster"></div>
</template>

<script>
import { mapState } from "vuex";
import MarkerClusterer from "@google/markerclusterer";

export default {
  props: {
    google: Object,
    map: Object
  },
  data() {
    return {
      gMarkers: null,
      infowindows: [],
      MarkerCluster: null
    };
  },
  computed: {
    ...mapState({
      selectedStoreId: state => state.stores.selectedStoreId,
      stores: state => state.stores.all
    })
  },
  watch: {
    selectedStoreId: function(id) {
      const store = this.stores.filter(pos => {
        return pos.ID === id;
      })[0];
      const mark = this.gMarkers.filter(m => {
        return m.getPosition().lat() === +store.lat;
      })[0];

      const infowindow = new this.google.maps.InfoWindow({
        content: store.post_title + ""
      });
      this.infowindows.forEach(element => {
        element.close();
      });
      infowindow.open(this.map, mark);
      this.infowindows.push(infowindow);
    }
  },
  mounted() {
    this.clusterize();
  },
  methods: {
    clusterize() {
      const { Marker } = this.google.maps;
      const gMap = this.map;
      let mark;
      this.gMarkers = this.stores.map(marker => {
        mark = new Marker({
          position: { lat: +marker.lat, lng: +marker.lng },
          map: gMap
        });
        mark.addListener("click", () => {
          this.$store.dispatch({
            type: "stores/selectStore",
            id: marker.ID
          });
        });
        return mark;
      });

      this.markerCluster = new MarkerClusterer(this.map, this.gMarkers, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
      });
    }
  }
};
</script>

<style lang="scss">
.cluster {
  display: none;
}
</style>
