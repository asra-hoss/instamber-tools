/* Instamber Carrier Lookup - self-contained embed. Renders into #instamber-carrier. */
(function(){
  var css = "\n  :root{\n    --ink:#161616; --body:#2e2e2e; --muted:#6f6f6f;\n    --line:#ebebeb; --panel:#f7f8fa;\n    --blue:#2B6AF0; --purple:#9A54D6; --link:#02669a;\n    --grad:linear-gradient(to right,#2B6AF0,#9A54D6);\n    --serif:\"IBM Plex Serif\",\"PT Serif\",Georgia,serif;\n    --sans:Roboto,Arial,sans-serif;\n  }\n  *{box-sizing:border-box}\n  body{margin:0;font-family:var(--sans);color:var(--body);background:#fff;font-size:16.5px;line-height:1.7}\n  a{color:var(--link);text-decoration:none}\n  a:hover{text-decoration:underline}\n  .wrap{max-width:1170px;margin:0 auto;padding:0 20px}\n  .col{max-width:780px;margin:0 auto}\n\n  /* header \u2014 Contentberg style: logo row, nav below */\n  .site-head{background:#fff;border-bottom:1px solid var(--line)}\n  .head-row{display:flex;align-items:center;justify-content:space-between;padding:18px 0 12px}\n  .logo img{display:block;width:200px;height:29px}\n  .head-actions{color:var(--ink);display:flex;align-items:center}\n  .burger{display:none;background:none;border:0;padding:6px;cursor:pointer}\n  .burger span{display:block;width:22px;height:2px;background:var(--ink);margin:5px 0}\n  .main-nav{border-top:1px solid var(--line)}\n  .main-nav ul{display:flex;flex-wrap:wrap;gap:4px 24px;list-style:none;margin:0;padding:0}\n  .main-nav a{display:block;padding:11px 0 10px;font-size:12.5px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--ink)}\n  .main-nav a:hover{color:var(--blue);text-decoration:none}\n  .main-nav li.current a{color:var(--blue);box-shadow:inset 0 -2px 0 var(--blue)}\n\n  /* page title */\n  .page-head{padding:38px 0 6px}\n  .kicker{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--purple);margin:0 0 10px}\n  h1{font-family:var(--serif);font-weight:600;font-size:42px;line-height:1.18;color:var(--ink);margin:0 0 14px}\n  .standfirst{font-size:17.5px;line-height:1.65;color:#444;margin:0;max-width:640px}\n\n  /* the tool */\n  .tool-card{margin:26px 0 8px;background:#fff;border:1px solid #e7e7f2;border-radius:18px;box-shadow:0 12px 34px rgba(43,106,240,.09);padding:26px 26px 22px}\n  .tool-label{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:0 0 12px}\n  .pill{display:flex;align-items:center;max-width:700px;margin:0 auto;background:var(--grad);border-radius:80px;padding:12px;box-shadow:0 4px 10px rgba(0,0,0,.12);min-height:76px}\n  .pill .cc{color:#fff;font-size:20px;margin:0 6px 0 16px;flex:0 0 auto}\n  .pill input{flex:1;min-width:0;border:0;outline:0;background:none;color:#fff;font-family:var(--sans);font-size:18px;padding:5px 4px}\n  .pill input::placeholder{color:rgba(255,255,255,.78)}\n  .pill button{flex:0 0 auto;background:#fff;border:0;border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}\n  .pill button:active{transform:scale(.96)}\n  .pill button .spin{display:none;width:22px;height:22px;border-radius:50%;border:3px solid #cfe1ff;border-top-color:#2B6AF0;animation:rot .7s linear infinite}\n  .tool-card.loading .pill button .mag{display:none}\n  .tool-card.loading .pill button .spin{display:block}\n  @keyframes rot{to{transform:rotate(360deg)}}\n  .trust{display:flex;flex-wrap:wrap;gap:6px 22px;justify-content:center;margin:16px 0 2px;font-size:13.5px;color:var(--muted)}\n  .trust b{color:#12805c;font-weight:700;margin-right:5px}\n\n  .result-zone{margin-top:20px;border-top:1px solid var(--line);padding-top:20px}\n  .state-empty{background:var(--panel);border:1px dashed #d9dce6;border-radius:12px;padding:26px 20px;text-align:center;color:var(--muted);font-size:15.5px}\n  .state-empty .glyph{width:44px;height:44px;margin:0 auto 10px;border-radius:50%;background:#fff;border:1px solid var(--line);display:flex;align-items:center;justify-content:center}\n  .state-loading{background:var(--panel);border-radius:12px;padding:22px;text-align:center;color:var(--muted)}\n  .dots i{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--blue);margin:0 2px;animation:bnc 1s infinite}\n  .dots i:nth-child(2){animation-delay:.15s;background:var(--purple)}\n  .dots i:nth-child(3){animation-delay:.3s}\n  @keyframes bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}\n\n  .state-error{background:#fdf3f3;border:1px solid #f0cdcd;border-radius:12px;padding:18px 20px;display:flex;gap:14px;align-items:flex-start}\n  .state-error .ic{flex:0 0 auto;width:34px;height:34px;border-radius:50%;background:#fbe3e3;color:#9c2b21;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px}\n  .state-error h4{margin:2px 0 4px;font-size:16px;color:#7c1d14;font-family:var(--sans);font-weight:700}\n  .state-error p{margin:0;font-size:14.5px;color:#8a3a32;line-height:1.55}\n\n  .result-card{border:1px solid var(--line);border-radius:14px;overflow:hidden}\n  .rc-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;padding:18px 22px 14px;background:linear-gradient(180deg,#fbfbfe,#fff)}\n  .rc-number{font-family:var(--serif);font-weight:600;font-size:27px;color:var(--ink);line-height:1.1}\n  .badges{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}\n  .badge{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;letter-spacing:.02em;padding:5px 12px;border-radius:999px}\n  .badge .dot{width:8px;height:8px;border-radius:50%;background:currentColor}\n  .badge.mobile{background:#e6f4ec;color:#0f7a4d}\n  .badge.landline{background:#e7f1f8;color:#02669a}\n  .badge.voip{background:#f1eafd;color:#7434b8}\n  .badge.tollfree{background:#fdf3e0;color:#96660a}\n  .badge.premium{background:#fdecec;color:#9c2b21}\n  .badge.unknown{background:#efefef;color:#666}\n  .badge.app{background:var(--grad);color:#fff}\n  .app-strip{margin:0 22px 4px;background:#f6f0fd;border:1px solid #e3d4fa;border-radius:10px;padding:12px 16px;font-size:14.5px;color:#4a2b78;line-height:1.55}\n  .app-strip b{color:#7434b8}\n  .rc-rows{margin:0;padding:6px 22px 4px}\n  .rc-row{display:flex;gap:18px;padding:13px 0;border-top:1px solid var(--line)}\n  .rc-row dt{flex:0 0 128px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding-top:3px}\n  .rc-row dd{margin:0;flex:1;min-width:0}\n  .rc-val{font-size:17.5px;font-weight:500;color:var(--ink);line-height:1.4}\n  .rc-sub{font-size:13.5px;color:var(--muted);line-height:1.5;margin-top:2px}\n  .rc-note{padding:14px 22px 18px;font-size:13.5px;color:#777;line-height:1.6}\n  .rc-note b{color:#555}\n  .rc-src{padding:0 22px 16px;font-size:12px;color:#aaa;margin-top:-8px}\n\n  /* article body */\n  .entry{padding:10px 0 0}\n  .entry p{margin:0 0 1.1em}\n  .entry h2{font-family:var(--serif);font-weight:600;font-size:27px;line-height:1.3;color:var(--ink);margin:1.6em 0 .55em}\n  .entry h2:first-child{margin-top:.7em}\n  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:20px 0 6px}\n  .step{border:1px solid var(--line);border-radius:14px;padding:18px;background:#fff}\n  .step .n{width:32px;height:32px;border-radius:50%;background:var(--grad);color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;margin-bottom:10px}\n  .step h3{font-family:var(--sans);font-size:16px;font-weight:700;color:var(--ink);margin:0 0 6px}\n  .step p{font-size:14.5px;line-height:1.6;color:#555;margin:0}\n  .read-item{border-top:1px solid var(--line);padding:14px 0 4px}\n  .read-item h3{font-family:var(--sans);font-size:16.5px;font-weight:700;color:var(--ink);margin:0 0 4px}\n  .read-item p{font-size:15.5px;color:#444;margin:0 0 10px}\n  .callout{background:#f4f6fd;border:1px solid #dde4fa;border-left:4px solid var(--blue);border-radius:10px;padding:18px 20px;margin:22px 0}\n  .callout h2{margin-top:0}\n  .callout p:last-child{margin-bottom:0}\n  .faq{border-top:1px solid var(--line);padding:16px 0 6px}\n  .faq h3{font-family:var(--sans);font-size:16.5px;font-weight:700;color:var(--ink);margin:0 0 5px}\n  .faq p{font-size:15.5px;color:#444;margin:0 0 8px}\n\n  .related{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0 10px}\n  .rel-card{display:block;border:1px solid var(--line);border-radius:14px;padding:16px 18px;color:var(--body);background:#fff}\n  .rel-card:hover{border-color:#cfd8f5;box-shadow:0 8px 22px rgba(43,106,240,.08);text-decoration:none}\n  .rel-card h3{font-family:var(--sans);font-size:16px;font-weight:700;color:var(--ink);margin:0 0 4px}\n  .rel-card p{font-size:14px;color:#666;line-height:1.55;margin:0 0 8px}\n  .rel-card .go{font-size:13.5px;font-weight:700;color:var(--blue)}\n\n  /* footer */\n  .site-foot{margin-top:56px;background:#fafafa;border-top:1px solid var(--line)}\n  .foot-cols{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:34px;padding:38px 0 30px}\n  .foot-cols h5{font-size:12.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);margin:0 0 14px}\n  .foot-cols ul{list-style:none;margin:0;padding:0}\n  .foot-cols li{margin:0 0 9px;font-size:14.5px;line-height:1.5}\n  .foot-cols a{color:#444}\n  .foot-cols a:hover{color:var(--blue)}\n  .foot-blurb{font-size:14.5px;color:#666;line-height:1.65;margin:10px 0 0;max-width:340px}\n  .foot-word{font-family:var(--serif);font-weight:600;font-size:21px;color:var(--ink);letter-spacing:.01em}\n  .foot-bar{border-top:1px solid var(--line);padding:16px 0 20px;display:flex;flex-wrap:wrap;gap:8px 26px;font-size:13px;color:#999}\n  .foot-bar a{color:#777}\n\n  @media (max-width:760px){\n    body{font-size:16px}\n    .main-nav{display:none}\n    .burger{display:block}\n    .logo img{width:164px;height:24px}\n    .head-row{padding:13px 0 11px}\n    .page-head{padding:26px 0 2px}\n    h1{font-size:31px}\n    .standfirst{font-size:16.5px}\n    .tool-card{padding:18px 14px 16px;border-radius:16px}\n    .pill{min-height:64px;padding:9px}\n    .pill .cc{font-size:17px;margin-left:10px}\n    .pill input{font-size:16px}\n    .pill button{width:46px;height:46px}\n    .rc-head{padding:15px 16px 11px}\n    .rc-number{font-size:23px}\n    .badges{margin-left:0}\n    .rc-rows{padding:4px 16px 2px}\n    .rc-row{flex-direction:column;gap:3px;padding:11px 0}\n    .rc-row dt{flex:none;padding-top:0}\n    .app-strip{margin:0 16px 2px}\n    .rc-note{padding:12px 16px 15px}\n    .rc-src{padding:0 16px 13px}\n    .steps{grid-template-columns:1fr}\n    .related{grid-template-columns:1fr}\n    .foot-cols{grid-template-columns:1fr;gap:24px;padding:30px 0 22px}\n  }\n";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  function mount(){
    var host = document.getElementById("instamber-carrier");
    if(!host) return;
    host.innerHTML = "<section class=\"tool-card\" id=\"toolCard\" aria-label=\"Carrier lookup tool\">\n      <p class=\"tool-label\">Enter a US or Canadian number</p>\n      <form class=\"pill\" id=\"lookupForm\" autocomplete=\"off\">\n        <span class=\"cc\">+1</span>\n        <input id=\"phoneInput\" type=\"tel\" inputmode=\"tel\" placeholder=\"e.g. 907 201 0142\" aria-label=\"Phone number\">\n        <button type=\"submit\" id=\"goBtn\" aria-label=\"Look up carrier\">\n          <svg class=\"mag\" xmlns=\"http://www.w3.org/2000/svg\" height=\"27\" width=\"27\" fill=\"none\" stroke=\"#0085FF\" stroke-width=\"2\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\"/></svg>\n          <span class=\"spin\" aria-hidden=\"true\"></span>\n        </button>\n      </form>\n      <div class=\"trust\">\n        <span><b>\u2713</b>Free, no account</span>\n        <span><b>\u2713</b>US &amp; Canadian numbers</span>\n        <span><b>\u2713</b>The number isn't stored or shared</span>\n      </div>\n\n      <div class=\"result-zone\" id=\"resultZone\" aria-live=\"polite\">\n        <div class=\"state-empty\" id=\"stateEmpty\">\n          <div class=\"glyph\">\n            <svg width=\"21\" height=\"21\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#2B6AF0\" stroke-width=\"1.8\" aria-hidden=\"true\"><path d=\"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.25a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z\"/></svg>\n          </div>\n          Your result will appear here \u2014 the number's carrier, line type and region.\n        </div>\n      </div>\n    </section>";
    wire();
  }
  function wire(){
(function(){
  var card = document.getElementById("toolCard");
  var form = document.getElementById("lookupForm");
  var input = document.getElementById("phoneInput");
  var zone = document.getElementById("resultZone");

  var MEANING = {
    mobile:   "A regular cell phone line on a wireless carrier's network — attached to a SIM card, not an app.",
    landline: "A fixed home or office phone line. Some home phone services delivered over broadband also appear as VoIP.",
    voip:     "An internet phone line (Voice over Internet Protocol) — the kind used by texting apps and online phone services.",
    tollfree: "A toll-free number — free for the caller, and not tied to any place.",
    premium:  "A premium-rate number — calls are billed to the caller.",
    unknown:  "The public records don't give a line type for this block."
  };

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  function showLoading(){
    card.classList.add("loading");
    zone.innerHTML = '<div class="state-loading">Looking up the number <span class="dots"><i></i><i></i><i></i></span></div>';
  }

  function showError(r){
    card.classList.remove("loading");
    zone.innerHTML =
      '<div class="state-error"><div class="ic">!</div><div>' +
      '<h4>That number couldn\'t be checked</h4>' +
      '<p>' + esc(r && r.error ? r.error : "Something went wrong — please try again.") + '</p>' +
      '<p style="margin-top:6px">Tip: enter the 10 digits only, e.g. <strong>907 201 0142</strong>.</p>' +
      '</div></div>';
  }

  function showResult(r){
    card.classList.remove("loading");
    var badges =
      '<span class="badge ' + esc(r.lineType) + '"><span class="dot"></span>' + esc(r.lineTypeLabel) + '</span>' +
      (r.isAppNumber ? '<span class="badge app">App number</span>' : '');

    var rows = '';
    if (r.carrier) {
      rows += '<div class="rc-row"><dt>Carrier</dt><dd>' +
        '<div class="rc-val">' + esc(r.carrier) + '</div>' +
        (r.carrierLegal && r.carrierLegal !== r.carrier
          ? '<div class="rc-sub">Registered as ' + esc(r.carrierLegal) + '</div>' : '') +
        '</dd></div>';
    }
    rows += '<div class="rc-row"><dt>Line type</dt><dd>' +
      '<div class="rc-val">' + esc(r.lineTypeLabel) + '</div>' +
      '<div class="rc-sub">' + esc(MEANING[r.lineType] || MEANING.unknown) + '</div>' +
      '</dd></div>';
    if (r.region && (r.region.city || r.region.state)) {
      var place = [r.region.city, r.region.state].filter(Boolean).join(", ");
      rows += '<div class="rc-row"><dt>Region</dt><dd>' +
        '<div class="rc-val">' + esc(place) + (r.region.country ? ' · ' + esc(r.region.country) : '') + '</div>' +
        '<div class="rc-sub">The rate centre this number\'s block belongs to — it describes the number, not where the person using it is.</div>' +
        '</dd></div>';
    }
    if (r.areaCode && r.areaCode.timezone) {
      rows += '<div class="rc-row"><dt>Time zone</dt><dd>' +
        '<div class="rc-val" style="font-size:16px">' + esc(r.areaCode.timezone) + '</div>' +
        '<div class="rc-sub">Area code ' + esc(r.npa) + (r.prefix ? ' · Number block ' + esc(r.prefix) + ' (NPA-NXX)' : '') + '</div>' +
        '</dd></div>';
    } else if (r.prefix) {
      rows += '<div class="rc-row"><dt>Number block</dt><dd>' +
        '<div class="rc-val" style="font-size:16px">' + esc(r.prefix) + '</div>' +
        '<div class="rc-sub">The six-digit NPA-NXX block this number belongs to.</div>' +
        '</dd></div>';
    }

    var appStrip = '';
    if (r.isAppNumber) {
      appStrip = '<div class="app-strip"><b>Likely an app number.</b> This block is supplied by ' +
        esc(r.appFamily || "a wholesale app network") +
        (r.apps && r.apps.length ? ' — the network behind apps such as ' + esc(r.apps.join(", ")) : '') +
        '. Numbers like this come from an app, not a SIM card.</div>';
    }

    zone.innerHTML =
      '<div class="result-card">' +
        '<div class="rc-head"><div class="rc-number">' + esc(r.formatted) + '</div>' +
        '<div class="badges">' + badges + '</div></div>' +
        appStrip +
        '<dl class="rc-rows">' + rows + '</dl>' +
        '<div class="rc-note"><b>Good to know:</b> ' + esc(r.note) + '</div>' +
        '<div class="rc-src">Source: ' + esc(r.source) + '. The number you entered was checked in your browser and was not stored.</div>' +
      '</div>';
  }

  function run(){
    var v = input.value.trim();
    if (!v) { input.focus(); return; }
    if (typeof InstamberLookup === "undefined") {
      card.classList.remove("loading");
      showError({ error: "The lookup engine didn't load — please reload the page and try again." });
      return;
    }
    showLoading();
    InstamberLookup.lookup(v).then(function(r){
      if (!r.valid) showError(r); else showResult(r);
    }).catch(function(e){ showError({ error: e.message }); });
  }

  form.addEventListener("submit", function(ev){ ev.preventDefault(); run(); });

  /* Sample mode for the design review: ?n=9072010142 pre-fills and runs the lookup */
  var sample = new URLSearchParams(location.search).get("n");
  if (sample) {
    input.value = sample;
    if (typeof InstamberLookup === "undefined") {
      showError({ error: "The lookup engine didn't load — please reload the page and try again." });
    } else {
      InstamberLookup.ready().then(run);
    }
  }
})();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();