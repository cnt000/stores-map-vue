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
      "stores/filterByKeyword": jest.fn()
    };

    testState = {
      all: storesExamples,
      active: storesExamples,
      path: "/stores-map-vue/store-locator",
      selectedId: "",
      pending: false,
      error: false,
      mapLoaded: false,
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

  it("renders one store searching for BAKU - PORT BAKU", () => {
    const msg = "ABU DHABI - SOWWAH";
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

  it("matches snapshot", () => {
    const wrapper = shallowMount(StoresList, { store, localVue });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
