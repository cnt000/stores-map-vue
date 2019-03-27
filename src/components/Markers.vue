<template>
  <div class="marker"></div>
</template>

<script>
import { mapState } from "vuex";
import MarkerCluster from "@google/markerclusterer";
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
      Markers: null,
      isMarkersized: false
    };
  },
  computed: {
    ...mapState({
      selectedStoreId: state => state.stores.selectedStoreId,
      stores: state => state.stores.all,
      active: state => state.stores.active,
      filtered: state => state.stores.filtered,
      filters: state => state.stores.filters
    })
  },
  watch: {
    selectedStoreId(id) {
      this.setActive(id);
    },
    active() {
      if (clusterizeResults) {
        this.checkZoom();
      }
    },
    filters() {
      if (clusterizeResults) {
        this.Markers.clearMarkers();
        this.refreshMarkers();
        this.clusterize();
      } else {
        // clear marker if not clusterized
        for (var i = 0; i < this.gMarkers.length; i++) {
          this.gMarkers[i].setMap(null);
        }
        this.refreshMarkers();
      }
    }
  },
  mounted() {
    this.addMarkers();
    if (clusterizeResults) this.clusterize();
    this.setActive(this.selectedStoreId);
  },
  methods: {
    clusterize() {
      this.Markers = new MarkerCluster(this.map, this.gMarkers, {
        imagePath: clusterImgs
      });
      this.isMarkersized = true;
    },
    checkZoom() {
      const zoom = this.map.getZoom();
      if (zoom > 20 && this.isMarkersized) {
        this.Markers.clearMarkers();
        this.isMarkersized = false;
        this.addMarkers();
      } else if (zoom < 14 && !this.isMarkersized) {
        this.clusterize();
      }
    },
    setActive(id) {
      if (!id) {
        return;
      }
      const { InfoWindow } = this.google.maps;
      // TODO better get for mark
      const store = this.stores.filter(pos => {
        return pos.id === id;
      })[0];
      const mark = this.gMarkers.filter(m => {
        return (
          m
            .getPosition()
            .lat()
            .toFixed(7) === (+store.lat).toFixed(7) &&
          m
            .getPosition()
            .lng()
            .toFixed(7) === (+store.lng).toFixed(7)
        );
      })[0];

      const infowindow = new InfoWindow({
        content: `<div class="store-name">${store.name}<br>
        ${store.gender}</div>
        <div>${store.address}</div> 
        ${store.phone}<br>
        ${store.hours}`
      });
      this.infowindows.forEach(element => {
        element.close();
      });
      infowindow.open(this.map, mark);
      this.infowindows.push(infowindow);
    },
    addMarkers() {
      const { Marker } = this.google.maps;
      const gMap = this.map;
      let mark;
      // unire a sotto TODO
      this.gMarkers = this.stores.map(store => {
        mark = new Marker({
          position: { lat: +store.lat, lng: +store.lng },
          icon: markerIcon,
          title: store.name,
          map: gMap
        });
        mark.addListener("click", () => {
          this.$store.dispatch({
            type: "stores/selectStore",
            id: store.id
          });
        });
        return mark;
      });
    },
    refreshMarkers() {
      const { Marker } = this.google.maps;
      const gMap = this.map;
      let mark;
      this.gMarkers = this.filtered.map(store => {
        mark = new Marker({
          position: { lat: +store.lat, lng: +store.lng },
          icon: markerIcon,
          title: store.name,
          map: gMap
        });
        mark.addListener("click", () => {
          this.$store.dispatch({
            type: "stores/selectStore",
            id: store.id
          });
        });
        return mark;
      });
    }
  }
};
</script>

<style lang="scss">
.markers {
  display: none;
}
.store-name {
  font-weight: bold;
}
</style>
