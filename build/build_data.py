#!/usr/bin/env python3
"""
Build instamber-tools data files from the official public numbering records.

Sources (download into build/sources/ — see build/SOURCES.md):
  * NANPA  CoCodeAssignment_Utilized_AllStates_Public.txt  (US NPA-NXX -> OCN/company/rate center)
  * CNA    COCodeStatus_ALL.csv                            (Canada NPA-NXX -> company/exchange area)
  * NANPA  npa_report.csv                                  (area code -> state/country/time zone/service)

Outputs (repo root):
  * data.json    - prefix dataset  {carriers, rc, prefixes{npa:{nxx:[carrierIdx,typeChar,rcIdx]}}}
  * lookup.js    - full engine (area map embedded, prefix data fetched from data.json)
  * areacode.js  - standalone area-code-only engine (area map embedded, no fetch)

Line type is NOT in the source records. It is derived per carrier with the
documented heuristics in classify() below: curated app/VoIP supplier table,
VoIP/cable provider patterns, wireless patterns, default wireline.
"""
import csv, json, re, sys, collections, os

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sources")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- display names
KEEP_UPPER = {"PCS", "XO", "GCI", "MCI", "RCC", "HTC", "AT&T", "DSL", "FTTX"}
DROP_TAIL = {"INC", "INC.", "LLC", "L.L.C.", "CORP", "CORP.", "CORPORATION", "CO", "CO.", "COMPANY", "LTD", "LTEE", "ULC"}

def display_name(legal: str) -> str:
    n = " ".join(legal.strip().strip('"').split())
    m = re.search(r"\bDBA\b\s+(.+)$", n, re.I)
    if m:
        n = m.group(1).strip()
    n = re.sub(r"\s+-\s+[A-Z]{2}$", "", n)            # trailing " - IL" state suffix
    n = n.strip(" ,")
    toks = n.split(" ")
    while toks and toks[-1].upper().strip(".,") in DROP_TAIL:
        toks.pop()
    out = []
    for t in toks:
        tu = t.upper().strip(".,")
        if tu in KEEP_UPPER:
            out.append(tu)
        elif t.upper() == "T-MOBILE":
            out.append("T-Mobile")
        elif "&" in t:
            out.append(t.upper())
        else:
            out.append(t.capitalize())
    return " ".join(out).strip(" ,") or legal.strip()

# ---------------------------------------------------------------- classification
# type chars: m=mobile, l=landline, v=voip, u=unknown
APP_SUPPLIERS = [
    (("BANDWIDTH.COM", "BANDWIDTH COMMUNICATIONS"), "bandwidth",
     ["TextNow", "Google Voice"],
     "Bandwidth.com \u2014 wholesale VoIP platform that supplies numbers to TextNow, Google Voice and many other apps"),
    (("ONVOY", "NEUTRAL TANDEM", "INTELIQUENT"), "onvoy",
     ["TextFree", "TextNow", "Google Voice"],
     "Onvoy / Inteliquent \u2014 wholesale VoIP network that supplies numbers to TextFree (Pinger), TextNow, Google Voice and many other apps"),
    (("IRISTEL",), "iristel",
     ["TextNow", "other VoIP apps"],
     "Iristel \u2014 Canadian wholesale VoIP carrier that supplies numbers to TextNow in Canada and many other VoIP services"),
    (("FIBERNETICS",), "fibernetics",
     ["Fongo", "other VoIP services"],
     "Fibernetics \u2014 Canadian VoIP carrier behind Fongo / freephoneline and other VoIP services"),
    (("ISP TELECOM",), "isptelecom",
     ["various VoIP apps"],
     "ISP Telecom \u2014 Canadian wholesale VoIP carrier that supplies numbers to many VoIP apps and services"),
    (("TWILIO",), "twilio",
     ["Twilio-powered apps"],
     "Twilio \u2014 cloud communications platform; numbers on Twilio are provisioned by apps and online services, not consumer phone lines"),
    (("TELNYX",), "telnyx",
     ["Telnyx-powered apps"],
     "Telnyx \u2014 cloud communications platform; its numbers are provisioned by apps and online services"),
    (("LEVEL 3",), "level3",
     ["Google Voice", "many VoIP services"],
     "Level 3 (Lumen) \u2014 wholesale network whose numbers are used by Google Voice and many VoIP providers"),
    (("PEERLESS",), "peerless",
     ["various VoIP services"],
     "Peerless Network \u2014 wholesale VoIP network that supplies numbers to many VoIP providers and apps"),
]
VOIP_PATTERNS = [
    "VONAGE", "YMAX", "8X8", "OOMA", "VOIP", "FLOWROUTE", "INTELEPEER", "COMWAVE",
    "THINKTEL", "DISTRIBUTEL", "PRIMUS TELECOMMUNICATIONS", "XO COMMUNICATIONS",
    "GOOGLE FIBER", "COMCAST", "CHARTER", "COX COMMUNICATIONS", "ALTICE", "OPTIMUM",
    "RCN TELECOM", "WIDEOPENWEST", "WIDE OPEN WEST", "COGECO", "VIDEOTRON", "SHAW CABLE",
    "EASTLINK", "TEKSAVVY", "VIRGIN MEDIA", "MAGICJACK",
]
ILEC_TOKENS = ["BELL", "FRONTIER", "VERIZON", "QWEST", "CENTURYLINK", "WINDSTREAM",
               "AT&T", "SOUTHWESTERN", "PACIFIC BELL", "CONSOLIDATED", "LUMEN -", "BRIGHTSPEED"]
