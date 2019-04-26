<template>
  <div class="marker"></div>
</template>

<script>
import { mapState } from "vuex";
import MarkerCluster from "@google/markerclusterer";
import * as R from "ramda";
import { clusterImgs, clusterizeResults, markerIcon } from "@/conf.js";

export default {
  props: {
    google: Object,
    map: Object
  },
  data() {
    return {
      gMarkers: null,
      infowindow: null,
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
      const zoom = this.map.getZoom();
      console.log(zoom);
      // close infowindow if not clusterized on zoom out
      if(!clusterizeResults && zoom < 10) {
        this.infowindow.close();
      }
      // off clusterization on high zoom
      if (clusterizeResults) {
        this.checkZoom(zoom);
      }
    },
    filters() {
      this.markers();
    }
  },
  mounted() {
    const { InfoWindow } = this.google.maps;
    this.infowindow = new InfoWindow({
      content: ""
    });
    this.refreshMarkers();
    if (clusterizeResults) this.clusterize();
    this.setActive(this.selectedStoreId);
  },
  methods: {
    markers() {
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
    },
    clusterize() {
      this.Markers = new MarkerCluster(this.map, this.gMarkers, {
        imagePath: clusterImgs
      });
      this.isMarkersized = true;
    },
    checkZoom(zoom) {
      if (zoom >= 14 && this.isMarkersized) {
        this.Markers.clearMarkers();
        this.isMarkersized = false;
        this.refreshMarkers();
        this.setActive(this.selectedStoreId);
      } else if (zoom < 14 && !this.isMarkersized) {
        this.clusterize();
      }
    },
    setActive(id) {
      if (!id) {
        return;
      }
      const getId = a => a.id === id;
      const findById = R.find(getId);
      const store = findById(this.stores);
      const lat = parseFloat(store.lat).toFixed(7);
      const lng = parseFloat(store.lng).toFixed(7);
      const findMarker = gMark =>
        gMark
          .getPosition()
          .lat()
          .toFixed(7) === lat &&
        gMark
          .getPosition()
          .lng()
          .toFixed(7) === lng;
      const findMarkerByPosition = R.find(findMarker);
      const mark = findMarkerByPosition(this.gMarkers);
      this.infowindow.close();
      this.infowindow.setContent(`<div class="store-name">${store.name}<br>
        ${store.gender}</div>
        <div>${store.address}</div> 
        ${store.phone}<br>
        ${store.hours}`);
      this.infowindow.open(this.map, mark);
    },
    refreshMarkers() {
      const { Marker } = this.google.maps;
      const gMap = this.map;
      let mark;
      const markerFactory = store => {
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
      };
      const createMarkers = R.map(markerFactory);
      this.gMarkers = createMarkers(this.stores);
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
