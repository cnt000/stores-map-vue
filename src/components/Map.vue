<template>
  <map-loader 
    :map-config="mapConfig"
    apiKey="AIzaSyBNzPxDEDzlMCA9cedItIPCwtbdk037BGg">
    <template slot-scope="scopeProps">
      <child-marker 
        v-for="(marker,i) in markers"
        :key="i"
        :position="marker" 
        :google="scopeProps.google"
        :map="scopeProps.map"
        :geocoder="scopeProps.geocoder"
        :markerName="scopeProps.markerName"
      />
    </template>
  </map-loader>
</template>

<script>
import { mapState } from "vuex";
import MapLoader from "./MapLoader.vue";
import ChildMarker from "./ChildMarker";

export default {
  data() {
    return {
      mapConfig: {
        zoom: 4,
        center: {
          lat: 51,
          lng: 0
        }
      }
    };
  },
  computed: {
    markers() {
      return this.stores
        // .filter(obj => obj.lat !== "" && obj.lng !== "")
        .reduce(function(accumulator, currentValue) {
          return accumulator.concat({
            lat: parseFloat(currentValue.lat),
            lng: parseFloat(currentValue.lng),
            markerName: currentValue.post_title
          });
        }, []);
    },
    ...mapState({
      stores: state => state.stores.all,
      selectedStoreId: state => state.stores.selectedStoreId
    })
  },
  created() {
    this.$store.dispatch("stores/getAllStores");
  },
  components: {
    MapLoader,
    ChildMarker
  }
};
</script>
