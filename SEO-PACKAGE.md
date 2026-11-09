# SEO package — the five sibling tool pages (instamber.com)

Everything a WordPress page needs: slug, SEO title, meta description, H1,
ready-to-paste JSON-LD (WebApplication + FAQPage), the definition paragraph
(written to be quoted by search/AI answers), a content outline, and the
embed snippet. Honesty standard throughout: these tools identify a number's
**carrier and line type from public numbering records** — never an owner,
never a person's location.

## Shared embed (all number tools)

Paste into a Custom HTML block. Change only `data-tool` and the button text
per page (`carrier` · `voip` · `gv` · `app`). The Area Code Lookup page uses
`areacode.js` instead — snippet further down.

```html
<div class="instamber-tool" data-tool="carrier">
  <form class="instamber-lookup-form">
    <input type="tel" inputmode="tel" autocomplete="off"
           placeholder="Enter phone number (e.g. 8189631182)" aria-label="Phone number">
    <button type="submit">Look up carrier</button>
  </form>
  <div class="instamber-result" aria-live="polite"></div>
</div>
<script src="https://asra-hoss.github.io/instamber-tools/lookup.js"></script>
<script>
document.querySelectorAll(".instamber-tool").forEach(function (box) {
  var tool = box.getAttribute("data-tool");
  var out = box.querySelector(".instamber-result");
  box.querySelector("form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var val = box.querySelector("input").value;
    out.textContent = "Looking up\u2026";
    InstamberLookup.lookup(val).then(function (r) {
      if (!r.valid) { out.textContent = r.error; return; }
      var lines = [r.formatted, "Line type: " + r.lineTypeLabel];
      if (r.carrier) lines.splice(1, 0, "Carrier: " + r.carrier);
      if (r.region) lines.push("Region: " + [r.region.city, r.region.state, r.region.country].filter(Boolean).join(", "));
      if (tool === "voip")
        lines.unshift(r.lineType === "voip" ? "YES \u2014 this is a VoIP (internet/app) line."
          : "NO \u2014 this is a " + r.lineTypeLabel.toLowerCase() + " line.");
      if (tool === "gv")
        lines.unshift(r.apps.indexOf("Google Voice") >= 0
          ? "POSSIBLE Google Voice number \u2014 its block sits on a wholesale carrier Google Voice uses. The same blocks serve other apps, so records alone cannot prove it."
          : "Unlikely to be Google Voice \u2014 Google Voice numbers are VoIP on specific wholesale carriers.");
      if (tool === "app")
        lines.unshift(r.isAppNumber ? "LIKELY an app number \u2014 " + r.appFamily
          : "No sign of a texting app in this number's block assignment.");
      if (r.isAppNumber && tool === "carrier")
        lines.push("App number: YES \u2014 " + r.appFamily);
      lines.push(r.note);
      out.innerText = lines.join("\n");
    }).catch(function (e) { out.textContent = "Lookup failed: " + e.message; });
  });
});
</script>
```

Area Code Lookup embed:

```html
<div class="instamber-tool">
  <form class="instamber-lookup-form">
    <input type="text" inputmode="numeric" maxlength="3" placeholder="Enter area code (e.g. 416)" aria-label="Area code">
    <button type="submit">Look up area code</button>
  </form>
  <div class="instamber-result" aria-live="polite"></div>
</div>
<script src="https://asra-hoss.github.io/instamber-tools/areacode.js"></script>
<script>
document.querySelector(".instamber-lookup-form").addEventListener("submit", function (ev) {
  ev.preventDefault();
  var box = ev.target.closest(".instamber-tool");
  var info = InstamberAreaCode.lookup(box.querySelector("input").value);
  box.querySelector(".instamber-result").innerText = info
    ? [info.npa, "Main city: " + (info.primaryCity || "\u2014"),
       "State/Province: " + (info.state || "\u2014"), "Country: " + (info.country || "\u2014"),
       "Time zone: " + (info.timezone || "\u2014")].join("\n")
    : "Unknown or invalid area code.";
});
</script>
```

