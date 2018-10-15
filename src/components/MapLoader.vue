<template>
  <div class="map-container">
    <StoresList :selectStore="selectStore" />
    <div id="map"></div>
    <template v-if="!!this.google && !!this.map">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import MapProvider from "./MapProvider";
import StoresList from "./StoresList";
import { mapState } from "vuex";

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },
  components: {
    MapProvider,
    StoresList
  },
  data() {
    return {
      google: null,
      map: null,
      keyword: ""
    };
  },
  mounted() {
    GoogleMapsApiLoader({
      apiKey: this.apiKey
    }).then(google => {
      this.google = google;
      this.initializeMap();
    });
  },
  computed: {
    ...mapState({
      stores: state => state.stores.all,
      pending: state => state.stores.pending,
      error: state => state.stores.error,
      selectedStoreId: state => state.stores.selectedStoreId,
      selectedStoreLat: state => {
        return parseFloat(
          state.stores.all.filter(
            store => store.ID === state.stores.selectedStoreId
          )[0].lat
        );
      },
      selectedStoreLng: state =>
        parseFloat(
          state.stores.all.filter(
            store => store.ID === state.stores.selectedStoreId
          )[0].lng
        )
    }),
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
  methods: {
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
    },
    panTo() {
      let storeSelected = this.$store.state.stores.all.filter(
        store => store.ID === this.$store.state.stores.selectedStoreId
      )[0];
      if (storeSelected.lat !== "" && storeSelected.lng !== "") {
        this.map.panTo({
          lat: parseFloat(storeSelected.lat),
          lng: parseFloat(storeSelected.lng)
        });
        this.map.setZoom(14);
      }
    },
    selectStore: function(clickedId) {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
      this.panTo();
    }
  }
};
</script>

<style lang="scss">
#map {
  height: 500px;
}
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
  float: left;
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
