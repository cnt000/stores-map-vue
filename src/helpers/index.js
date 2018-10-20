export const terms = terms =>
  terms.map(term => term).reduce(
    (acc, cur) => {
      if (cur.parent === 0) {
        acc.continents.push(cur.term_id);
      }
      if (acc.continents.indexOf(cur.parent) > -1) {
        acc.countries.push({ cur });
      }
      return acc;
    },
    { continents: [], countries: [] }
  );