WIRELESS_SUBSTR = ["WIRELESS", "CELLULAR", "MOBILITY", "T-MOBILE", "CELLCO", "CINGULAR",
                   "METROPCS", "CRICKET", "UNITED STATES CELLULAR", "U.S. CELLULAR",
                   "SPRINT", "BOOST MOBILE", "FREEDOM MOBILE", "FIDO", "KOODO",
                   "PUBLIC MOBILE", "CHATR", "LUCKY MOBILE", "VIRGIN PLUS", "VIRGIN MOBILE"]
WIRELESS_REGEX = [r"\(WIRELESS\)", r"\bPCS\b", r"\bMOBILE\b"]

def classify(legal: str):
    """Return (type_char, family_key_or_None)."""
    n = " ".join(legal.upper().split())
    if "MULTIPLE OCN LISTING" in n:
        return ("u", None)
    if "TEXTNOW" in n:
        return ("v", "textnow")
    if "PINGER" in n:
        return ("v", "pinger")
    if "GOOGLE" in n and "FIBER" not in n:
        return ("v", "google")
    for pats, key, _apps, _label in APP_SUPPLIERS:
        if any(p in n for p in pats):
            return ("v", key)
    if any(p in n for p in WIRELESS_SUBSTR) or any(re.search(p, n) for p in WIRELESS_REGEX):
        return ("m", None)
    if "SPECTRUM" in n and "CHARTER" not in n and "TIME WARNER" not in n:
        return ("m", None)  # legacy Sprint Spectrum PCS holdings
    if any(p in n for p in VOIP_PATTERNS):
        return ("v", None)
    if "FIBER" in n and not any(t in n for t in ILEC_TOKENS):
        return ("v", None)  # fibre ISPs deliver voice as VoIP
    if "CABLE" in n:
        return ("v", None)
    return ("l", None)

FAMILIES = {key: {"apps": apps, "label": label} for _p, key, apps, label in APP_SUPPLIERS}
FAMILIES.update({
    "textnow": {"apps": ["TextNow"], "label": "TextNow \u2014 free calling & texting app"},
    "pinger": {"apps": ["TextFree"], "label": "Pinger \u2014 the company behind the TextFree app"},
    "google": {"apps": ["Google Voice"], "label": "Google \u2014 these numbers belong to Google Voice"},
})

