<template>
  <div class="stores-map">
    <div class="stores">
      <input class="stores_search" type="text" placeholder="filter" v-model="keyword" />
      <div v-if="error"> ... ERROR ... </div>
      <ul v-else>
        <span v-if="pending"> ... LOADING ... </span>
        <li
          v-for="store in filteredStores"
          :key="store.ID"
          v-on:click="selectStore(store.ID)">
          <span class="store-name">{{store.ID}}: {{ store.post_title }}</span><br>
          Latitude:  {{ store.lat }}
          Longitude: {{ store.lng }}
        </li>
      </ul>
    </div>
    <div class="map">
      <span>selectedStore: {{selectedStoreId}}</span>
      <Map
        :markers="coords"
        :selectedStoreId="selectedStoreId"
        :selectedStoreLat="selectedStoreLat"
        :selectedStoreLng="selectedStoreLng"></Map>
    </div>
  </div>
</template>

<style lang="scss">
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.stores-map {
  display: flex;
}
.stores {
  text-align: left;
  width: 300px;
  &_search {
    box-sizing: border-box;
    border: 1px solid black;
    width: 100%;
    height: 36px;
    font-size: 24px;
  }
}
ul {
  border-top: 1px solid black;
  width: 300px;
}
li {
  border: 1px solid black;
  border-top: none;
  padding: 4px;
  cursor: pointer;
}
li:hover {
  background-color: lightgreen;
}
li:active {
  background-color: lightcoral;
}
.map {
  width: 100%;
}
.store-name {
  font-weight: bold;
}
</style>

<script>
import { mapState } from "vuex";
import Map from "@/components/Map.vue";

export default {
  data() {
    return {
      keyword: ""
    };
  },
  methods: {
    selectStore: function(clickedId) {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
    }
  },
  computed: {
    ...mapState({
      stores: state => state.stores.all,
      pending: state => state.stores.pending,
      error: state => state.stores.error,
      selectedStoreId: state => state.stores.selectedStoreId,
      selectedStoreLat: state => {
        return parseFloat(
          state.stores.all.filter(store => store.ID === state.stores.selectedStoreId)[0]
            .lat
        )
      },
      selectedStoreLng: state =>
        parseFloat(
          state.stores.all.filter(store => store.ID === state.stores.selectedStoreId)[0]
            .lng
        )
    }),
    coords() {
      return this.stores
        .filter(obj => obj.lat !== "" && obj.lng !== "")
        .reduce(function(accumulator, currentValue) {
          return accumulator.concat({
            lat: parseFloat(currentValue.lat),
            lng: parseFloat(currentValue.lng)
          });
        }, []);
    },
    filteredStores() {
      return this.keyword.length > 0
        ? this.stores.filter(item => {
            return (
              item.post_title
                .toLowerCase()
                .indexOf(this.keyword.toLowerCase()) > -1
            );
          })
        : this.stores;
    }
  },
  created() {
    this.$store.dispatch("stores/getAllStores");
  },
  components: {
    Map
  }
};
</script>
