import * as R from "ramda";
import places from "../../../data/alessandrore";
import { decodeStores } from "@/helpers";
import router from "@/router";
import { sortByNames } from "@/conf";

const state = {
  all: [],
  active: [],
  filtered: [],
  path: "/stores-map-vue/store-locator",
  selectedStoreId: "",
  pending: false,
  error: false,
  mapLoaded: false,
  filters: []
};

const getters = {
  getSelectedStore: state => {
    const selectedId = state.selectedStoreId;
    const selectedStore = post => post.id === selectedId;
    const selectStore = pred => R.filter(pred);
    const getStore = selectStore(selectedStore);
    return R.head(getStore(state.all));
  }
};

const actions = {
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
  mapLoaded({ commit }) {
    commit("mapLoaded");
  },
  getActive({ commit }, { map }) {
    commit("getActive", { map });
  },
  filterToggle({ commit }, id) {
    commit("filterToggle", id);
  },
  filterActive({ commit }) {
    commit("filterActive");
  },
  filterByKeyword({ commit }, id) {
    commit("filterByKeyword", id);
  }
};

const mutations = {
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
    const getId = x => x.id === id;
    const getSanitizedStoreName = R.pipe(
      R.find(getId),
      R.prop("name"),
      R.toLower,
      R.replace(/([ ]+)/g, "")
    );
    state.storeName = getSanitizedStoreName(state.all);
    state.path = `/store-locator/${state.storeName}-${id}`;
    state.selectedStoreId = id;
    router.push(state.path);
  },
  getActive(state, { map }) {
    state.active = state.all.filter((
      m // todo ramda
    ) => map.getBounds().contains({ lat: +m.lat, lng: +m.lng }));
    // active is a copy of visible markers,
    // filtered is a copy of active filtered
    state.filtered = state.active;
  },
  filterActive(state) {
    const storeFilters = state.filters;
    const hasFilter = store =>
      storeFilters.filter(filter => {
        // todo ramda
        return store[filter.name] === filter.value;
      }).length > 0;
    state.active = state.all;
    if (storeFilters.length > 0) {
      state.filtered = state.active.filter(store => hasFilter(store)); // todo ramda
    } else {
      state.filtered = state.active;
    }
  },
  mapLoaded(state) {
    state.mapLoaded = true;
  },
  filterToggle(state, { id }) {
    // todo active
    if (
      state.filters.find(el => el.name === id.name && el.value === id.value) // todo ramda
    ) {
      state.filters = state.filters.filter(
        // todo ramda
        el => el.name === id.name && el.value !== id.value
      );
    } else {
      state.filters = [...state.filters, { name: id.name, value: id.value }];
    }
  },
  filterByKeyword(state, id) {
    if (id === "") {
      return;
    }
    const lowerStrings = ({
      name,
      address,
      gender,
      city,
      country,
      continent
    }) => `${name} ${address} ${gender} ${city} ${country} ${continent}`;
    const byKeyword = R.useWith(R.includes, [R.toLower, lowerStrings]);
    const filterTerms = keyword =>
      R.filter(element => byKeyword(keyword, element));

    const filterByBologna = filterTerms(id);
    state.filtered = filterByBologna(state.active);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