# ---------------------------------------------------------------- load US (NANPA)
def load_us():
    path = os.path.join(SRC, "CoCodeAssignment_Utilized_AllStates_Public.txt")
    rows = []
    with open(path, encoding="utf-8-sig", errors="replace") as f:
        rd = csv.reader(f, delimiter="\t")
        next(rd)
        for r in rd:
            if len(r) < 11:
                continue
            state, npanxx, ocn = r[0].strip(), r[1].strip(), r[2].strip()
            company = " ".join(r[3].strip().strip('"').split())
            rc = " ".join(r[4].split())
            use = r[6].strip()
            if use != "AS" or not company:
                continue  # drop unassigned / N11 service-code rows
            m = re.fullmatch(r"(\d{3})-(\d{3})", npanxx)
            if not m:
                continue
            rows.append((m.group(1), m.group(2), state, company, ocn, rc))
    return rows

# ---------------------------------------------------------------- load Canada (CNA)
def load_ca():
    path = os.path.join(SRC, "COCodeStatus_ALL.csv")
    rows = []
    with open(path, encoding="utf-8-sig") as f:
        rd = csv.reader(f)
        for r in rd:
            if len(r) < 8 or not re.fullmatch(r"\d{3}", (r[0] or "").strip()):
                continue
            npa, nxx, status = r[0].strip(), r[1].strip(), r[2].strip()
            if status not in ("In Service", "Assigned"):
                continue
            city, prov, company, ocn = r[4].strip(), r[5].strip(), r[6].strip(), r[7].strip()
            if not company:
                continue
            rows.append((npa, nxx, prov, company, ocn, city))
    return rows

# ---------------------------------------------------------------- area codes (NANPA NPA report)
PROVINCES = {"ONTARIO": "ON", "QUEBEC": "QC", "BRITISH COLUMBIA": "BC", "ALBERTA": "AB",
             "MANITOBA": "MB", "SASKATCHEWAN": "SK", "NOVA SCOTIA": "NS", "NEW BRUNSWICK": "NB",
             "NEWFOUNDLAND AND LABRADOR": "NL", "PRINCE EDWARD ISLAND": "PE", "YUKON": "YT",
             "NORTHWEST TERRITORIES": "NT", "NUNAVUT": "NU"}

def tzinfo(code):
    code = (code or "").strip()
    if code == "AK":
        return ("Alaska Time (AKT)", "America/Anchorage")
    if code.startswith("N"):
        return ("Newfoundland Time (NT)", "America/St_Johns")
    if "UTC+10" in code:
        return ("Chamorro Time (UTC+10)", "Pacific/Guam")
    if "UTC-11" in code:
        return ("Samoa Time (UTC-11)", "Pacific/Pago_Pago")
    if "UTC-10" in code:
        return ("Hawaii Time (HST, UTC-10)", "Pacific/Honolulu")
    first = code[:1]
    return {"E": ("Eastern Time (ET)", "America/New_York"),
            "C": ("Central Time (CT)", "America/Chicago"),
            "M": ("Mountain Time (MT)", "America/Denver"),
            "P": ("Pacific Time (PT)", "America/Los_Angeles"),
            "A": ("Atlantic Time (AT)", "America/Halifax")}.get(first, ("", ""))

def load_areas():
    path = os.path.join(SRC, "npa_report.csv")
    areas = {}
    with open(path, encoding="utf-8-sig") as f:
        rd = csv.reader(f)
        next(rd)  # "File Date,..." line
        hdr = next(rd)
        idx = {h: i for i, h in enumerate(hdr)}
        for r in rd:
            if len(r) < 20 or not (r[0] or "").isdigit():
                continue
            if r[idx["IN_SERVICE"]] != "Y":
                continue
            npa = r[0]
            loc = (r[idx["LOCATION"]] or "").strip()
            country_raw = (r[idx["COUNTRY"]] or "").strip()
            if country_raw == "US":
                country, state = "United States", loc
            elif country_raw == "CANADA":
                country, state = "Canada", PROVINCES.get(loc.upper(), loc.title())
            elif country_raw:
                country, state = country_raw.title(), ""
            else:
                country, state = "", ""
            tzl, tzi = tzinfo(r[idx["TIME_ZONE"]])
            areas[npa] = {"state": state, "country": country, "tz": tzl, "tzIana": tzi,
                          "service": (r[idx["SERVICE"]] or "").strip(), "city": ""}
    return areas

