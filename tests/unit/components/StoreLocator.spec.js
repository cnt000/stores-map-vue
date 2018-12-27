import { shallowMount } from "@vue/test-utils";
import StoreLocator from "@/components/Sidebar.vue";

describe("StoreLocator.vue", () => {
  it("matches snapshot", () => {
    const wrapper = shallowMount(StoreLocator, {});
    expect(wrapper.html()).toMatchSnapshot();
  });
});
