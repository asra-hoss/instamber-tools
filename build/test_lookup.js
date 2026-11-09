/* Self-test for lookup.js / areacode.js — run: node build/test_lookup.js */
"use strict";
const fs = require("fs");
const path = require("path");
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data.json"), "utf8"));

// Serve data.json to the engine's fetch() from disk.
global.fetch = async () => ({ ok: true, json: async () => DATA });

const L = require("../lookup.js");
const A = require("../areacode.js");

function findPrefix(pred) {
  for (const npa of Object.keys(DATA.prefixes).sort()) {
    for (const nxx of Object.keys(DATA.prefixes[npa]).sort()) {
      const c = DATA.carriers[DATA.prefixes[npa][nxx][0]];
      if (pred(c)) return { num: npa + nxx + "0142", legal: c[1] };
    }
  }
  throw new Error("prefix not found");
}

function show(title, r) {
  console.log("\n### " + title);
  console.log(JSON.stringify(r, null, 1).slice(0, 900));
}

(async () => {
  const bw = findPrefix((c) => c[1].includes("BANDWIDTH.COM"));
  console.log("Bandwidth test prefix from:", bw.legal);
  show("App number via Bandwidth (TextNow / Google Voice supplier)", await L.lookup(bw.num));

  const onvoy = findPrefix((c) => c[1].includes("ONVOY"));
  console.log("Onvoy test prefix from:", onvoy.legal);
  show("App number via Onvoy (TextFree / TextNow / Google Voice supplier)", await L.lookup(onvoy.num));

  show("Major wireless block — Verizon Wireless, Anchorage AK (907-201)", await L.lookup("9072010142"));

  const bell = findPrefix((c) => c[1].includes("SOUTHWESTERN BELL"));
  console.log("Landline test prefix from:", bell.legal);
  show("Landline block — Southwestern Bell (AT&T)", await L.lookup(bell.num));

  const caMob = findPrefix((c) => c[1] === "Bell Mobility");
  console.log("CA mobile test prefix from:", caMob.legal);
  show("Canada mobile block — Bell Mobility", await L.lookup(caMob.num));

  const iris = findPrefix((c) => c[1].includes("Iristel"));
  console.log("CA VoIP test prefix from:", iris.legal);
  show("Canada app/VoIP block — Iristel (TextNow Canada supplier)", await L.lookup(iris.num));

  show("Toll-free (800-555-0142, fictional-range test number)", await L.lookup("8005550142"));
  show("Invalid input (123-456-7890)", await L.lookup("123-456-7890"));
  show("Valid format but unassigned (999-999-9999)", await L.lookup("9999999999"));

  console.log("\n### Area code 416:", JSON.stringify(A.lookup("416")));
  console.log("### Area code 907:", JSON.stringify(A.lookup("907")));
  console.log("### Area code 800:", JSON.stringify(A.lookup("800")));
  console.log("### Area code 514:", JSON.stringify(A.lookup("514")));
})();
