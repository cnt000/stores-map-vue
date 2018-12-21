<template>
  <div class="app-container">
    <sidebar>
      <stores-list/>
    </sidebar>
    <map-loader :map-config="mapConfig" :apiKey="apiKey">
      <template slot-scope="scopeProps">
        <div class="markers">
          <child-marker
            v-for="(marker,i) in markers"
            :key="i"
            :position="marker"
            :google="scopeProps.google"
            :map="scopeProps.map"
            :storeid="marker.storeid"
          />
        </div>
      </template>
    </map-loader>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MapLoader from "./MapLoader.vue";
import ChildMarker from "./ChildMarker.vue";
import Sidebar from "./Sidebar.vue";
import StoresList from "./StoresList.vue";
import { mapConfig, apiKey } from "../conf.js"

export default {
  data() {
    return {
      mapConfig: mapConfig,
      apiKey: apiKey
    };
  },
  computed: {
    markers() {
      return this.stores.reduce((accumulator, currentValue) => {
        return accumulator.concat({
          lat: parseFloat(currentValue.lat),
          lng: parseFloat(currentValue.lng),
          markerName: currentValue.post_title,
          storeid: currentValue.ID
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
    ChildMarker,
    Sidebar,
    StoresList
  }
};
</script>
