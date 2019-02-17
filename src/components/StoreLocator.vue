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
          />
        </div>
      </template>
    </map-loader>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as R from "ramda";
import MapLoader from "./MapLoader.vue";
import ChildMarker from "./ChildMarker.vue";
import Sidebar from "./Sidebar.vue";
import StoresList from "./StoresList.vue";
import { mapConfig, apiKey } from "@/conf.js";

export default {
  data() {
    return {
      mapConfig: mapConfig,
      apiKey: apiKey
    };
  },
  computed: {
    ...mapState({
      stores: state => state.stores.all,
      markers: state => state.stores.markers,
      selectedStoreId: state => state.stores.selectedStoreId
    })
  },
  mounted() {
    const splitWords = R.split("-");
    const storeParam = this.$route.params.store || "";
    const storeId = R.last(splitWords(storeParam));
    storeId &&
      this.$store.dispatch({
        type: "stores/selectStore",
        id: storeId
      });
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
