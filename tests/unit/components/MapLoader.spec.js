import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import MapLoader from "@/components/MapLoader.vue";
import storesExamples from "../stores-examples.json";
import countriesExamples from "../countries-examples.json";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("MapLoader.vue", () => {
  let actions;
  let store;
  let testState;

  beforeEach(() => {
    actions = {};

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

  it("matches snapshot", () => {
    const wrapper = shallowMount(MapLoader, {
      store,
      localVue
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
