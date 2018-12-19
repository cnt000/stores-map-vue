<template>
  <div class="stores">
    <select @change="selectTermId()" v-model="key" class="stores_nations">
      <option value="0">All</option>
      <option
        v-for="country in countries"
        :key="country.term_id"
        :value="country.term_id"
      >{{ country.name }}</option>
    </select>
    <div>
      <input class="stores_search" type="text" placeholder="filter" v-model="keyword">
      <div v-if="error">... ERROR ...</div>
      <ul v-else class="stores_list">
        <span v-if="pending">... LOADING ...</span>
        <li
          v-for="store in filteredStores"
          :data-storeid="store.ID"
          :key="store.ID"
          v-on:click="selectStore(store.ID)"
          class="stores_list_store"
        >
          <span class="stores_list_store_name">{{ store.post_title }}</span>
          <span>Latitude: {{ store.lat }}</span>
          <span>Longitude: {{ store.lng }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
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
  &_nations {
    width: 100%;
    height: 60px;
  }
  &_list {
    border-top: 1px solid black;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    &_store {
      display: flex;
      flex-direction: column;
      border: 1px solid black;
      border-top: none;
      padding: 4px;
      cursor: pointer;
      &:hover {
        background-color: lightgreen;
      }
      &:active {
        background-color: lightcoral;
      }
      &_name {
        font-weight: bold;
      }
    }
  }
}
</style>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      keyword: "",
      active: false,
      key: 0
    };
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
    }
  },
  methods: {
    selectStore(clickedId) {
      debugger;
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
    },
    selectTermId() {
      this.$store.dispatch({
        type: "stores/selectCountryTermId",
        id: +this.key
      });
    }
  },
  created() {
    this.$store.dispatch("stores/getCountries");
  }
};
</script>
