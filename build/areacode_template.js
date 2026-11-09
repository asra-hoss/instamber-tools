/*!
 * InstamberAreaCode — standalone area-code lookup (no network fetch).
 * Data: NANPA NPA report (public). The "primaryCity" is the rate centre with
 * the most assigned prefixes in that area code — a representative city, since
 * an area code can cover many towns.
 *
 *   <script src="https://asra-hoss.github.io/instamber-tools/areacode.js"></script>
 *   <script>var info = InstamberAreaCode.lookup("416");</script>
 */
(function (global) {
  "use strict";
  var AREAS = /*__AREAS__*/;
  function lookup(npa) {
    npa = String(npa == null ? "" : npa).replace(/\D+/g, "").slice(-3);
    if (!/^[2-9]\d\d$/.test(npa)) return null;
    var a = AREAS[npa];
    if (!a) return null;
    return {
      npa: npa,
      state: a.state || "",
      country: a.country || "",
      timezone: a.tz || "",
      timezoneIana: a.tzIana || "",
      primaryCity: a.city || "",
      service: a.service || "",
      isTollFree: a.service === "Toll-Free",
    };
  }
  var api = { version: "1.0.0", lookup: lookup, lookupAreaCode: lookup };
  global.InstamberAreaCode = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
