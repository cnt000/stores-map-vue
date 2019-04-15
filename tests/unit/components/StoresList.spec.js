import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import StoresList from "@/components/StoresList.vue";
import storesExamples from "../stores-examples.json";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("StoresList.vue", () => {
  let actions;
  let store;
  let testState;

  beforeEach(() => {
    actions = {
      "stores/selectStore": jest.fn(),
      "stores/getCountries": jest.fn(),
      "stores/selectCountryId": jest.fn()
    };

    testState = {
      all: storesExamples,
      active: storesExamples,
      filtered: storesExamples,
      path: "/stores-map-vue/store-locator",
      selectedStoreId: "",
      pending: false,
      error: false,
      mapLoaded: false,
      selectedCountryId: 0,
      countries: [],
      filters: []
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
    expect(wrapper.find("li:first-child > div").text()).toMatch(msg);
  });

  it("renders list item BAKU - PORT BAKU - II element", () => {
    const msg = "BAKU - PORT BAKU";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    expect(wrapper.find("li:nth-child(2) > div").text()).toMatch(msg);
  });

  // it("renders countries select with All", () => {
  //   const msg = "All";
  //   const wrapper = shallowMount(StoresList, {
  //     store,
  //     localVue
  //   });
  //   expect(wrapper.find("select option").text()).toMatch(msg);
  // });

  // it("renders countries select with China second option", () => {
  //   const msg = "Asia"; // not important if country or continents in this test
  //   const wrapper = shallowMount(StoresList, {
  //     store,
  //     localVue
  //   });
  //   expect(wrapper.find("select option:nth-child(2)").text()).toMatch(msg);
  // });

  it("renders one store searching for BAKU - PORT BAKU", () => {
    const msg = "BAKU - PORT BAKU";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    wrapper.find(".stores_search").element.value = msg;
    wrapper.find(".stores_search").trigger("input");
    expect(wrapper.find("li:first-child > div").text()).toMatch(msg);
  });

  it("renders any store searching for AAA", () => {
    const msg = "";
    const wrapper = shallowMount(StoresList, {
      store,
      localVue
    });
    wrapper.find(".stores_search").element.value = msg;
    wrapper.find(".stores_search").trigger("input");
    expect(wrapper.find("li:first-child > div").text()).toMatch(msg);
  });

  it('calls store action "selectStore" when list item is clicked', () => {
    const wrapper = shallowMount(StoresList, { store, localVue });
    const listItem = wrapper.find("li:first-child > div");
    listItem.trigger("click");
    expect(actions["stores/selectStore"]).toHaveBeenCalled();
  });

  // it('calls store action "selectCountryId" when select change', () => {
  //   const wrapper = shallowMount(StoresList, { store, localVue });
  //   const selectCountry = wrapper.find("select");
  //   selectCountry.trigger("change", 0);
  //   expect(actions["stores/selectCountryId"]).toHaveBeenCalled();
  // });

  it('calls store action "getCountries" when is created', () => {
    shallowMount(StoresList, { store, localVue });
    expect(actions["stores/getCountries"]).toHaveBeenCalled();
  });
  it("matches snapshot", () => {
    const wrapper = shallowMount(StoresList, { store, localVue });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
