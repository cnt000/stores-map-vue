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
          <span class="store-name">{{ store.post_title }}</span><br>
          Latitude:  {{ store.lat }}
          Longitude: {{ store.lng }}
        </li>
      </ul>
    </div>
    <div class="map">
      <Map :markers="coords" :selectedStore="storeSelected"></Map>
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
}
.map {
  width: 100%;
}
.store-name {
  font-weight: bold;
}
</style>

<script>
import { mapState, mapGetters } from "vuex";
import Map from "@/components/Map.vue";

export default {
  data() {
    return {
      keyword: ""
    };
  },
  methods: {
    selectStore: function(clickedId) {
          debugger;
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
    }
  },
  computed: {
    ...mapState({
      stores: state => state.stores.all,
      pending: state => state.pending,
      error: state => state.error,
      selectedStoreId: state => state.selectedStoreId
    }),
    ...mapGetters([{
      getCenteredStore: 'getCenteredStore'
    }]),
    storeSelected() {
      return this.$store.state.stores.all.filter(store => store.ID === this.$store.state.stores.selectedStoreId)[0];
    },
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
