<template>
  <div class="cluster"></div>
</template>

<script>
import { mapState } from "vuex";
import MarkerClusterer from "@google/markerclusterer";
import { clusterImgs, clusterizeResults, markerIcon } from "@/conf.js";

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
    selectedStoreId(id) {
      this.setActive(id);
    }
  },
  mounted() {
    this.clusterize();
    this.setActive(this.selectedStoreId);
  },
  methods: {
    setActive(id) {
      if (id === 0) {
        return;
      }
      const { InfoWindow } = this.google.maps;
      const store = this.stores.filter(pos => {
        return pos.ID === id;
      })[0];
      const mark = this.gMarkers.filter(m => {
        return m.getPosition().lat() === +store.lat;
      })[0];

      const infowindow = new InfoWindow({
        content: store.post_title + ""
      });
      this.infowindows.forEach(element => {
        element.close();
      });
      infowindow.open(this.map, mark);
      this.infowindows.push(infowindow);
    },
    clusterize() {
      const { Marker } = this.google.maps;
      const gMap = this.map;
      let mark;
      this.gMarkers = this.stores.map(marker => {
        mark = new Marker({
          position: { lat: +marker.lat, lng: +marker.lng },
          icon: markerIcon,
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
      if (clusterizeResults) {
        this.markerCluster = new MarkerClusterer(this.map, this.gMarkers, {
          imagePath: clusterImgs
        });
      }
    }
  }
};
</script>

<style lang="scss">
.cluster {
  display: none;
}
</style>
