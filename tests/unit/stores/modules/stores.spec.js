import stores from "../../../../src/store/modules/stores";
import places from "../../../../data/alexandermcqueen";
import termsJson from "../../../../data/terms";
import { termsToCountries } from "../../../../src/helpers";

describe("Testing Getters", () => {
  const state = {
    all: [{ ID: 1 }],
    selectedStoreId: 1,
    selectedCountryId: 2,
    countries: [{ term_id: 2 }]
  };
  it("getSelectedStore", () => {
    expect(stores.getters.getSelectedStore(state)).toEqual({ ID: 1 });
  });
  it("getSelectedCountry", () => {
    expect(stores.getters.getSelectedCountry(state)).toEqual({ term_id: 2 });
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
      selectedStoreId: 0,
      pending: false
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
    expect(state).toEqual({ ...state, selectedStoreId: storeId });
  });
});