# ---------------------------------------------------------------- build
def main():
    us, ca, areas = load_us(), load_ca(), load_areas()
    print(f"US prefixes kept: {len(us)}   CA prefixes kept: {len(ca)}   area codes: {len(areas)}")

    carriers, cidx = [], {}
    rcs, ridx = [], {}
    prefixes = {}
    fam_of_carrier = {}
    city_votes = collections.defaultdict(collections.Counter)

    def add(npa, nxx, state, company, ocn, rc):
        if company not in cidx:
            t, fam = classify(company)
            cidx[company] = len(carriers)
            carriers.append([display_name(company), company, t, fam])
        ci = cidx[company]
        t = carriers[ci][2]
        rcd = rc_title(rc)
        if rcd not in ridx:
            ridx[rcd] = len(rcs)
            rcs.append(rcd)
        prefixes.setdefault(npa, {})[nxx] = [ci, t, ridx[rcd]]
        if rcd:
            city_votes[npa][rcd] += 1

    def rc_title(rc):
        rc = " ".join((rc or "").split())
        if not rc or rc == "XXXXXXXXXX":
            return ""
        return rc.title() if rc.isupper() else rc

    for npa, nxx, state, company, ocn, rc in us:
        add(npa, nxx, state, company, ocn, rc)
    for npa, nxx, prov, company, ocn, city in ca:
        add(npa, nxx, prov, company, ocn, city)

    for npa, votes in city_votes.items():
        if npa in areas and votes:
            areas[npa]["city"] = votes.most_common(1)[0][0]

    data = {
        "generated": "2026-11-09",
        "sources": [
            "NANPA Central Office Code assignments (utilized, all states), file updated 11/09/2026",
            "Canadian Numbering Administrator CO Code Status (all NPAs), exported 2026-11-08",
            "NANPA NPA report, file dated 11/09/2026",
        ],
        # carrier entry: [displayName, legalName, typeChar, appFamilyKey|null]
        "carriers": carriers,
        "rc": rcs,
        "prefixes": prefixes,
    }
    with open(os.path.join(ROOT, "data.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

    # ---- QA summary
    total = sum(len(v) for v in prefixes.values())
    bytype = collections.Counter()
    appcount = 0
    for npa_map in prefixes.values():
        for ci, t, ri in npa_map.values():
            bytype[t] += 1
            if carriers[ci][3]:
                appcount += 1
    print(f"total prefixes in data.json: {total}  by type: {dict(bytype)}  app-supplier prefixes: {appcount}")
    print(f"distinct carriers: {len(carriers)}  distinct rate centers: {len(rcs)}")
    top = collections.Counter()
    for npa_map in prefixes.values():
        for ci, t, ri in npa_map.values():
            top[ci] += 1
    print("Top 25 carriers [type, family]:")
    for ci, n in top.most_common(25):
        print(f"  {n:6d}  {carriers[ci][2]}  {carriers[ci][3] or '-':10s}  {carriers[ci][1][:70]}")

    # ---- emit engines
    areas_js = json.dumps(areas, ensure_ascii=False, separators=(",", ":"))
    fams_js = json.dumps(FAMILIES, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(ROOT, "build", "engine_template.js"), encoding="utf-8") as f:
        tpl = f.read()
    engine = tpl.replace("/*__AREAS__*/", areas_js).replace("/*__FAMILIES__*/", fams_js)
    with open(os.path.join(ROOT, "lookup.js"), "w", encoding="utf-8") as f:
        f.write(engine)
    with open(os.path.join(ROOT, "build", "areacode_template.js"), encoding="utf-8") as f:
        tpl2 = f.read()
    with open(os.path.join(ROOT, "areacode.js"), "w", encoding="utf-8") as f:
        f.write(tpl2.replace("/*__AREAS__*/", areas_js))
    print("wrote data.json, lookup.js, areacode.js")

if __name__ == "__main__":
    main()
