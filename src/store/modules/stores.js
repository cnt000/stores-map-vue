import * as R from "ramda";
import places from "../../../data/alessandrore";
import { decodeStores } from "@/helpers";
import router from "@/router";
import { sortByNames } from "@/conf";

const state = {
  all: [],
  active: [],
  pristineActiveStores: [],
  path: "/stores-map-vue/store-locator",
  selectedId: "",
  pending: false,
  error: false,
  mapLoaded: false,
  filters: {},
  keyword: ""
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
  updateKeyword({ commit }, { id }) {
    commit("updateKeyword", id);
  }
};

const mutations = {
  receiveAll(state, stores) {
    state.pending = false;
    state.all = stores;
    state.active = [...state.all];
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
    const activerMakers = getActiveMarkers(state.all);
    state.active = activerMakers;
    state.pristineActiveStores = [...activerMakers];
  },
  filterStores(state) {
    const storeFilters = state.filters;
    const filterNonEmtpy = s =>
      Object.keys(storeFilters).filter(f => s[f].length > 0);
    const filterNonEmptyLength = filterNonEmtpy(storeFilters).length;
    const getMatchedFilterWithDimension = s => {
      let checker = 0;
      /* TODO
      if value of store dimensione (ex: country)
      is included in filters[dimension] (ex: filters[country])
      increment a counter
      if length of counter is eualt to length of the key
      NOT EMPTY of the filter, it's true
      */
      Object.keys(storeFilters).forEach(f => {
        if (storeFilters[f].includes(s[f])) {
          checker++;
        }
      });
      if (filterNonEmptyLength === 0 || filterNonEmptyLength === checker) {
        return true;
      }
    };
    const getMatchedFilterWithText = s => {
      const lowerStrings = ({
        name,
        address,
        gender,
        city,
        country,
        continent
      }) => `${name} ${address} ${gender} ${city} ${country} ${continent}`;

      if (
        state.keyword.length === 0 ||
        lowerStrings(s)
          .toLowerCase()
          .includes(state.keyword.toLowerCase())
      ) {
        return true;
      }
      return false;
    };
    const filteredWithDimension = state.pristineActiveStores.filter(store =>
      getMatchedFilterWithDimension(store)
    );
    const filteredWithText = filteredWithDimension.filter(store =>
      getMatchedFilterWithText(store)
    );
    state.active = filteredWithText;
  },
  mapLoaded(state) {
    state.mapLoaded = true;
  },
  toggleDimension(state, { id }) {
    const storeFilters = state.filters;
    let totalFilters = 0;

    if (id.checked) {
      state.filters = {
        ...storeFilters,
        [id.name]: storeFilters[id.name]
          ? [...storeFilters[id.name], id.value]
          : [id.value]
      };
    } else {
      state.filters = {
        ...storeFilters,
        [id.name]: storeFilters[id.name].filter(f => f !== id.value)
      };
    }

    Object.keys(state.filters).forEach(
      k => (totalFilters += state.filters[k].length)
    );

    if (totalFilters === 0) {
      state.active = [...state.pristineActiveStores];
    }
  },
  updateKeyword(state, id) {
    state.keyword = id;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
