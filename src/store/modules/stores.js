import * as R from "ramda";
import places from "../../../data/alexandermcqueen";
import termsJson from "../../../data/terms";
import { termsToCountries } from "../../helpers";
import router from "../../router";

const state = {
  all: [],
  pending: false,
  error: false,
  selectedStoreId: 0,
  countries: [],
  selectedCountryId: 0,
  path: "/store-locator",
  mapLoaded: false
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
  mapLoaded({ commit }) {
    commit("mapLoaded");
  }
};

const mutations = {
  selectCountryId(state, term_id) {
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
    state.selectedStoreId = id;
    state.path = `/store-locator/${state.selectedStoreId}`;
    router.push(state.path);
  },
  mapLoaded(state) {
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
