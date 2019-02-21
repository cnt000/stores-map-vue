<template>
  <div class="app-container">
    <sidebar>
      <stores-list/>
    </sidebar>
    <map-loader :map-config="mapConfig" :apiKey="apiKey">
      <template slot-scope="scopeProps">
        <my-position :google="scopeProps.google" :map="scopeProps.map"/>
        <cluster :google="scopeProps.google" :map="scopeProps.map"/>
      </template>
    </map-loader>
  </div>
</template>

<script>
import * as R from "ramda";
import MapLoader from "./MapLoader.vue";
import MyPosition from "./MyPosition.vue";
import Cluster from "./Cluster.vue";
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
    Sidebar,
    StoresList,
    MyPosition,
    Cluster
  }
};
</script>
