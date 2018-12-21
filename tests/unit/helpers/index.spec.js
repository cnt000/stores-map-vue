import { termsToCountries } from "@/helpers";
import countriesExample from "../countries-examples";

describe("Terms filter correctly countries", () => {
  it("Filter countries with test data", () => {
    const countriesTerms = termsToCountries(countriesExample);
    expect(countriesTerms.countries.length).toBeGreaterThanOrEqual(3);
  });
});
