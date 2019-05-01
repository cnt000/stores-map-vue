import {
  prop,
  propOr,
  pathOr,
  map,
  pipe,
  split,
  join,
  toLower,
  toUpper,
  replace
} from "ramda";

export function decodeStores(rawStores) {
  const decoder = store => ({
    id: String(prop("ID", store)),
    name: titleCase(propOr("", "post_title", store)),
    address: propOr("", "wpcf-yoox-store-address", store),
    gender: propOr("", "wpcf-store-gender", store),
    lat: propOr("", "lat", store),
    lng: propOr("", "lng", store),
    phone: propOr("", "wpcf-yoox-store-phone", store),
    mail: propOr("", "wpcf-yoox-store-email", store),
    hours: propOr("", "wpcf-yoox-store-hours", store),
    countryIso: propOr("", "wpcf-yoox-store-country-iso", store),
    city: pathOr("", ["location", "city", "name"], store),
    country: pathOr("", ["location", "country", "name"], store),
    continent: pathOr("", ["location", "continent", "name"], store),
    visible: true
  });
  return map(decoder, rawStores);
}

export function titleCase(str) {
  const capitalize = replace(/^./, toUpper);
  const toTitleCase = pipe(
    toLower,
    split(" "),
    map(capitalize),
    join(" ")
  );
  return toTitleCase(str);
}

export function lowerStrings({
  name,
  address,
  gender,
  city,
  country,
  continent
}) {
  return `${name || ""} ${address || ""} ${gender || ""} ${city ||
    ""} ${country || ""} ${continent || ""}`.trim();
}
