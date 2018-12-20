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
    storeid: Number
  },
  data() {
    return {
      infowindow: {},
      marker: {}
    };
  },
  computed: {
    ...mapState({
      selectedStoreId: function(state) {
        if (state.stores.selectedStoreId === this.storeid) {
          this.infowindow.open(this.map, this.marker);
        } else {
          //debugger;
          //this.infowindow.close();
        }
      }
    })
  },
  mounted() {
    const { Marker } = this.google.maps;
    const { InfoWindow } = this.google.maps;
    this.marker = new Marker({
      position: this.position,
      map: this.map,
      title: this.position.markerName
    });
    this.infowindow = new InfoWindow({
      content: this.position.markerName
    });
  }
};
</script>
