import { titleCase, decodeStores, lowerStrings } from "@/helpers";

const storeMock = {
  id: "1721",
  name: "Beijing - Sanlitun",
  address:
    "Sanlitun Village, Village North Shop N2 - 12/22 11 Sanlitun Road, Chaoyang District 100027",
  gender: "Womenswear | Menswear",
  lat: "39.938991808861964",
  lng: "116.45540810317993",
  phone: "008601064168189",
  mail: "",
  hours: "Monday to Sunday 10:00 - 22:00",
  countryIso: "CN",
  city: "Beijing",
  country: "China",
  continent: "Asia",
  visible: true
};

const storeMockLessProp = {
  id: "1721",
  name: "Beijing - Sanlitun"
};

const dataRaw = [
  {
    ID: 1721,
    post_title: "BEIJING - SANLITUN",
    terms: [
      {
        term_id: 164,
        name: "Asia",
        slug: "asia",
        term_group: 0,
        term_taxonomy_id: 164,
        taxonomy: "location",
        description: "",
        parent: 0,
        count: 326,
        filter: "raw"
      },
      {
        term_id: 178,
        name: "Beijing",
        slug: "beijing",
        term_group: 0,
        term_taxonomy_id: 178,
        taxonomy: "location",
        description: "",
        parent: 165,
        count: 18,
        filter: "raw"
      },
      {
        term_id: 165,
        name: "China",
        slug: "china",
        term_group: 0,
        term_taxonomy_id: 165,
        taxonomy: "location",
        description: "",
        parent: 164,
        count: 144,
        filter: "raw"
      }
    ],
    lat: "39.938991808861964",
    lng: "116.45540810317993",
    thumbnail: null,
    originalImage: false,
    custom: {
      "_yoox-store-source-id": ["19"],
      "_yoox-store-bookable": ["0"],
      "_yoox-store-lat": ["39.938991808861964"],
      "_yoox-store-lng": ["116.45540810317993"],
      _edit_lock: ["1532594892:3"],
      _edit_last: ["30"],
      "_wpcf-store-image-sort-order": ["a:1:{i:0;i:793215;}"],
      "_wpcf-yoox-store-email-sort-order": ["a:1:{i:0;i:793217;}"],
      "_yoox-store-gallery": ["builtin"],
      "wpcf-store-gender": ["Womenswear | Menswear"],
      "wpcf-store-image": [""],
      "wpcf-yoox-store-phone": ["008601064168189"],
      "wpcf-yoox-store-email": [""],
      "wpcf-yoox-store-hours": ["Monday to Sunday 10:00 - 22:00"],
      "wpcf-yoox-store-address": [
        "Sanlitun Village, Village North Shop N2 - 12/22 11 Sanlitun Road, Chaoyang District 100027"
      ],
      "wpcf-yoox-store-geolocation-address": ["Sanlitun Road 100027"],
      "wpcf-yoox-store-country-iso": ["CN"]
    },
    permalink: "https://www.ale.com/experience/en/store/beijing-sanlitun/",
    "wpcf-store-gender": "Womenswear | Menswear",
    "wpcf-store-image": "",
    "wpcf-yoox-store-phone": "008601064168189",
    "wpcf-yoox-store-email": "",
    "wpcf-yoox-store-hours": "Monday to Sunday 10:00 - 22:00",
    "wpcf-yoox-store-address":
      "Sanlitun Village, Village North Shop N2 - 12/22 11 Sanlitun Road, Chaoyang District 100027",
    "wpcf-yoox-store-geolocation-address": "Sanlitun Road 100027",
    "wpcf-yoox-store-country-iso": "CN",
    location: {
      continent: {
        term_id: 164,
        name: "Asia",
        slug: "asia",
        term_group: 0,
        term_taxonomy_id: 164,
        taxonomy: "location",
        description: "",
        parent: 0,
        count: 326,
        filter: "raw"
      },
      country: {
        term_id: 165,
        name: "China",
        slug: "china",
        term_group: 0,
        term_taxonomy_id: 165,
        taxonomy: "location",
        description: "",
        parent: 164,
        count: 144,
        filter: "raw"
      },
      city: {
        term_id: 178,
        name: "Beijing",
        slug: "beijing",
        term_group: 0,
        term_taxonomy_id: 178,
        taxonomy: "location",
        description: "",
        parent: 165,
        count: 18,
        filter: "raw"
      }
    },
    distance: false
  },
  {
    ID: 1739,
    post_title: "BEIJING - Shin Kong Place",
    terms: [
      {
        term_id: 164,
        name: "Asia",
        slug: "asia",
        term_group: 0,
        term_taxonomy_id: 164,
        taxonomy: "location",
        description: "",
        parent: 0,
        count: 326,
        filter: "raw"
      },
      {
        term_id: 178,
        name: "Beijing",
        slug: "beijing",
        term_group: 0,
        term_taxonomy_id: 178,
        taxonomy: "location",
        description: "",
        parent: 165,
        count: 18,
        filter: "raw"
      },
      {
        term_id: 165,
        name: "China",
        slug: "china",
        term_group: 0,
        term_taxonomy_id: 165,
        taxonomy: "location",
        description: "",
        parent: 164,
        count: 144,
        filter: "raw"
      }
    ],
    lat: "39.90990928039753",
    lng: "116.47876846672364",
    thumbnail: null,
    originalImage: false,
    custom: {
      "_yoox-store-source-id": ["37"],
      "_yoox-store-bookable": ["0"],
      _edit_lock: ["1532595398:3"],
      _edit_last: ["30"],
      "_wpcf-store-image-sort-order": ["a:1:{i:0;i:667161;}"],
      "_wpcf-yoox-store-email-sort-order": ["a:1:{i:0;i:667163;}"],
      "_yoox-store-lat": ["39.90990928039753"],
      "_yoox-store-lng": ["116.47876846672364"],
      "_yoox-store-gallery": ["builtin"],
      "wpcf-store-gender": ["Womenswear | Menswear"],
      "wpcf-store-image": [""],
      "wpcf-yoox-store-phone": [
        "Womenswear: +555 555 555 | Menswear: +555 555 555"
      ],
      "wpcf-yoox-store-email": ["shinkongplacertw.bj@cn.ale.com"],
      "wpcf-yoox-store-hours": ["Monday to Sunday 10:00 - 22:00"],
      "wpcf-yoox-store-address": [
        "Shop D1046, D4010, D4052-1 (WRTW), D2040 (Men’s)\r\nLevel 1\r\nShin Kong Place\r\nNo. 87 Jianguo Road, Chaoyang District\r\nChina 10025"
      ],
      "wpcf-yoox-store-country-iso": ["CN"]
    },
    permalink: "https://www.ale.com/experience/en/store/beijing-skp/",
    "wpcf-store-gender": "Womenswear | Menswear",
    "wpcf-store-image": "",
    "wpcf-yoox-store-phone":
      "Womenswear: +555 555 555 | Menswear: +555 555 555",
    "wpcf-yoox-store-email": "shinkongplacertw.bj@cn.ale.com",
    "wpcf-yoox-store-hours": "Monday to Sunday 10:00 - 22:00",
    "wpcf-yoox-store-address":
      "Shop D1046, D4010, D4052-1 (WRTW), D2040 (Men’s)\r\nLevel 1\r\nShin Kong Place\r\nNo. 87 Jianguo Road, Chaoyang District\r\nChina 10025",
    "wpcf-yoox-store-country-iso": "CN",
    location: {
      continent: {
        term_id: 164,
        name: "Asia",
        slug: "asia",
        term_group: 0,
        term_taxonomy_id: 164,
        taxonomy: "location",
        description: "",
        parent: 0,
        count: 326,
        filter: "raw"
      },
      country: {
        term_id: 165,
        name: "China",
        slug: "china",
        term_group: 0,
        term_taxonomy_id: 165,
        taxonomy: "location",
        description: "",
        parent: 164,
        count: 144,
        filter: "raw"
      },
      city: {
        term_id: 178,
        name: "Beijing",
        slug: "beijing",
        term_group: 0,
        term_taxonomy_id: 178,
        taxonomy: "location",
        description: "",
        parent: 165,
        count: 18,
        filter: "raw"
      }
    },
    distance: false
  }
];

