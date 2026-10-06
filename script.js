(function () {
  "use strict";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function has(v) { return v && String(v).trim().length > 0; }
  function hideSection(id, navId) {
    $(id).hidden = true;
    if (navId) $(navId).hidden = true;
  }

  function initSpotlight() {
    var hero = $("hero");
    function move(x, y) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--x", (x - r.left) + "px");
      hero.style.setProperty("--y", (y - r.top) + "px");
    }
    hero.addEventListener("pointermove", function (e) { move(e.clientX, e.clientY); });
    hero.addEventListener("pointerdown", function (e) { move(e.clientX, e.clientY); });
  }

  function renderHero(d) {
    document.title = d.name + " · " + d.titleBefore + " " + d.titleAccent;
    $("navName").textContent = d.name + " · Portfolio";
    $("footName").textContent = d.name;
    $("titleDim").textContent = d.titleBefore + " " + d.titleAccent;
    var lit = $("titleLit");
    lit.textContent = d.titleBefore + " ";
    lit.appendChild(el("span", "c", d.titleAccent));
    $("subtitle").textContent = d.subtitle;
    $("subDim").textContent = d.subtitle;
  }

  function renderConcept(d) {
    $("conceptLead").textContent = d.conceptLead;
    var c = d.concept;
    var card = el("article", "card cave");
    card.appendChild(el("h3", "", c.name));
    var tags = el("div");
    (c.tags || []).forEach(function (t) { tags.appendChild(el("span", "tag", t)); });
    card.appendChild(tags);
    c.fields.forEach(function (f) {
      if (!has(f.text)) return;
      var p = el("p");
      p.appendChild(el("b", "", f.label + ": "));
      p.appendChild(document.createTextNode(f.text));
      card.appendChild(p);
    });
    if (has(c.hmw)) card.appendChild(el("div", "q", c.hmw));
    $("conceptGrid").appendChild(card);
  }

  function renderCause(d) {
    $("causeLead").textContent = d.causeLead;
    var c = d.cause;
    var card = el("article", "card cause");
    [["The issue", c.issue], ["Who is affected", c.who], ["Why now", c.whyNow], ["One doubt", c.doubt]].forEach(function (f) {
      if (!has(f[1])) return;
      var p = el("p");
      p.appendChild(el("b", "", f[0] + ": "));
      p.appendChild(document.createTextNode(f[1]));
      card.appendChild(p);
    });
    var hm = d.concept.hmw;
    if (has(hm)) card.appendChild(el("div", "q", hm));
    if (has(c.colour)) {
      var badge = el("p", "colour");
      badge.appendChild(el("span", "dot " + c.colour.toLowerCase()));
      badge.appendChild(document.createTextNode("Cause check: " + c.colour + (has(c.colourNote) ? ". " + c.colourNote : "")));
      card.appendChild(badge);
    }
    $("causeBox").appendChild(card);
  }

  function renderPersona(d) {
    var p = d.persona;
    $("personaLead").textContent = d.personaLead;
    var card = el("article", "card persona pcard");
    var left = el("figure", "face");
    if (has(p.avatar)) {
      var img = el("img");
      img.src = p.avatar;
      img.alt = "Illustration of " + p.name;
      left.appendChild(img);
      if (has(p.avatarNote)) left.appendChild(el("figcaption", "", p.avatarNote));
    }
    var right = el("div");
    right.appendChild(el("h3", "", p.name));
    right.appendChild(el("p", "who", p.line));
    p.parts.forEach(function (x) {
      var q = el("p");
      q.appendChild(el("b", "", x.label + ": "));
      q.appendChild(document.createTextNode(x.text));
      right.appendChild(q);
    });
    if (has(p.needs)) right.appendChild(el("div", "q", p.needs));
    if (p.insights && p.insights.length) {
      right.appendChild(el("h4", "ins", p.insightsTitle || "Insights"));
      var ul = el("ul");
      p.insights.forEach(function (i) { ul.appendChild(el("li", "", i)); });
      right.appendChild(ul);
    }
    card.appendChild(left);
    card.appendChild(right);
    $("personaBox").appendChild(card);
  }

  function renderEmpathy(d) {
    $("empathyLead").textContent = d.empathyLead;
    var g = $("empathyGrid");
    ["Says", "Thinks", "Does", "Feels"].forEach(function (k) {
      var card = el("article", "card");
      card.appendChild(el("h3", "", k));
      var ul = el("ul");
      (d.empathy[k] || []).forEach(function (t) { ul.appendChild(el("li", "", t)); });
      card.appendChild(ul);
      g.appendChild(card);
    });
  }

  function renderJourney(d) {
    $("journeyLead").textContent = d.journeyLead;
    var g = $("journeyGrid");
    d.journey.forEach(function (j) {
      var card = el("article", "card");
      card.appendChild(el("h3", "", j.phase));
      [["Does", j.do], ["Feels", j.feel], ["Needs", j.need]].forEach(function (f) {
        var p = el("p");
        p.appendChild(el("b", "", f[0] + ": "));
        p.appendChild(document.createTextNode(f[1]));
        card.appendChild(p);
      });
      card.appendChild(el("span", "tag touch", "Touchpoint: " + j.touchpoint));
      g.appendChild(card);
    });
  }

  function renderResearch(d) {
    if (!d.research || !d.research.length) { hideSection("research", "navResearch"); return; }
    if (has(d.researchLead)) $("researchLead").textContent = d.researchLead;
    var t = $("researchTable");
    var head = el("tr");
    head.appendChild(el("th", "", "Question"));
    head.appendChild(el("th", "", "What I found"));
    t.appendChild(head);
    d.research.forEach(function (row) {
      var tr = el("tr");
      var first = el("td");
      first.appendChild(el("b", "", row.label));
      tr.appendChild(first);
      tr.appendChild(el("td", "", row.text));
      t.appendChild(tr);
    });
  }

  function renderLog(d) {
    $("logLead").textContent = d.logLead;
    var list = $("logList");
    d.log.forEach(function (entry) {
      var det = el("details");
      if (entry.open) det.open = true;
      var sum = el("summary");
      sum.appendChild(el("b", "", entry.title));
      sum.appendChild(el("span", "", entry.date));
      det.appendChild(sum);
      var body = el("div", "entry");
      entry.sections.forEach(function (s) {
        if (!has(s.text)) return;
        var block = el("div");
        block.appendChild(el("h4", "", s.heading));
        block.appendChild(el("p", "", s.text));
        body.appendChild(block);
      });
      det.appendChild(body);
      list.appendChild(det);
    });
  }

  function renderSources(d) {
    if (!d.sources || !d.sources.length) { $("sourceBox").hidden = true; return; }
    var ul = $("sourceList");
    d.sources.forEach(function (s) { ul.appendChild(el("li", "", s)); });
  }

  function showError() {
    var box = el("div", "err");
    box.appendChild(el("h3", "", "data.json could not be loaded"));
    box.appendChild(el("p", "", "Browsers block loading data.json when you open index.html by double-clicking it. Open the site through a local server (for example the Live Server extension in VS Code) or upload it to a host like GitHub Pages or Netlify."));
    document.querySelector("main").prepend(box);
  }

  initSpotlight();
  fetch("data.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      renderHero(d);
      renderConcept(d);
      renderCause(d);
      renderPersona(d);
      renderEmpathy(d);
      renderJourney(d);
      renderResearch(d);
      renderLog(d);
      renderSources(d);
    })
    .catch(showError);
})();
