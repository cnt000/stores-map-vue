import stores from "@/store/modules/stores";
import { termsToCountries } from "@/helpers";
import places from "#/alessandrore";
import termsJson from "#/terms";

describe("Testing Getters", () => {
  const state = {
    all: [{ ID: 1 }, { ID: 3 }, { ID: 5 }],
    selectedStoreId: "3",
    selectedCountryId: 6,
    countries: [{ term_id: 2 }, { term_id: 6 }, { term_id: 8 }]
  };
  it("getSelectedStore", () => {
    expect(stores.getters.getSelectedStore(state)).toEqual({ ID: 3 });
  });
  it("getSelectedCountry", () => {
    expect(stores.getters.getSelectedCountry(state)).toEqual({ term_id: 6 });
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

  it("getCountries", () => {
    stores.actions.getCountries(obj);
    expect(actionNames).toEqual([
      { key: "apiPending" },
      { key: "receiveCountries", payload: termsJson }
    ]);
  });
  it("getAllStores", () => {
    stores.actions.getAllStores(obj);
    expect(actionNames).toEqual([
      { key: "apiPending" },
      { key: "receiveAll", payload: places }
    ]);
  });
  it("selectStore", () => {
    stores.actions.selectStore(obj, payload);
    expect(actionNames).toEqual([{ key: "selectStore", payload: 1 }]);
  });
  it("selectCountryId", () => {
    stores.actions.selectCountryId(obj, payload);
    expect(actionNames).toEqual([{ key: "selectCountryId", payload: 1 }]);
  });
});

describe("Testing Mutations", () => {
  let state;
  let term_id;
  let storeId;

  beforeEach(() => {
    state = {
      selectedCountryId: 0,
      selectedStoreId: "",
      pending: false,
      all: [
        {
          name: "ciao - prova prova",
          ID: 2,
          path: ""
        }
      ]
    };
    term_id = 1;
    storeId = 2;
  });
  it("selectCountryId", () => {
    stores.mutations.selectCountryId(state, term_id);
    expect(state).toEqual({ ...state, selectedCountryId: 1 });
  });
  it("receiveCountries", () => {
    const apiPendingState = { ...state, pending: true };
    stores.mutations.receiveCountries(apiPendingState, termsJson);
    expect(apiPendingState).toEqual({
      ...apiPendingState,
      pending: false,
      countries: termsToCountries(termsJson.terms).countries
    });
  });
  it("receiveAll", () => {
    const apiPendingState = { ...state, pending: true };
    stores.mutations.receiveAll(apiPendingState, places);
    expect(apiPendingState).toEqual({
      ...apiPendingState,
      pending: false,
      all: places
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
      selectedStoreId: storeId,
      storeName: "ciao-provaprova",
      path: "/store-locator/ciao-provaprova-2"
    });
  });
});