describe("Helpers work", () => {
  it("decodeStores works", () => {
    const decoded = decodeStores(dataRaw);
    const result = [
      {
        id: "1721",
        name: "Beijing - Sanlitun",
        address:
          "Sanlitun Village, Village North Shop N2 - 12/22 11 Sanlitun Road, Chaoyang District 100027",
        gender: "Womenswear | Menswear",
        lat: "39.938991808861964",
        lng: "116.45540810317993",
        phone: "008601064168189",
        mail: "",
        hours: "Monday to Sunday 10:00 - 22:00",
        countryIso: "CN",
        city: "Beijing",
        country: "China",
        continent: "Asia",
        visible: true
      },
      {
        id: "1739",
        name: "Beijing - Shin Kong Place",
        address:
          "Shop D1046, D4010, D4052-1 (WRTW), D2040 (Men’s)\r\nLevel 1\r\nShin Kong Place\r\nNo. 87 Jianguo Road, Chaoyang District\r\nChina 10025",
        gender: "Womenswear | Menswear",
        lat: "39.90990928039753",
        lng: "116.47876846672364",
        phone: "Womenswear: +555 555 555 | Menswear: +555 555 555",
        mail: "shinkongplacertw.bj@cn.ale.com",
        hours: "Monday to Sunday 10:00 - 22:00",
        countryIso: "CN",
        city: "Beijing",
        country: "China",
        continent: "Asia",
        visible: true
      }
    ];
    expect(result).toEqual(decoded);
  });

  it("titleCase works from lowercase", () => {
    const title = "hello store locator";
    const titleCased = titleCase(title);
    expect("Hello Store Locator").toBe(titleCased);
  });

  it("titleCase works from uppercase", () => {
    const title = "HELLO STORE LOCATOR";
    const titleCased = titleCase(title);
    expect("Hello Store Locator").toBe(titleCased);
  });

  it("lowerStrings works", () => {
    const searchStringMock =
      "Beijing - Sanlitun Sanlitun Village, Village North Shop N2 - 12/22 11 Sanlitun Road, Chaoyang District 100027 Womenswear | Menswear Beijing China Asia";
    const lowerString = lowerStrings(storeMock);
    expect(searchStringMock).toBe(lowerString);
  });

  it("lowerStrings works less prop", () => {
    const searchStringMock = "Beijing - Sanlitun";
    const lowerString = lowerStrings(storeMockLessProp);
    expect(searchStringMock).toBe(lowerString);
  });

  it("lowerStrings works with empty", () => {
    const searchStringMock = "";
    const lowerString = lowerStrings({});
    expect(searchStringMock).toBe(lowerString);
  });
});
