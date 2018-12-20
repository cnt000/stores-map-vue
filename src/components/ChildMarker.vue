<template>
  <div :store="selectedStoreId"></div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    google: Object,
    map: Object,
    position: Object,
    storeid: String
  },
  computed: {
    ...mapState({
      selectedStoreId: function(state) {
        if (state.stores.selectedStoreId === this.storeid) {
          const { Marker } = this.google.maps;
          const { InfoWindow } = this.google.maps;
          let infowindow = new InfoWindow({
            content: this.position.markerName
          });
          let marker = new Marker({
            position: this.position,
            map: this.map,
            title: this.position.markerName
          });
          infowindow.open(this.map, marker);
        }
      }
    })
  },
  mounted() {
    const { Marker } = this.google.maps;
    const { InfoWindow } = this.google.maps;
    let infowindow = new InfoWindow({
      content: this.position.markerName
    });
    let marker = new Marker({
      position: this.position,
      map: this.map,
      title: this.position.markerName
    });
    marker.addListener("click", function() {
      infowindow.open(this.map, marker);
    });
  }
};
</script>
