<template>
  <div class="stores">
    <select @change="selectTermId()" v-model="key">
      <option value="0">All</option>
      <option
        v-for="country in countries"
        :key="country.term_id"
        :value="country.term_id"
        @change="selectTermId(country.term_id)"
      >{{ country.name }}</option>
    </select>
    <div>
      <input class="stores_search" type="text" placeholder="filter" v-model="keyword">
      <div v-if="error">... ERROR ...</div>
      <ul v-else>
        <span v-if="pending">... LOADING ...</span>
        <li
          v-for="store in filteredStores"
          :key="store.ID"
          v-on:click="selectStore(store.ID)"
        >
          <span class="store-name">{{store.ID}}: {{ store.post_title }}</span>
          <br>
          Latitude: {{ store.lat }}
          Longitude: {{ store.lng }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.selected {
  background-color: yellowgreen;
}
.stores {
  &_search {
    margin-top: 2px;
    box-sizing: border-box;
    border: 1px solid black;
    width: 100%;
    height: 36px;
    font-size: 18px;
    border-bottom: 0;
    &::placeholder {
      font-size: 14px;
      text-indent: 4px;
    }
  }
}
select {
  width: 100%;
  height: 60px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.store-name {
  font-weight: bold;
}
ul {
  border-top: 1px solid black;
  width: 100%;
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
</style>

<script>
import { mapState } from "vuex";

export default {
  props: {
    google: Object,
    map: Object
  },
  data() {
    return {
      keyword: "",
      active: false,
      key: 0
    };
  },
  mounted() {
    const { Geocoder } = this.google.maps;
    this.geocoder = new Geocoder();
  },
  computed: {
    ...mapState({
      stores: state => state.stores.all,
      pending: state => state.stores.pending,
      error: state => state.stores.error,
      countries: state => state.stores.countries,
      selectedCountryTermId: state => state.stores.selectedCountryTermId
    }),
    filteredStores() {
      if (this.keyword.length === 0 && !this.selectedCountryTermId) {
        return this.stores;
      } else if (this.selectedCountryTermId) {
        return this.stores.filter(item =>
          item.terms.find(o => o.term_id === this.selectedCountryTermId)
        );
      } else {
        return this.stores.filter(
          item =>
            item.post_title.toLowerCase().indexOf(this.keyword.toLowerCase()) >
            -1
        );
      }
    },
    hasSelectedCountry() {
      return !!this.$store.state.stores.selectedCountryTermId;
    }
  },
  methods: {
    selectStore(clickedId) {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
      this.centerMap();
    },
    selectCountry(selectedTermId) {
      const map = this.map;
      if (selectedTermId === "0") {
        map.setCenter({ lat: 51, lng: 0 });
        map.setZoom(4);
        return;
      }
      const countrySelected = this.$store.state.stores.countries.filter(
        country => country.term_id === selectedTermId
      )[0];
      this.geocoder.geocode({ address: countrySelected.name }, function(
        results,
        status
      ) {
        if (status === "OK") {
          map.setCenter(results[0].geometry.location);
          map.setZoom(6);
        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    },
    centerMap() {
      const map = this.map;
      let storeSelected = this.$store.state.stores.all.filter(
        store => store.ID === this.$store.state.stores.selectedStoreId
      )[0];
      if (storeSelected.lat !== "" && storeSelected.lng !== "") {
        map.panTo({
          lat: parseFloat(storeSelected.lat),
          lng: parseFloat(storeSelected.lng)
        });
        map.setZoom(14);
      } else {
        this.geocoder.geocode(
          { address: storeSelected.custom["wpcf-yoox-store-address"][0] },
          function(results, status) {
            if (status === "OK") {
              map.setCenter({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
              map.setZoom(18);
            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
          }
        );
      }
    },
    selectedClass(term_id) {
      return term_id === this.selectedCountryTermId ? "selected" : "";
    },
    selectTermId() {
      this.$store.dispatch("stores/selectCountryTermId", this.key);
      this.selectCountry(this.key);
    }
  },
  created() {
    this.$store.dispatch("stores/getCountries");
  }
};
</script>
