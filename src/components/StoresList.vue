<template>
  <div class="stores">
    <div>
      <input
        class="stores_search"
        type="text"
        placeholder="filter"
        v-model="keyword"
      />
      <span v-if="pending">... LOADING ...</span>
      <span v-if="error">... ERROR!!! ...</span>
      <ul class="stores_list">
        <li
          v-if="filteredStores.length === 0"
          class="stores_list_store stores_list_store--empty"
        >
          Non ci sono risultati
        </li>
        <li
          v-else
          v-for="store in filteredStores"
          :data-storeid="store.id"
          :key="store.id"
          v-on:click="selectStore(store.id)"
          :class="{ selected: storeId === store.id, stores_list_store: true }"
        >
          <div class="stores_list_store_name" :title="store.name">
            {{ store.name }}
          </div>
          <div class="stores_list_store_address">{{ store.address }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      keyword: "",
      countryId: 0
    };
  },
  computed: {
    ...mapState({
      active: state => state.stores.active,
      storeId: state => state.stores.selectedStoreId,
      pending: state => state.stores.pending,
      error: state => state.stores.error,
      filtered: state => state.stores.filtered
    }),
    filteredStores() {
      let stores = this.active;
      if (this.filtered.length > 0) {
        let filteredSet = new Set(this.filtered);
        stores = this.active.filter(x => filteredSet.has(x));
      }
      if (this.keyword === "") return stores;
      return stores.filter(elm => {
        let string = `${elm.name} ${elm.address} ${elm.gender} ${elm.city} ${
          elm.country
        } ${elm.continent}`;
        return string.toLowerCase().includes(this.keyword.toLowerCase());
      });
    }
    // filteredStores() {
    //   const storeName = R.prop("name");
    //   const address = R.prop("address");
    //   const gender = R.prop("gender");
    //   const city = R.path(["locations", "city", "name"]);
    //   const country = R.path(["locations", "country", "name"]);
    //   const continent = R.path(["locations", "continent", "name"]);

    //   const keywordInLowerCase = R.toLower(this.keyword);
    //   const hasKeywordInTitle = R.includes(keywordInLowerCase);

    //   const filterByKeywordAddress = R.filter(
    //     R.pipe(
    //       address,
    //       R.toLower,
    //       hasKeywordInTitle
    //     )
    //   );
    //   const filterByKeywordGender = R.filter(
    //     R.pipe(
    //       gender,
    //       R.toLower,
    //       hasKeywordInTitle
    //     )
    //   );
    //   // const countryId = this.CountryId;
    //   // const hasCountryId = R.any(R.propEq("term_id", countryId));
    //   // const filterByCountryId = R.filter(
    //   //   R.compose(
    //   //     hasCountryId,
    //   //     R.prop("terms")
    //   //   )
    //   // );
    //   // const countryIdGtZero = () => R.gt(this.CountryId, 0);
    //   // const filterByCountryIdAndKeyword = R.compose(
    //   //   filterByKeyword,
    //   //   R.when(countryIdGtZero, filterByCountryId)
    //   // );
    //   const filterBy = R.pipe(
    //     filterByKeyword,
    //     filterByKeywordGender,
    //     filterByKeywordAddress
    //   );
    //   return filterBy(this.active);
    // }
  },
  methods: {
    selectStore(clickedId) {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
    },
    selectCountryId() {
      this.$store.dispatch({
        type: "stores/selectCountryId",
        id: +this.countryId
      });
    }
  },
  created() {
    this.$store.dispatch("stores/getCountries");
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
.stores {
  overflow: hidden;
  height: 100vh;
  > div {
    height: inherit;
  }
  &_search {
    border: 1px solid black;
    width: 100%;
    height: 56px;
    font-size: 18px;
    border-bottom: 0;
    text-indent: 8px;
    &::placeholder {
      font-size: 14px;
    }
  }
  &_countries {
    width: 100%;
    height: 60px;
  }
  &_list {
    border-top: 1px solid black;
    box-sizing: border-box;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    max-height: calc(100vh - 60px);
    &_store {
      border: 1px solid black;
      border-top: none;
      padding: 4px;
      height: 60px;
      cursor: pointer;
      overflow: hidden;
      &--empty {
        background-color: lightsalmon;
      }
      &:hover {
        background-color: lightgreen;
      }
      &:active {
        background-color: lightcoral;
      }
      &_name {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &_address {
        font-size: 80%;
      }
      &.selected {
        background: lightcyan;
      }
    }
  }
}
</style>
