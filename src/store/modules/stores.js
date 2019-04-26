import * as R from "ramda";
import places from "../../../data/alessandrore";
import { decodeStores } from "@/helpers";
import router from "@/router";
import { sortByNames } from "@/conf";

const state = {
  all: [],
  active: [],
  path: "/stores-map-vue/store-locator",
  selectedId: "",
  pending: false,
  error: false,
  mapLoaded: false,
  filters: []
};

const getters = {
  getSelectedStore: state => {
    const selectedId = state.selectedId;
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
  toggleDimension({ commit }, id) {
    commit("toggleDimension", id);
  },
  filterStores({ commit }) {
    commit("filterStores");
  },
  filterByKeyword({ commit }, id) {
    commit("filterByKeyword", id);
  }
};

const mutations = {
  receiveAll(state, stores) {
    state.pending = false;
    state.all = stores;
    state.active = state.all;
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
    state.selectedId = id;
    router.push(state.path);
  },
  getActive(state, { map }) {
    const containedInMap = m =>
      map.getBounds().contains({ lat: +m.lat, lng: +m.lng });
    const getActiveMarkers = R.filter(containedInMap);
    // active is a copy of visible markers
    state.active = getActiveMarkers(state.all);
  },
  filterStores(state) {
    const storeFilters = state.filters;

    const hasFilter = store =>
      // todo ramda
      storeFilters.filter(filter => {
        return store[filter.name] === filter.value;
      }).length > 0;

    if (storeFilters.length > 0) {
      // todo ramda
      state.active = state.active.filter(store => hasFilter(store));
    }
  },
  mapLoaded(state) {
    state.mapLoaded = true;
  },
  toggleDimension(state, { id }) {
    const matchNameAndValue = el =>
      el.name === id.name && el.value === id.value;
    const matchName = el => el.name === id.name && el.value !== id.value;
    const hasFilter = R.find(matchNameAndValue);
    const hasFilterName = R.filter(matchName);
    if (hasFilter(state.filters)) {
      state.filters = hasFilterName(state.filters);
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
    const filterById = filterTerms(id);
    state.active = filterById(state.active);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
