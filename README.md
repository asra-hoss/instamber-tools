# instamber-tools

Free, unlimited lookup engine behind the sibling tools of
[instamber.com](https://instamber.com/) — Carrier Lookup, VoIP Number Checker,
Google Voice Number Lookup, Text App Number Checker and Area Code Lookup.

It replaces per-lookup APIs (the site's original TextNow tool runs on
Numverify's free tier, capped at 100 lookups/month) with a **static dataset
built from official public numbering records**. Lookups run entirely in the
visitor's browser: no API key, no per-lookup cost, no monthly cap.

## Files

| File | What it is |
|---|---|
| `lookup.js` | The engine. `InstamberLookup.lookup(number)` (Promise) and `InstamberLookup.lookupAreaCode(npa)` (sync). Area-code data is embedded; prefix data is fetched once from `data.json`. |
| `areacode.js` | Standalone area-code-only engine (embedded data, no fetch) for the Area Code Lookup page. |
| `data.json` | Prefix dataset: 227,598 NPA-NXX assignments (US + Canada), 2,858 carriers, 14,668 rate centres. ~5.2 MB raw, ~1.1 MB gzipped (GitHub Pages serves it compressed). |
| `index.html` | Working demo of all five tools (noindex; the live tools live on instamber.com). |
| `SEO-PACKAGE.md` | Per-tool SEO titles/meta, JSON-LD and content outlines for the WordPress pages. |
| `build/` | `build_data.py` regenerates everything from the source files; `SOURCES.md` lists the downloads; `test_lookup.js` is the node self-test. |

## Data sources (all official, all free)

* **NANPA** — Central Office Code Assignment report, "utilized, all states"
  (US NPA-NXX → company/OCN/rate centre), file updated **2026-11-09**.
  198,804 assigned prefixes kept.
* **Canadian Numbering Administrator (CNA/CNAC)** — CO Code Status, all NPAs
  (Canada NPA-NXX → company/exchange area/province), exported **2026-11-08**.
  28,794 prefixes with status *In Service* or *Assigned* kept.
* **NANPA** — NPA report (area code → state/province/country, time zone,
  service type), file dated **2026-11-09**. 486 area codes in service.

NANPA and the CNA publish these files as public records for the industry and
the public; the data is republished here with attribution for a free public
lookup tool. Neither file carries an open-data licence statement — if you
reuse this dataset elsewhere, keep the attribution and check the publishers'
terms.

## Coverage — and its limits (read before trusting a result)

* **Prefix-level coverage: United States + Canada.** The NANPA file also
  carries Puerto Rico, Guam, USVI and American Samoa (US-administered).
* **Area-code-level coverage: the whole NANP** (486 in-service codes,
  including the Caribbean countries) — but NANPA/CNA do not publish
  prefix-level assignments for the Caribbean NANP countries, so a Jamaican
  or Bahamian number gets area-code information only.
* **Carrier = the assignee of the number block**, exactly as in the official
  records. It is *not* a live network lookup: if a number was **ported**, the
  current carrier can differ. Every result carries this disclaimer.
* **Line type is derived, not published.** The source records contain no
  line-type field. Types are assigned per carrier with documented heuristics:
  curated VoIP/app-supplier table (Bandwidth, Onvoy/Inteliquent, Iristel,
  Fibernetics, Twilio, Telnyx, Level 3, Peerless…), VoIP & cable-provider
  patterns, wireless patterns (carrier names containing Wireless/Cellular/
  Mobility/PCS, plus T-Mobile, Cellco, MetroPCS, Fido…), default wireline.
  A small number of mixed carriers (e.g. an incumbent that sells both
  landline and mobile under one name) can be mis-typed.
* **Thousands-block pooling:** where a prefix is split between carriers in
  1,000-number blocks, NANPA tracks assignments in separate thousands-block
  reports; at NPA-NXX granularity such a prefix may be missing here or
  reported as pooled instead of naming one carrier.
* **Toll-free numbers** (800/833/844/855/866/877/888) have no public
  per-number carrier record (carriers are chosen via RespOrgs); the engine
  says so instead of guessing.
* **App detection** flags blocks held by the wholesale suppliers the big
  texting apps use (e.g. Bandwidth → TextNow & Google Voice; Onvoy →
  TextFree/TextNow/Google Voice; Iristel → TextNow in Canada). It proves the
  *kind* of number, never which app a specific person uses, and never who
  owns a number. No tool on this data can identify an owner — by design.
* Rate-centre names are NANPA's own (sometimes abbreviated 10-character
  forms such as "SANANTONIO").

## Refreshing the data

See `build/SOURCES.md`, then run `python3 build/build_data.py` and
`node build/test_lookup.js`. NANPA refreshes its file daily and the CNA
nightly; a monthly refresh is more than enough.

## Embed on a web page

See `SEO-PACKAGE.md` for the full per-tool package (titles, meta, JSON-LD,
FAQs, content outline) and the embed snippet.
