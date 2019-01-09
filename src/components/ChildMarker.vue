<template>
  <div></div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    google: Object,
    map: Object,
    position: Object
  },
  computed: {
    ...mapState({
      storeId: state => state.stores.selectedStoreId
    })
  },
  watch: {
    storeId: function(val) {
      if (val === this.position.storeId) {
        this.infowindow.open(this.map, this.marker);
      } else {
        this.infowindow.close();
      }
    }
  },
  methods: {
    selectStore() {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: this.position.storeId
      });
    }
  },
  mounted() {
    const { Marker } = this.google.maps;
    const { InfoWindow } = this.google.maps;
    const self = this;
    const marker = new Marker({
      position: this.position,
      map: this.map,
      title: this.position.markerName
    });
    const infowindow = new InfoWindow({
      content: this.position.markerName
    });
    marker.addListener("click", function() {
      self.selectStore();
    });
    if (+this.storeId === this.position.storeId) {
      infowindow.open(this.map, marker);
    }
    this.infowindow = infowindow;
    this.marker = marker;
  }
};
</script>