Internal links for every tool page: the homepage tool
(`https://instamber.com/` — "Free TextNow Number Lookup") and all four
sibling tools, linked in a "Related tools" block at the foot of the page
and contextually in the text (e.g. Carrier Lookup links the VoIP checker
where line type is explained).

---

## 1 · Carrier Lookup

- **URL slug:** `/carrier-lookup/` (already linked from the homepage copy)
- **SEO title:** Free Carrier Lookup — Find Any Number's Carrier & Line Type | Instamber
- **Meta description:** Free carrier lookup for US and Canadian numbers. Enter a number to see the carrier its block is assigned to, its line type (mobile, landline or VoIP) and its region — from official NANPA/CNA records. No sign-up.
- **H1:** Free Carrier Lookup

**Definition paragraph (top of page, under the tool):**
> A carrier lookup identifies the phone company a number's block was assigned to. Every US and Canadian number belongs to a block (its first six digits, the NPA-NXX) that the numbering authorities — NANPA in the US and the Canadian Numbering Administrator — allocated to one carrier. This tool reads those public assignment records and returns the carrier, the line type (mobile, landline or VoIP) and the rate centre the block belongs to. It is free, works in your browser, and the number you enter is not stored.

**Content outline:**
1. Tool (embed above, `data-tool="carrier"`)
2. Definition paragraph (above)
3. *How it works* — numbering blocks explained in 3 short steps: enter number → its six-digit prefix is matched to the assignment records → carrier/line type/region returned; note that no live network query is made.
4. *How to read your result* — Carrier (assignee of the block); Line type (mobile/landline/VoIP and what each means); Region (rate centre = the number's home exchange, not the person's location).
5. *Limits — honestly* — ported numbers keep their original block, so a ported number shows its original carrier; pooled thousands-blocks may not name one carrier; the tool cannot identify a number's owner and no legitimate lookup can (link to homepage section "What this tool cannot tell you").
6. FAQs (below)
7. Related tools + link to the TextNow lookup on the homepage.

**FAQs:**
1. *What is a carrier lookup?* — It tells you which phone company a number's block was assigned to, using the public records of the numbering authorities (NANPA for the US, the CNA for Canada). It also shows the block's line type and rate centre.
2. *Is this carrier lookup really free?* — Yes. It runs on published numbering records loaded into your browser — there is no per-lookup API behind it, no account and no limit. The number you enter is never sent to or stored on a server.
3. *Why does the result show a different carrier than the one on the bill?* — Because of number porting. When someone moves a number to a new carrier, the number keeps its original block, and block records keep naming the original carrier. The result is the carrier of record for the block, which is also the strongest public clue to what kind of line it is.
4. *Can a carrier lookup tell me who owns a number?* — No. Assignment records name companies, not subscribers. There is no public database that maps a number to a person's name or address, and services that promise one for mobile or app numbers are reselling carrier data like this page gives free.
5. *Does it work for Canadian numbers?* — Yes. Canadian assignments come from the Canadian Numbering Administrator's CO code records, the Canadian counterpart of NANPA's.
6. *What does "pooled block" mean in a result?* — Some prefixes are split between several carriers in blocks of 1,000 numbers. For those, the records do not name a single carrier for the whole prefix, and the tool says so rather than guessing.

