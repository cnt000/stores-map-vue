import { shallowMount } from "@vue/test-utils";
import Sidebar from "@/components/Sidebar.vue";

describe("Sidebar.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "test";
    const wrapper = shallowMount(Sidebar, {
      propsData: {
        msg
      },
      slots: {
        default: "<div>test</div>"
      }
    });
    expect(wrapper.find("div").text()).toMatch(msg);
  });
  it("matches snapshot", () => {
    const wrapper = shallowMount(Sidebar, {});
    expect(wrapper.html()).toMatchSnapshot();
  });
});
