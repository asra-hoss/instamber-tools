/*!
 * InstamberLookup — free NANP carrier / line-type / area-code lookup engine.
 *
 * Data: public numbering records published by NANPA (US central office code
 * assignments + NPA report) and the Canadian Numbering Administrator (CO code
 * status). The dataset is static JSON hosted with this file, so lookups run
 * entirely in the visitor's browser: no API key, no per-lookup cost, no cap.
 *
 * What it can and cannot say: it reports the carrier a number block was
 * ASSIGNED to and the rate centre the block belongs to. If a number was
 * ported to another carrier, the current carrier may differ. It never
 * identifies a number's owner — no public record can.
 *
 * Usage:
 *   <script src="https://asra-hoss.github.io/instamber-tools/lookup.js"></script>
 *   <script>
 *     InstamberLookup.lookup("907-201-0142").then(function (r) { console.log(r); });
 *     var ac = InstamberLookup.lookupAreaCode("416"); // synchronous
 *   </script>
 * Set window.INSTAMBER_DATA_URL before loading to point at a different data.json.
 */
(function (global) {
  "use strict";

  var AREAS = /*__AREAS__*/;
  var FAMILIES = /*__FAMILIES__*/;

  var DATA_URL =
    global.INSTAMBER_DATA_URL ||
    "https://asra-hoss.github.io/instamber-tools/data.json";

  var TYPE_LABELS = {
    m: "Mobile",
    l: "Landline",
    v: "VoIP",
    u: "Unknown",
    tollfree: "Toll-free",
    premium: "Premium rate",
  };

  var PORTED_NOTE =
    "Carrier is the company this number block was assigned to in NANPA / CNA numbering records. " +
    "If the number has been ported to a different carrier, its current carrier may be different. " +
    "The region is the rate centre the block belongs to — it describes the number, not where the person using it is located.";

  var _dataPromise = null;
  function loadData() {
    if (!_dataPromise) {
      _dataPromise = fetch(DATA_URL).then(function (r) {
        if (!r.ok) throw new Error("InstamberLookup: data.json load failed (" + r.status + ")");
        return r.json();
      });
    }
    return _dataPromise;
  }

  function cleanDigits(raw) {
    var d = String(raw == null ? "" : raw).replace(/\D+/g, "");
    if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1);
    return d;
  }

  function areaOf(npa) {
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
    };
  }

  function lookupAreaCode(npa) {
    npa = String(npa == null ? "" : npa).replace(/\D+/g, "").slice(-3);
    if (!/^[2-9]\d\d$/.test(npa)) return null;
    return areaOf(npa);
  }

  function baseResult(digits) {
    var npa = digits.slice(0, 3), nxx = digits.slice(3, 6), line = digits.slice(6);
    return {
      valid: true,
      digits: digits,
      formatted: "(" + npa + ") " + nxx + "-" + line,
      npa: npa,
      nxx: nxx,
      line: line,
      prefix: npa + nxx,
      carrier: null,
      carrierLegal: null,
      lineType: "unknown",
      lineTypeLabel: TYPE_LABELS.u,
      region: null,
      areaCode: areaOf(npa),
      isAppNumber: false,
      appFamily: null,
      apps: [],
      pooled: false,
      note: PORTED_NOTE,
      source: "NANPA / CNA public numbering records (see data.json for file dates)",
    };
  }

  function lookup(raw) {
    var digits = cleanDigits(raw);
    if (!/^[2-9]\d{9}$/.test(digits) || !/^[2-9]/.test(digits.slice(3, 4))) {
      return Promise.resolve({
        valid: false,
        error:
          "Enter a valid 10-digit US or Canadian number (area code + 7 digits).",
      });
    }
    var res = baseResult(digits);
    var area = res.areaCode;

    // Service codes are answered from the NPA record alone.
    if (area && area.service === "Toll-Free") {
      res.lineType = "tollfree";
      res.lineTypeLabel = TYPE_LABELS.tollfree;
      res.note =
        "Toll-free numbers (800, 888, 877, 866, 855, 844, 833) are not tied to a place, and each number's " +
        "carrier is chosen by its owner through a RespOrg — it is not published in numbering records, so no " +
        "public lookup can name the carrier of an individual toll-free number.";
      return Promise.resolve(res);
    }
    if (area && area.service === "Premium Services") {
      res.lineType = "premium";
      res.lineTypeLabel = TYPE_LABELS.premium;
      res.note = "900 numbers are premium-rate services billed to the caller. " + PORTED_NOTE;
      return Promise.resolve(res);
    }

    return loadData().then(function (data) {
      var byNpa = data.prefixes[res.npa];
      var hit = byNpa && byNpa[res.nxx];
      if (!hit) {
        res.note =
          "This prefix is not listed as assigned in the current NANPA / CNA records — the number may be " +
          "unassigned, very new, or in a block these public files do not cover (for example a Caribbean NANP " +
          "prefix, which NANPA and the CNA do not publish at prefix level). " + PORTED_NOTE;
        return res;
      }
      var c = data.carriers[hit[0]];
      res.carrier = c[0];
      res.carrierLegal = c[1];
      var typeChar = c[2];
      res.lineType =
        typeChar === "m" ? "mobile" : typeChar === "v" ? "voip" : typeChar === "l" ? "landline" : "unknown";
      res.lineTypeLabel = TYPE_LABELS[typeChar] || TYPE_LABELS.u;
      res.pooled = c[1].indexOf("MULTIPLE OCN LISTING") === 0;
      if (res.pooled) {
        res.carrier = "Multiple carriers (pooled block)";
        res.note =
          "This prefix is a pooled thousands-block shared by several carriers, so numbering records do not " +
          "name a single carrier for the whole block. " + PORTED_NOTE;
      }
      var rcName = data.rc[hit[2]];
      res.region = {
        city: rcName || (area && area.primaryCity) || "",
        state: area ? area.state : "",
        country: area ? area.country : "",
        rateCenter: rcName || "",
      };
      var famKey = c[3];
      if (famKey && FAMILIES[famKey]) {
        res.isAppNumber = true;
        res.appFamily = FAMILIES[famKey].label;
        res.apps = FAMILIES[famKey].apps.slice();
      }
      if (res.nxx === "555") {
        res.note =
          "555 numbers are directory-assistance / reserved numbers; 555-0100–0199 are the fictional range used in films and examples. " +
          res.note;
      }
      return res;
    });
  }

  var api = {
    version: "1.0.0",
    lookup: lookup,
    lookupNumber: lookup,
    lookupAreaCode: lookupAreaCode,
    ready: loadData,
  };

  global.InstamberLookup = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