**JSON-LD:**
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebApplication","name":"Free Carrier Lookup","url":"https://instamber.com/carrier-lookup/","applicationCategory":"UtilitiesApplication","operatingSystem":"Any (web browser)","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Free carrier lookup for US and Canadian numbers: the carrier a number's block is assigned to, its line type and region, from official NANPA and CNA numbering records."},
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is a carrier lookup?","acceptedAnswer":{"@type":"Answer","text":"It tells you which phone company a number's block was assigned to, using the public records of the numbering authorities (NANPA for the US, the CNA for Canada). It also shows the block's line type and rate centre."}},
{"@type":"Question","name":"Is this carrier lookup really free?","acceptedAnswer":{"@type":"Answer","text":"Yes. It runs on published numbering records loaded into your browser — there is no per-lookup API behind it, no account and no limit. The number you enter is never sent to or stored on a server."}},
{"@type":"Question","name":"Why does the result show a different carrier than the one on the bill?","acceptedAnswer":{"@type":"Answer","text":"Because of number porting. When someone moves a number to a new carrier, the number keeps its original block, and block records keep naming the original carrier. The result is the carrier of record for the block."}},
{"@type":"Question","name":"Can a carrier lookup tell me who owns a number?","acceptedAnswer":{"@type":"Answer","text":"No. Assignment records name companies, not subscribers. There is no public database that maps a number to a person's name or address."}},
{"@type":"Question","name":"Does it work for Canadian numbers?","acceptedAnswer":{"@type":"Answer","text":"Yes. Canadian assignments come from the Canadian Numbering Administrator's CO code records, the Canadian counterpart of NANPA's."}},
{"@type":"Question","name":"What does \u201cpooled block\u201d mean in a result?","acceptedAnswer":{"@type":"Answer","text":"Some prefixes are split between several carriers in blocks of 1,000 numbers. For those, the records do not name a single carrier for the whole prefix, and the tool says so rather than guessing."}}
]}]}
</script>
```

---

## 2 · VoIP Number Checker

- **URL slug:** `/voip-number-checker/` (already linked from the homepage copy)
- **SEO title:** VoIP Number Checker — Is This Number VoIP? Free Check | Instamber
- **Meta description:** Free VoIP number checker: enter any US or Canadian number and find out whether its line type is VoIP, mobile or landline, and which carrier the block belongs to. Runs on official numbering records — no sign-up, no limit.
- **H1:** VoIP Number Checker — Is This Number VoIP?

**Definition paragraph:**
> A VoIP number is a phone number delivered over the internet instead of a mobile network or a physical phone line — the kind used by apps like TextNow and Google Voice and by online phone services. This checker looks up the number's block in the official NANPA/CNA assignment records: if the block belongs to a VoIP carrier or a wholesale VoIP network, the number is a VoIP line. The check is free and runs in your browser.

**Content outline:**
1. Tool (embed, `data-tool="voip"`)
2. Definition paragraph (above)
3. *How it works* — line type comes from who holds the block: SIM-based carriers = mobile; internet phone companies and app wholesalers = VoIP; traditional phone companies = landline.
4. *How to read your result* — YES VoIP (what that does and doesn't imply); NO mobile/landline; "can't tell" cases (pooled/unlisted prefixes).
5. *Limits — honestly* — a VoIP result describes the number, not the person; millions use VoIP legitimately; assignment records can't see porting to a VoIP app after the fact if the block was originally a carrier block (and vice versa); owner identity is never available.
6. FAQs; 7. Related tools.

**FAQs:**
1. *What is a VoIP number?* — A number whose calls and texts travel over the internet (Voice over Internet Protocol) rather than a mobile carrier's network or a copper phone line. Texting apps, Google Voice, and home/business internet phone services all issue VoIP numbers.
2. *How can I tell if a number is VoIP?* — Check who holds the number's block. If the assigned carrier is a VoIP provider or a wholesale VoIP network such as Bandwidth or Onvoy, the number is VoIP. That is exactly what this checker reads from the NANPA/CNA records.
3. *Does a VoIP result mean the number is a scam?* — No. VoIP is simply cheaper and more flexible, so both ordinary people and scammers use it. An unsolicited message from a VoIP number deserves extra caution, but VoIP on its own proves nothing.
4. *Can a VoIP number be traced to a person?* — Not by the public. The app or provider behind the number holds the account details and releases them only to law enforcement with a subpoena or court order.
5. *What is the difference between a VoIP number and a mobile number?* — A mobile number is attached to a SIM/eSIM on a wireless carrier's network. A VoIP number lives in an app or an internet phone service and works over any internet connection; its "carrier" in the records is usually a wholesale network, not a consumer brand.
6. *Is the number I check stored anywhere?* — No. The checker loads public records into your browser and the lookup happens on your device.

**JSON-LD:**
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebApplication","name":"VoIP Number Checker","url":"https://instamber.com/voip-number-checker/","applicationCategory":"UtilitiesApplication","operatingSystem":"Any (web browser)","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Free checker that tells whether a US or Canadian number is a VoIP line, a mobile line or a landline, from official NANPA and CNA numbering records."},
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is a VoIP number?","acceptedAnswer":{"@type":"Answer","text":"A number whose calls and texts travel over the internet (Voice over Internet Protocol) rather than a mobile carrier's network or a copper phone line. Texting apps, Google Voice, and internet phone services all issue VoIP numbers."}},
{"@type":"Question","name":"How can I tell if a number is VoIP?","acceptedAnswer":{"@type":"Answer","text":"Check who holds the number's block. If the assigned carrier is a VoIP provider or a wholesale VoIP network such as Bandwidth or Onvoy, the number is VoIP. That is what this checker reads from the NANPA/CNA records."}},
{"@type":"Question","name":"Does a VoIP result mean the number is a scam?","acceptedAnswer":{"@type":"Answer","text":"No. VoIP is cheaper and more flexible, so both ordinary people and scammers use it. An unsolicited message from a VoIP number deserves extra caution, but VoIP on its own proves nothing."}},
{"@type":"Question","name":"Can a VoIP number be traced to a person?","acceptedAnswer":{"@type":"Answer","text":"Not by the public. The app or provider behind the number holds the account details and releases them only to law enforcement with a subpoena or court order."}},
{"@type":"Question","name":"What is the difference between a VoIP number and a mobile number?","acceptedAnswer":{"@type":"Answer","text":"A mobile number is attached to a SIM/eSIM on a wireless carrier's network. A VoIP number lives in an app or an internet phone service and works over any internet connection; its carrier in the records is usually a wholesale network."}},
{"@type":"Question","name":"Is the number I check stored anywhere?","acceptedAnswer":{"@type":"Answer","text":"No. The checker loads public records into your browser and the lookup happens on your device."}}
]}]}
</script>
```

