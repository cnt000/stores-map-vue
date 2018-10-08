import storesJson from "../../../data/store-locator";

const state = {
  all: [],
  pending: false,
  error: false
};

const getters = {};

const actions = {
  getAllStores({ commit }) {
    commit("apiPending");

    commit(
      "receiveAll",
      storesJson.sort((a, b) => (a.post_title < b.post_title ? -1 : 1))
    );

    // return fetch("../../../data/store-locator.json")
    //   .then(r => r.json())
    //   .then(json => {
    //     commit("receiveAll", json);
    //   })
    //   .catch(e => {
    //     commit("apiFailure", e);
    //   });
  }
};

const mutations = {
  receiveAll(state, stores) {
    state.all = stores;
  },
  apiPending(state) {
    state.pending = true;
  },
  apiFailure(state) {
    state.pending = false;
    state.error = true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
