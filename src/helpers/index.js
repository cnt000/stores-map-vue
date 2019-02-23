export const termsToCountries = terms =>
  terms.map(term => term).reduce(
    (acc, cur) => {
      if (cur.parent === 0) {
        acc.continents.push(cur.term_id);
      }
      if (acc.continents.indexOf(cur.parent) > -1) {
        acc.countries.push(cur);
      }
      return acc;
    },
    { continents: [], countries: [] }
  );

export function decodeStores(rawStores) {
  return rawStores.map(store => ({
    id: String(store.ID) || "",
    name: store.post_title || "",
    address: store["wpcf-yoox-store-address"] || "",
    gender: store["wpcf-store-gender"] || "",
    lat: store.lat || "",
    lng: store.lng || "",
    phone: store["wpcf-yoox-store-phone"] || "",
    mail: store["wpcf-yoox-store-email"] || "",
    hours: store["wpcf-yoox-store-hours"] || "",
    countryIso: store["wpcf-yoox-store-country-iso"] || "",
    locations: store.location,
    visible: true
  }));
}
