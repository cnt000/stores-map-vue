<template>
  <div class="stores">
    <ul>
      <li
        v-for="country in countries"
        :key="country.term_id"
        v-on:click="selectTermId(country.term_id)"
        :class="selectedClass(country.term_id)">
          {{ country.name }}
      </li>
    </ul>
    <div v-if="selectedCountryTermId">
      <input class="stores_search" type="text" placeholder="filter" v-model="keyword" />
      <div v-if="error"> ... ERROR ... </div>
        <ul v-else>
          <span v-if="pending"> ... LOADING ... </span>
          <li
            v-for="store in filteredStores"
            :key="store.ID"
            v-on:click="selectStoreParent(store.ID)">
            <span class="store-name">{{store.ID}}: {{ store.post_title }}</span><br>
            Latitude:  {{ store.lat }}
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
  display: flex;
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
</style>

<script>
import { mapState } from "vuex";

export default {
  props: {
    selectStore: Function,
    selectCountry: Function
  },
  data() {
    return {
      keyword: "",
      active: false
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
      // return this.keyword.length > 0
      //   ? this.stores
      //       .filter(item =>
      //         item.terms.find(o => o.term_id === this.selectedCountryTermId)
      //       )
      //       .filter(item => {
      //         return (
      //           item.post_title
      //             .toLowerCase()
      //             .indexOf(this.keyword.toLowerCase()) > -1
      //         );
      //       })
      //   :
      return this.stores.filter(item =>
        item.terms.find(o => o.term_id === this.selectedCountryTermId)
      );
    },
    hasSelectedCountry() {
      return !!this.$store.state.stores.selectedCountryTermId;
    }
  },
  methods: {
    selectedClass(term_id) {
      return term_id === this.selectedCountryTermId ? "selected" : "";
    },
    selectStoreParent(id) {
      return this.selectStore(id);
    },
    selectTermId(term_id) {
      this.$store.dispatch("stores/selectCountryTermId", term_id);
      this.selectCountry(term_id);
    }
  },
  created() {
    this.$store.dispatch("stores/getCountries");
  }
};
</script>
