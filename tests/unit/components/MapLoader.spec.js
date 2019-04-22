import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import MapLoader from "@/components/MapLoader.vue";
import storesExamples from "../stores-examples.json";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("MapLoader.vue", () => {
  let actions;
  let store;
  let testState;

  beforeEach(() => {
    actions = {
      "stores/selectStore": jest.fn(),
    };

    testState = {
      all: storesExamples,
      pending: false,
      error: false,
      selectedStoreId: "1934",
      mapLoaded: true
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
    const wrapper = mount(MapLoader, {
      store,
      localVue
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("create maps div", () => {
    const wrapper = shallowMount(MapLoader, {
      store,
      localVue
    });
    expect(wrapper.find("div#map").html()).toMatch(
      '<div id="map" class="map"></div>'
    );
  });

  it("has props apiKey and mapConfig object", () => {
    const mapConfigMock = { a: 1, b: 3 };
    const wrapper = mount(MapLoader, {
      propsData: {
        apiKey: "GAPIkey",
        mapConfig: mapConfigMock
      },
      store,
      localVue
    });
    expect(wrapper.props().apiKey).toBe("GAPIkey");
    wrapper.setProps({ apiKey: "newApiKey" });
    expect(wrapper.props().apiKey).toBe("newApiKey");
    wrapper.setProps({ mapConfig: { a: 1 } });
    expect(wrapper.props().mapConfig).toEqual({ a: 1 });
  });

  it("initial values for store state", () => {
    const wrapper = mount(MapLoader, { store, localVue });
    expect(wrapper.vm.store).toBe("1934");
    expect(wrapper.vm.mapLoaded).toBe(true);
    // console.log(wrapper.vm.$watch("store"));
  });
  // it("mount and call GoogleMapsApiLoader", () => {
  //   const wrapper = mount(MapLoader, {
  //     store,
  //     localVue
  //   });
  //   const geocode = jest.fn();
  //   wrapper.vm.geocode("italy");
  //   expect(geocode).toHaveBeenCalled();
  // });
});
