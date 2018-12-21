import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import StoresList from "@/components/StoresList.vue";
import storesExamples from "../stores-examples.json";
import countriesExamples from "../countries-examples.json";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("StoresList.vue", () => {
  let actions;
  let state;
  let store;
  let testState;

  beforeEach(() => {
    state = {
      stores: storesExamples,
      pending: false,
      error: false,
      countries: [{ term_id: 0, name: "Italy" }],
      selectedCountryTermId: 0
    };

    actions = {
      "stores/selectStore": jest.fn(),
      "stores/getCountries": jest.fn(),
      "stores/selectCountryTermId": jest.fn()
    };

    testState = {
      all: storesExamples,
      pending: false,
      error: false,
      selectedStoreId: 0,
      countries: countriesExamples,
      selectedCountryTermId: 0
    };

    store = new Vuex.Store({
      modules: {
        stores: {
          state: testState,
          actions
        }
      }
    });
  });

  it("renders list item ABU DHABI - SOWWAH - I element", () => {
    const msg = "ABU DHABI - SOWWAH";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    expect(wrapper.find("li:first-child > span").text()).toMatch(msg);
  });

  it("renders list item BAKU - PORT BAKU - II element", () => {
    const msg = "BAKU - PORT BAKU";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    expect(wrapper.find("li:nth-child(2) > span").text()).toMatch(msg);
  });

  it("renders countries select with All", () => {
    const msg = "All";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    expect(wrapper.find("select option").text()).toMatch(msg);
  });

  it("renders countries select with America second option", () => {
    const msg = "China";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    expect(wrapper.find("select option:nth-child(2)").text()).toMatch(msg);
  });

  it("renders one store searching for BAKU - PORT BAKU", () => {
    const msg = "BAKU - PORT BAKU";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    wrapper.find(".stores_search").element.value = msg;
    wrapper.find(".stores_search").trigger("input");
    expect(wrapper.find("li:first-child > span").text()).toMatch(msg);
  });

  it("renders any store searching for AAA", () => {
    const msg = "";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    wrapper.find(".stores_search").element.value = msg;
    wrapper.find(".stores_search").trigger("input");
    expect(wrapper.find("li:first-child > span").text()).toMatch(msg);
  });

  it('calls store action "selectStore" when list item is clicked', () => {
    const wrapper = shallowMount(StoresList, { store, localVue });
    const listItem = wrapper.find("li:first-child > span");
    listItem.trigger("click");
    expect(actions["stores/selectStore"]).toHaveBeenCalled();
  });

  it('calls store action "selectCountryTermId" when list item is clicked', () => {
    const wrapper = shallowMount(StoresList, { store, localVue });
    const selectCountry = wrapper.find("select");
    selectCountry.trigger("change", 0);
    expect(actions["stores/selectCountryTermId"]).toHaveBeenCalled();
  });

  it('calls store action "getCountries" when is created', () => {
    shallowMount(StoresList, { store, localVue });
    expect(actions["stores/getCountries"]).toHaveBeenCalled();
  });
});