---

## 3 · Google Voice Number Lookup

- **URL slug:** `/google-voice-number-lookup/` (already linked from the homepage copy)
- **SEO title:** Google Voice Number Lookup — Is It a Google Voice Number? | Instamber
- **Meta description:** Free Google Voice number lookup: check whether a number's block sits on the wholesale carriers Google Voice uses (Bandwidth, Onvoy and others) and whether its line type is VoIP. No sign-up.
- **H1:** Google Voice Number Lookup

**Definition paragraph:**
> Google Voice numbers are VoIP numbers, and Google does not hold most of them directly — they sit on wholesale networks such as Bandwidth and Onvoy (Inteliquent), the same carriers that show up in numbering records as the block's assignee. This lookup checks a number's block against the carriers Google Voice is known to use: if the line type is VoIP and the carrier is one of them, the number may be a Google Voice number. Because those wholesalers also supply other apps, records can show a strong possibility, never a proof.

**Content outline:**
1. Tool (embed, `data-tool="gv"`)
2. Definition paragraph (above)
3. *How it works* — Google Voice's wholesale suppliers explained; the two signals (VoIP line type + known supplier).
4. *How to read your result* — "Possible" vs "Unlikely" and exactly why certainty is impossible from public data.
5. *Limits — honestly* — shared wholesale blocks (TextNow and others use the same carriers); porting; Google holds the account data and releases it only through legal process; the tool cannot name the user of a Google Voice number.
6. FAQs; 7. Related tools (VoIP checker for the general question; Text App checker for other apps).

