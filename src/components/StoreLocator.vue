<template>
  <div>
    <map-loader :map-config="mapConfig" apiKey="AIzaSyBNzPxDEDzlMCA9cedItIPCwtbdk037BGg">
      <template slot-scope="scopeProps">
        <sidebar>
          <stores-list />
        </sidebar>
        <div class="markers">
          <child-marker
            v-for="(marker,i) in markers"
            :key="i"
            :position="marker"
            :google="scopeProps.google"
            :map="scopeProps.map"
            :geocoder="scopeProps.geocoder"
            :markerName="scopeProps.markerName"
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
      return this.stores.reduce(function(accumulator, currentValue) {
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
  methods: {
    log(a) {
      console.log("asda ", a);
    }
  },
  components: {
    MapLoader,
    ChildMarker,
    Sidebar,
    StoresList
  }
};
</script>
