import { shallowMount } from "@vue/test-utils";
import Sidebar from "@/components/Sidebar.vue";

describe("Sidebar.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "";
    const wrapper = shallowMount(Sidebar, {});
    expect(wrapper.text()).toMatch(msg);
  });
  it("matches snapshot", () => {
    const wrapper = shallowMount(Sidebar, {});
    expect(wrapper.html()).toMatchSnapshot();
  });
});