**FAQs:**
1. *How can I tell if a number is a Google Voice number?* — Two clues together: the line type is VoIP, and the block's carrier is a wholesale network Google Voice uses — most often Bandwidth or Onvoy/Inteliquent. This tool checks both against the official assignment records.
2. *Can a lookup be 100% sure a number is Google Voice?* — No. Those wholesale carriers supply many apps, so a matching block means "possibly Google Voice", not proof. Any site claiming certainty is overstating what public records contain.
3. *What carrier do Google Voice numbers show in a lookup?* — Usually Bandwidth.com or Onvoy — Google routes most Voice numbers through wholesale partners rather than holding the blocks itself. A minority of numbers show other VoIP carriers.
4. *Is a Google Voice number traceable?* — By law enforcement, through Google, with a subpoena or court order for the account's registration and connection records. Not by the public and not by lookup websites.
5. *What is the difference between Google Voice and TextNow numbers?* — Both are free VoIP app numbers, often on the same wholesale carriers — which is why records alone can't always tell them apart. They differ in the app and account behind the number, which only the providers can see.
6. *Why would someone use a Google Voice number?* — It's free, works on any device, and keeps a personal mobile number private — common for small businesses, classified ads, online dating and side projects, as well as, unfortunately, some scams.

**JSON-LD:**
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebApplication","name":"Google Voice Number Lookup","url":"https://instamber.com/google-voice-number-lookup/","applicationCategory":"UtilitiesApplication","operatingSystem":"Any (web browser)","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Free lookup that checks whether a number's block sits on the wholesale VoIP carriers Google Voice uses, from official NANPA and CNA numbering records."},
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How can I tell if a number is a Google Voice number?","acceptedAnswer":{"@type":"Answer","text":"Two clues together: the line type is VoIP, and the block's carrier is a wholesale network Google Voice uses — most often Bandwidth or Onvoy/Inteliquent. This tool checks both against the official assignment records."}},
{"@type":"Question","name":"Can a lookup be 100% sure a number is Google Voice?","acceptedAnswer":{"@type":"Answer","text":"No. Those wholesale carriers supply many apps, so a matching block means \u201cpossibly Google Voice\u201d, not proof. Any site claiming certainty is overstating what public records contain."}},
{"@type":"Question","name":"What carrier do Google Voice numbers show in a lookup?","acceptedAnswer":{"@type":"Answer","text":"Usually Bandwidth.com or Onvoy — Google routes most Voice numbers through wholesale partners rather than holding the blocks itself. A minority of numbers show other VoIP carriers."}},
{"@type":"Question","name":"Is a Google Voice number traceable?","acceptedAnswer":{"@type":"Answer","text":"By law enforcement, through Google, with a subpoena or court order for the account's registration and connection records. Not by the public and not by lookup websites."}},
{"@type":"Question","name":"What is the difference between Google Voice and TextNow numbers?","acceptedAnswer":{"@type":"Answer","text":"Both are free VoIP app numbers, often on the same wholesale carriers — which is why records alone can't always tell them apart. They differ in the app and account behind the number, which only the providers can see."}},
{"@type":"Question","name":"Why would someone use a Google Voice number?","acceptedAnswer":{"@type":"Answer","text":"It's free, works on any device, and keeps a personal mobile number private — common for small businesses, classified ads, online dating and side projects, as well as, unfortunately, some scams."}}
]}]}
</script>
```

---

## 4 · Text App Number Checker

- **URL slug:** `/text-app-number-checker/`
- **SEO title:** Text App Number Checker — TextNow, TextFree & More | Instamber
- **Meta description:** Free checker for texting-app numbers: find out whether a number comes from TextNow, TextFree or another app by checking its block against the wholesale carriers those apps use. No sign-up.
- **H1:** Text App Number Checker

**Definition paragraph:**
> A text app number is a VoIP number issued by a free texting app — TextNow, TextFree, Talkatone and their many smaller rivals — instead of by a mobile carrier. The apps rarely hold numbers themselves: they rent them from wholesale VoIP networks (Bandwidth and Onvoy in the US, Iristel in Canada). This checker reads the number's block assignment in the NANPA/CNA records and flags it when the carrier is one of those app suppliers, which is the reliable public sign of an app number.

**Content outline:**
1. Tool (embed, `data-tool="app"`)
2. Definition paragraph (above)
3. *How it works* — the supplier chain explained: app → wholesale network → numbering records; why the wholesaler's name is the tell.
4. *How to read your result* — "Likely an app number" (with the supplier named and the apps it supplies); plain VoIP (an online phone service, not a known texting-app supplier); mobile/landline (a carrier line).
5. *Limits — honestly* — identifies the kind of number, not the specific app with certainty (suppliers serve several apps) and never the person; app numbers are also used legitimately by millions; what to do about harassment (block, report to 7726, report to the app, police for threats) — link the homepage's safety section.
6. FAQs; 7. Related tools.

**FAQs:**
1. *What is a text app number?* — A phone number issued by a free texting/calling app such as TextNow or TextFree. It is a VoIP number: it works over the internet in the app, not through a SIM card or a mobile plan.
2. *Which apps can this checker detect?* — It flags numbers whose blocks belong to the wholesale suppliers the major apps use — Bandwidth and Onvoy/Inteliquent in the US (TextNow, TextFree, Google Voice and others) and Iristel in Canada (TextNow Canada). It identifies the supplier, which narrows the app down but can't always single one out.
3. *Why do scammers use text app numbers?* — They are free, take only an email address to open, and can be discarded and replaced in minutes. That makes them attractive for spam and fraud — and also for ordinary people who need a free second line.
4. *Can I find out who is behind a text app number?* — No. The app holds the only account record (a signup email and connection logs) and releases it solely to law enforcement with legal process. No lookup site can name the user of an app number.
5. *Is every app number suspicious?* — No. Millions of people use TextNow or TextFree as their everyday phone service. Treat unsolicited contact from any number with care, but an app number alone doesn't make someone a scammer.
6. *What should I do if an app number is harassing me?* — Block it, forward spam texts to 7726, and report abuse to the app (they act on accounts that break their terms). Save screenshots with timestamps; if there are threats or extortion, go to the police — they can obtain the account records from the app through legal channels.

**JSON-LD:**
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebApplication","name":"Text App Number Checker","url":"https://instamber.com/text-app-number-checker/","applicationCategory":"UtilitiesApplication","operatingSystem":"Any (web browser)","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Free checker that flags numbers from texting apps such as TextNow and TextFree by matching their blocks to the wholesale VoIP carriers those apps use, from NANPA and CNA records."},
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is a text app number?","acceptedAnswer":{"@type":"Answer","text":"A phone number issued by a free texting/calling app such as TextNow or TextFree. It is a VoIP number: it works over the internet in the app, not through a SIM card or a mobile plan."}},
{"@type":"Question","name":"Which apps can this checker detect?","acceptedAnswer":{"@type":"Answer","text":"It flags numbers whose blocks belong to the wholesale suppliers the major apps use — Bandwidth and Onvoy/Inteliquent in the US (TextNow, TextFree, Google Voice and others) and Iristel in Canada (TextNow Canada). It identifies the supplier, which narrows the app down but can't always single one out."}},
{"@type":"Question","name":"Why do scammers use text app numbers?","acceptedAnswer":{"@type":"Answer","text":"They are free, take only an email address to open, and can be discarded and replaced in minutes. That makes them attractive for spam and fraud — and also for ordinary people who need a free second line."}},
{"@type":"Question","name":"Can I find out who is behind a text app number?","acceptedAnswer":{"@type":"Answer","text":"No. The app holds the only account record (a signup email and connection logs) and releases it solely to law enforcement with legal process. No lookup site can name the user of an app number."}},
{"@type":"Question","name":"Is every app number suspicious?","acceptedAnswer":{"@type":"Answer","text":"No. Millions of people use TextNow or TextFree as their everyday phone service. Treat unsolicited contact from any number with care, but an app number alone doesn't make someone a scammer."}},
{"@type":"Question","name":"What should I do if an app number is harassing me?","acceptedAnswer":{"@type":"Answer","text":"Block it, forward spam texts to 7726, and report abuse to the app. Save screenshots with timestamps; if there are threats or extortion, go to the police — they can obtain the account records from the app through legal channels."}}
]}]}
</script>
```

