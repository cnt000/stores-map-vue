import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Sidebar from "@/components/Sidebar.vue";
import StoresList from "@/components/StoresList.vue";
import storesExamples from "./stores-examples.json";

describe("Sidebar.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "";
    const wrapper = shallowMount(Sidebar, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});

const localVue = createLocalVue();
localVue.use(Vuex);

describe("StoresList.vue", () => {
  let actions;
  let state;
  let store;

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

    store = new Vuex.Store({
      modules: {
        stores: {
          state: {
            all: storesExamples,
            pending: false,
            error: false,
            selectedStoreId: 0,
            countries: [],
            selectedCountryTermId: 0
          },
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
