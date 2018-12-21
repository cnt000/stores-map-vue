import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ChildMarker from "@/components/ChildMarker.vue";
import storesExamples from "../stores-examples";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ChildMarker.vue", () => {
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
      "stores/selectCountryTermId": jest.fn()
    };

    testState = {
      all: storesExamples,
      pending: false,
      error: false,
      selectedStoreId: 1,
      countries: [],
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

  const map = {};
  const google = {
    maps: {
      Marker: jest.fn(),
      InfoWindow: jest.fn()
    }
  };
  google.maps.Marker.prototype.addListener = jest.fn();

  it("renders a marker", () => {
    const msg = "";
    const wrapper = shallowMount(ChildMarker, {
      store,
      localVue,
      propsData: {
        position: {
          lat: 51,
          lng: 0,
          markerName: "NEGOZIO 1",
          storeId: 0
        },
        google,
        map
      }
    });
    // wrapper.find("div").trigger("click");
    // console.log(wrapper.html());
    expect(wrapper.find("div").text()).toMatch(msg);
  });

  // it("renders infowindow with marker name", () => {
  //   const msg = "NEGOZIO 1";
  //   const wrapper = shallowMount(ChildMarker, {
  //     store,
  //     localVue,
  //     propsData: {
  //       position: {
  //         lat: 51,
  //         lng: 0,
  //         markerName: "NEGOZIO 1",
  //         storeId: 1
  //       },
  //       google,
  //       map
  //     }
  //   });
  //   // console.log(store._mutations);
  //   // store.mutations.selectStore(state, 1);
  //   // wrapper.find("div").trigger("click");
  //   console.log(wrapper.html());
  //   expect(wrapper.find("div").text()).toMatch(msg);
  // });
  it("matches snapshot", () => {
    const wrapper = shallowMount(ChildMarker, {
      store,
      localVue,
      propsData: {
        position: {
          lat: 51,
          lng: 0,
          markerName: "NEGOZIO 1",
          storeId: 0
        },
        google,
        map
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
