import storesJson from "../../../data/store-locator";

const state = {
  all: [],
  pending: false,
  error: false,
  selectedStoreId: 7978
};

const getters = {
  getCenteredStore: state => {
    return state.all.filter(store => store.ID === state.selectedStoreId)[0];
  }
};

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
  },
  selectStore({ commit }, { id }) {
    commit("selectStore", id);
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
    state.selectedStoreId = id;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
