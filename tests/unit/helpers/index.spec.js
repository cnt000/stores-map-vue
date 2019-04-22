import { titleCase } from "@/helpers";

describe("Helpers work", () => {
  it("titleCase works", () => {
    const title = "hello store locator";
    const titleCased = titleCase(title);
    expect("Hello Store Locator").toBe(titleCased);
  });
});
