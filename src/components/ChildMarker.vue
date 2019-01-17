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
        this.marker.setAnimation(this.google.maps.Animation.BOUNCE);
      } else {
        this.infowindow.close();
        this.marker.setAnimation(null);
      }
    }
  },
  methods: {
    selectStore() {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: this.position.storeId
      });
      // caso se è già selezionaot nel vuex stato
      this.infowindow.open(this.map, this.marker);
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
    this.infowindow = infowindow;
    this.marker = marker;
    marker.addListener("click", function() {
      self.selectStore();
    });
    if (+this.storeId === this.position.storeId) {
      infowindow.open(this.map, marker);
      this.marker.setAnimation(this.google.maps.Animation.BOUNCE);
    }
  }
};
</script>
