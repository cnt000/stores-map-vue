import * as R from "ramda";
import places from "../../../data/alessandrore";
import termsJson from "../../../data/terms";
import { termsToCountries } from "@/helpers";
import router from "@/router";

const state = {
  all: [],
  activeStores: [],
  pending: false,
  error: false,
  selectedStoreId: 0,
  storeName: "",
  countries: [],
  selectedCountryId: 0,
  path: "/stores-map-vue/store-locator",
  mapLoaded: false,
  markers: [],
  activeMarkers: [],
  map: null,
  geocoder: {}
};

const getters = {
  getSelectedStore: state => {
    const selectStoreFromId = post => post.ID === +state.selectedStoreId;
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

    commit(
      "receiveAll",
      places.sort((a, b) => (a.post_title < b.post_title ? -1 : 1)) // stink
    );
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
  mapLoaded({ commit }, { map, geocoder }) {
    commit("mapLoaded", { map, geocoder });
  },
  activeMarkers({ commit }, { map }) {
    commit("activeMarkers", { map });
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
    state.markers = stores.reduce((acc, cur) => {
      return acc.concat({
        lat: parseFloat(cur.lat),
        lng: parseFloat(cur.lng),
        markerName: cur.post_title,
        storeId: cur.ID
      });
    }, []);
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
    state.selectedStoreId = id;
    const getStoreById = R.filter(elm => elm.ID === +id, state.all);
    const storeName = R.prop("post_title", R.head(getStoreById));
    const sanitize = name => R.replace(/([ ]+)/g, "", R.toLower(name));
    state.storeName = sanitize(storeName);
    state.path = `/store-locator/${state.storeName}-${id}`;
    router.push(state.path);
  },
  activeMarkers(state, { map }) {
    state.activeMarkers = state.markers.filter(m =>
      map.getBounds().contains({ lat: m.lat, lng: m.lng })
    );
    state.activeStores = state.all.filter(s => {
      return state.activeMarkers.some(m => m.storeId === s.ID);
    });
  },
  mapLoaded(state, { geocoder }) {
    state.geocoder = geocoder;
    state.mapLoaded = true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