---

## 5 · Area Code Lookup

- **URL slug:** `/area-code-lookup/`
- **SEO title:** Area Code Lookup — Where Is This Area Code? | Instamber
- **Meta description:** Free area code lookup for the US, Canada and the whole NANP: find an area code's state or province, country, time zone and main city from the official NANPA registry. No sign-up.
- **H1:** Area Code Lookup

**Definition paragraph:**
> An area code (NPA) is the three-digit prefix of a North American phone number that identifies its numbering region — a state, a province, part of one, or a special service like toll-free calling. This lookup reads the official NANPA registry and returns the region an area code serves, its time zone and its principal city. An area code describes where a number was issued, not where the person using it is now.

**Content outline:**
1. Tool (embed with `areacode.js`)
2. Definition paragraph (above)
3. *How it works* — the NANP and the NANPA registry in a few lines; how overlays put several codes on one region.
4. *How to read your result* — state/province & country; time zone (some codes span two — the registry's principal one is shown); "main city" = the rate centre with the most assigned prefixes, a representative city, not the only city.
5. *Limits — honestly* — an area code is about the number, not the person: people keep numbers when they move, and app users pick any area code they like; toll-free codes (800, 888, 877, 866, 855, 844, 833) have no region at all.
6. FAQs; 7. Related tools (Carrier Lookup for a full number).

**FAQs:**
1. *Where is an area code located?* — Enter it above: the registry entry gives the state, province or country the code serves, its time zone and the city with the most numbers in it. Many codes cover a whole state or a metro region rather than one city.
2. *Can an area code tell me where a caller is?* — No. It tells you where the number was originally issued. People keep their numbers when they move, and texting-app users choose almost any area code, so a "New York" number can belong to someone anywhere.
3. *What time zone is an area code in?* — The result shows the code's principal time zone from the NANPA registry. A few large rural codes span two zones; the registry lists the one covering most of the region.
4. *Which area codes are toll-free?* — 800, 888, 877, 866, 855, 844 and 833. They are not geographic — a toll-free number can ring anywhere in the US or Canada.
5. *What is an overlay area code?* — When a region runs low on numbers, a second code is added over the same map instead of splitting it. Both codes serve the same places, and ten-digit dialling becomes mandatory.
6. *Do area codes ever change?* — New codes are added by overlay or split as regions grow, but existing numbers almost never change — a split lets current customers keep their number.

**JSON-LD:**
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebApplication","name":"Area Code Lookup","url":"https://instamber.com/area-code-lookup/","applicationCategory":"UtilitiesApplication","operatingSystem":"Any (web browser)","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Free lookup of any NANP area code: state or province, country, time zone and principal city, from the official NANPA registry."},
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Where is an area code located?","acceptedAnswer":{"@type":"Answer","text":"The registry entry gives the state, province or country the code serves, its time zone and the city with the most numbers in it. Many codes cover a whole state or a metro region rather than one city."}},
{"@type":"Question","name":"Can an area code tell me where a caller is?","acceptedAnswer":{"@type":"Answer","text":"No. It tells you where the number was originally issued. People keep their numbers when they move, and texting-app users choose almost any area code, so a \u201cNew York\u201d number can belong to someone anywhere."}},
{"@type":"Question","name":"What time zone is an area code in?","acceptedAnswer":{"@type":"Answer","text":"The result shows the code's principal time zone from the NANPA registry. A few large rural codes span two zones; the registry lists the one covering most of the region."}},
{"@type":"Question","name":"Which area codes are toll-free?","acceptedAnswer":{"@type":"Answer","text":"800, 888, 877, 866, 855, 844 and 833. They are not geographic — a toll-free number can ring anywhere in the US or Canada."}},
{"@type":"Question","name":"What is an overlay area code?","acceptedAnswer":{"@type":"Answer","text":"When a region runs low on numbers, a second code is added over the same map instead of splitting it. Both codes serve the same places, and ten-digit dialling becomes mandatory."}},
{"@type":"Question","name":"Do area codes ever change?","acceptedAnswer":{"@type":"Answer","text":"New codes are added by overlay or split as regions grow, but existing numbers almost never change — a split lets current customers keep their number."}}
]}]}
</script>
```
