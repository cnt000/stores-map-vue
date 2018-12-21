<template>
  <div></div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    google: Object,
    map: Object,
    position: Object,
    storeid: Number
  },
  computed: {
    ...mapState({
      storeId: state => state.stores.selectedStoreId
    })
  },
  watch: {
    storeId: function(val) {
      if (val === this.storeid) {
        this.infowindow.open(this.map, this.marker);
      } else {
        this.infowindow.close();
      }
    }
  },
  mounted() {
    const { Marker } = this.google.maps;
    const { InfoWindow } = this.google.maps;
    const marker = new Marker({
      position: this.position,
      map: this.map,
      title: this.position.markerName
    });
    const infowindow = new InfoWindow({
      content: this.position.markerName
    });
    marker.addListener("click", function() {
      infowindow.open(this.map, marker);
    });
    this.infowindow = infowindow;
    this.marker = marker;
  }
};
</script>
