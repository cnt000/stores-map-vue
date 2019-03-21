import * as R from "ramda";
import places from "../../../data/alessandrore";
import termsJson from "../../../data/terms";
import { termsToCountries, decodeStores } from "@/helpers";
import router from "@/router";
import { sortByNames } from "@/conf";

const state = {
  all: [],
  active: [],
  path: "/stores-map-vue/store-locator",
  selectedStoreId: "",
  pending: false,
  error: false,
  mapLoaded: false,
  selectedCountryId: 0,
  countries: [],
  filters: []
};

const getters = {
  getSelectedStore: state => {
    const selectStoreFromId = post => post.id === state.selectedStoreId;
    const selectStore = pred => R.filter(pred);
    const getStore = selectStore(selectStoreFromId);
    return R.head(getStore(state.all));
  },
  getSelectedCountry: state => {
    const getStoreFromCountryId = R.filter(
      R.propEq("term_id", state.selectedCountryId)
    );
    return R.head(getStoreFromCountryId(state.countries));
  }
};

const actions = {
  getCountries({ commit }) {
    commit("apiPending");

    commit("receiveCountries", termsJson);
  },
  getAllStores({ commit }) {
    commit("apiPending");
    let allStores = decodeStores(places);
    if (sortByNames) {
      allStores.sort((a, b) => (a.name < b.name ? -1 : 1));
    }
    commit("receiveAll", allStores);
    // return fetch("../../../data/store-locator.json")
    //   .then(r => r.json())
    //   .then(json => {
    //     commit("receiveAll", json);
    //   })
    //   .catch(e => {
    //     commit("apiFailure", e);
    //   });
  },
  selectStore({ commit }, { id }) {
    commit("selectStore", id);
  },
  selectCountryId({ commit }, { id }) {
    commit("selectCountryId", id);
  },
  mapLoaded({ commit }) {
    commit("mapLoaded");
  },
  getActive({ commit }, { map }) {
    commit("getActive", { map });
  },
  filterToggle({ commit }, id) {
    commit("filterToggle", id);
  }
};

const mutations = {
  selectCountryId(state, term_id) {
    if (term_id === 0) {
      state.path = `/store-locator/`;
      router.push(state.path);
    }
    state.selectedCountryId = term_id;
  },
  receiveCountries(state, jsonTerms) {
    state.pending = false;
    state.countries = termsToCountries(jsonTerms.terms).countries;
  },
  receiveAll(state, stores) {
    state.pending = false;
    state.all = stores;
  },
  apiPending(state) {
    state.pending = true;
  },
  apiFailure(state) {
    state.pending = false;
    state.error = true;
  },
  selectStore(state, id) {
    const getStoreById = R.filter(elm => elm.id === id, state.all);
    const storeName = R.prop("name", R.head(getStoreById));
    const sanitize = name => R.replace(/([ ]+)/g, "", R.toLower(name));
    state.storeName = sanitize(storeName);
    state.path = `/store-locator/${state.storeName}-${id}`;
    router.push(state.path);
    state.selectedStoreId = id;
  },
  getActive(state, { map }) {
    state.active = state.all.filter(m =>
      map.getBounds().contains({ lat: +m.lat, lng: +m.lng })
    );
  },
  filterActive(state) {
    const activeStores = state.active;
    const storeFilters = state.filters;
    const hasFilter = store =>
      storeFilters.filter(filter => {
        return store[filter.name] === filter.value;
      }).length > 0;
    if (storeFilters.length > 0) {
      state.active = activeStores.filter(store => hasFilter(store));
    }
  },
  mapLoaded(state) {
    state.mapLoaded = true;
  },
  filterToggle(state, { id }) {
    if (
      state.filters.find(el => el.name === id.name && el.value === id.value)
    ) {
      state.filters = state.filters.filter(
        el => el.name === id.name && el.value !== id.value
      );
    } else {
      state.filters = [...state.filters, { name: id.name, value: id.value }];
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
