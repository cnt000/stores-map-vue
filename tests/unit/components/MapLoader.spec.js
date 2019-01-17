import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
// import GoogleMapsApiLoader from "google-maps-api-loader";
import MapLoader from "@/components/MapLoader.vue";
import storesExamples from "../stores-examples.json";
import countriesExamples from "../countries-examples.json";
// import { mapConfig, apiKey } from "../../../src/conf";

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
      selectedCountryId: 0
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

  it("create maps div", () => {
    const wrapper = shallowMount(MapLoader, {
      store,
      localVue
    });
    expect(wrapper.find("div#map").html()).toMatch(
      '<div id="map" class="map"></div>'
    );
  });

  // it("has props apiKey and mapConfig object", () => {
  //   const wrapper = shallowMount(MapLoader, {
  //     propsData: {
  //       apiKey: apiKey,
  //       mapConfig: mapConfig
  //     },
  //     store,
  //     localVue
  //   });
  //   console.log(wrapper.html());
    
  //   expect(actions["stores/selectStore"]).toHaveBeenCalled();
  // });
});

/* 
GoogleMapsApiLoader, carica le mappe? e carica le initializeMap
initializeMap, fa mapIsLoaded?
mapIsLoaded, dispatcha?
panToSelectedStore: con lat e lon, fa panToAndZoom?
con storeAddress, fa geocoder.geocode?
selectCountry, con selectCountryId, fa panToAndZoom
se selectCountry != 0, fa geocode di countrySelected string?
panToAndZoom, fa panTo e zoom?
*/
