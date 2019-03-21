import * as R from "ramda";

export const termsToCountries = terms =>
  terms
    .map(term => term)
    .reduce(
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

// li potrei prendere con ramda tutti in uo
export function decodeStores(rawStores) {
  return rawStores.map(store => ({
    id: String(R.prop("ID", store)),
    name: titleCase(store.post_title.toLowerCase()) || "",
    address: R.propOr("", "wpcf-yoox-store-address", store),
    gender: R.propOr("", "wpcf-store-gender", store),
    lat: R.propOr("", "lat", store),
    lng: R.propOr("", "lng", store),
    phone: R.propOr("", "wpcf-yoox-store-phone", store),
    mail: R.propOr("", "wpcf-yoox-store-email", store),
    hours: R.propOr("", "wpcf-yoox-store-hours", store),
    countryIso: R.propOr("", "wpcf-yoox-store-country-iso", store),
    city: R.pathOr("", ["location", "city", "name"], store),
    country: R.pathOr("", ["location", "country", "name"], store),
    continent: R.pathOr("", ["location", "continent", "name"], store),
    visible: true
  }));
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
