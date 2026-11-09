# Source files

Download these three files into `build/sources/` (gitignored — do not commit
the raw downloads), then run `python3 build/build_data.py`.

| File in `build/sources/` | Download from |
|---|---|
| `CoCodeAssignment_Utilized_AllStates_Public.txt` | Unzip `https://reports.nanpa.com/public/CoCodeAssignment_Utilized_AllStates_Public.zip` (NANPA public reports) |
| `npa_report.csv` | `https://reports.nanpa.com/public/npa_report.csv` (mirror: `https://nationalnanpa.com/nanp1/npa_report.csv`) |
| `COCodeStatus_ALL.csv` | Unzip `https://cnac.ca/data/COCodeStatus_ALL.zip` (Canadian Numbering Administrator, CO Code Status — all NPAs) |

Snapshots used for the first build (2026-11-09):

* NANPA utilized CO codes — file updated 11/09/2026, 205,307 rows →
  198,804 assigned (Use = AS) prefixes kept; unassigned (UA) and N11
  service-code rows dropped.
* CNA CO Code Status — exported 2026-11-08, 46,402 rows → 28,794 prefixes
  with Status "In Service" or "Assigned" kept.
* NANPA NPA report — file dated 11/09/2026 → 486 in-service NPAs kept.

Licence/terms: NANPA and the CNA publish these as public records; neither
states an open-data licence in the files. Attribution is kept in `data.json`
(`sources` field) and in the README.
