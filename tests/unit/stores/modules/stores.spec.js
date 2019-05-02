import places from "../../../../data/alessandrore";
import storeMock from "../../../../data/storeMock";
import stores from "@/store/modules/stores";
import { decodeStores } from "@/helpers";

describe("Testing Getters", () => {
  const state = {
    all: [
      { id: 1, country: "italy" },
      { id: 3, country: "france" },
      { id: 5, country: "italy" }
    ],
    selectedId: 3
  };
  it("getSelectedStore", () => {
    expect(stores.getters.getStore(state)).toEqual({
      id: 3,
      country: "france"
    });
  });
  it("getSelectedStore empty", () => {
    expect(
      stores.getters.getStore({
        all: [],
        selectedId: 0
      })
    ).toEqual(undefined);
  });
  it("getDimensions country", () => {
    expect(stores.getters.getDimensions(state)("country")).toEqual([
      "italy",
      "france"
    ]);
  });
  it("getDimensions prop do not exist", () => {
    expect(stores.getters.getDimensions(state)("name")).toEqual([undefined]);
  });
});

describe("Testing Actions", () => {
  let actionNames;
  let obj;
  let payload;

  beforeEach(() => {
    actionNames = [];
    payload = {
      id: 1
    };
    obj = {
      id: 1,
      commit: (key, payload) => {
        actionNames.push({ key, payload });
      }
    };
  });
  it("getAllStores sorted", () => {
    stores.actions.getAllStores(obj);
    const sortByNames = true;
    let allStores = decodeStores(places);
    if (sortByNames) {
      allStores.sort((a, b) => (a.name < b.name ? -1 : 1));
    }
    expect(actionNames).toEqual([
      { key: "apiPending" },
      { key: "receiveAll", payload: allStores }
    ]);
  });
  it("getAllStores not sorted, ", () => {
    stores.actions.getAllStores(obj);
    const sortByNames = false;
    let allStores = decodeStores(places);
    if (sortByNames) {
      allStores.sort((a, b) => (a.name < b.name ? -1 : 1));
    }
    expect(actionNames).not.toEqual([
      { key: "apiPending" },
      { key: "receiveAll", payload: allStores }
    ]);
  });
  it("selectStore", () => {
    stores.actions.selectStore(obj, payload);
    expect(actionNames).toEqual([{ key: "selectStore", payload: { id: 1 } }]);
  });
  it("selectStore empty", () => {
    stores.actions.selectStore(obj, {});
    expect(actionNames).toEqual([{ key: "selectStore", payload: {} }]);
  });

  it("mapIsLoaded", () => {
    stores.actions.mapIsLoaded(obj);
    expect(actionNames).toEqual([{ key: "mapIsLoaded" }]);
  });
  it("getActive", () => {
    stores.actions.getActive(obj, {});
    expect(actionNames).toEqual([{ key: "getActive", payload: {} }]);
  });
  it("toggleDimension", () => {
    stores.actions.toggleDimension(obj, "name");
    expect(actionNames).toEqual([{ key: "toggleDimension", payload: "name" }]);
  });
  it("filterStores", () => {
    stores.actions.filterStores(obj);
    expect(actionNames).toEqual([{ key: "filterStores" }]);
  });
  it("updateKeyword", () => {
    stores.actions.updateKeyword(obj, "milan");
    expect(actionNames).toEqual([{ key: "updateKeyword", payload: "milan" }]);
  });
});

describe("Testing Mutations", () => {
  let state;
  let storeId;

  beforeEach(() => {
    state = {
      selectedId: "",
      pending: false,
      mapLoaded: false,
      filters: {},
      keyword: "",
      all: [
        {
          name: "ciao - prova prova",
          id: 2,
          path: ""
        }
      ]
    };
    storeId = 2;
    state.pristineActiveStores = state.all;
  });
  it("receiveAll", () => {
    const apiPendingState = { ...state, pending: true };
    stores.mutations.receiveAll(apiPendingState, [
      {
        name: "ciao - prova prova",
        id: 2,
        path: ""
      }
    ]);
    expect(apiPendingState).toEqual({
      ...apiPendingState,
      pending: false,
      all: [
        {
          name: "ciao - prova prova",
          id: 2,
          path: ""
        }
      ]
    });
  });
  it("apiPending", () => {
    stores.mutations.apiPending(state);
    expect(state).toEqual({ ...state, pending: true });
  });
  it("apiFailure", () => {
    stores.mutations.apiFailure(state);
    expect(state).toEqual({ ...state, pending: false, error: true });
  });
  it("selectStore", () => {
    stores.mutations.selectStore(state, storeId);
    expect(state).toEqual({
      ...state,
      selectedId: storeId,
      storeName: "ciao-provaprova",
      path: "/store-locator/ciao-provaprova-2"
    });
  });

  it("mapIsLoaded", () => {
    stores.mutations.mapIsLoaded(state);
    expect(state).toEqual({
      ...state,
      mapLoaded: true
    });
  });
  it("updateKeyword", () => {
    stores.mutations.updateKeyword(state, "milan");
    expect(state).toEqual({
      ...state,
      keyword: "milan"
    });
  });
  it("updateKeyword empty", () => {
    stores.mutations.updateKeyword(state, "");
    expect(state).toEqual({
      ...state,
      keyword: ""
    });
  });
  it("toggleDimension toggle ON", () => {
    const filter = {
      checked: true,
      value: "italy",
      name: "country"
    };
    stores.mutations.toggleDimension(state, filter);
    expect(state).toEqual({
      ...state,
      filters: {
        country: ["italy"]
      }
    });
  });
  it("toggleDimension toggle OFF", () => {
    const filter = {
      checked: true,
      value: "italy",
      name: "country"
    };
    stores.mutations.toggleDimension(state, filter);
    expect(state).toEqual({
      ...state,
      filters: {
        country: ["italy"]
      }
    });
    stores.mutations.toggleDimension(state, { ...filter, checked: false });
    expect(state).toEqual({
      ...state,
      filters: {
        country: []
      }
    });
  });

  it("getActive", () => {
    // test just pristine == all
    function map() {}
    const contains = () => ({ contains: () => true });
    map.prototype.getBounds = contains;
    stores.mutations.getActive(state, new map());
    expect(state.active).toEqual(state.pristineActiveStores);
  });
  it("getActive all false", () => {
    // test just pristine == all
    function map() {}
    const contains = () => ({ contains: () => false });
    map.prototype.getBounds = contains;
    stores.mutations.getActive(state, new map());
    expect(state.active).toEqual(state.pristineActiveStores);
  });

  it("filterStores", () => {
    stores.mutations.filterStores(state);
    expect(state.active).toEqual(state.pristineActiveStores);
  });
  // it("filterStores", () => {
  //   const newState = {
  //     ...state,
  //     filters: { name: "Yeijing - Yanlitun" },
  //     all: [
  //       ...Array(3).fill({
  //         ...storeMock
  //       }),
  //       ...Array(3).fill({
  //         ...storeMock,
  //         name: storeMock.name.replace(
  //           /[A-Z]/g,
  //           Math.random() > 0.5 ? "Y" : "Z"
  //         )
  //       })
  //     ]
  //   };
  //   state.pristineActiveStores = state.all;
  //   stores.mutations.filterStores({ ...newState });
  //   expect(newState.active).toEqual(undefined);
  // });
});
