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
  function labelled(label, text) {
    var p = el("p");
    p.appendChild(el("b", "", label + ": "));
    p.appendChild(document.createTextNode(text));
    return p;
  }
  function figure(img, cls) {
    var f = el("figure", cls || "fig");
    var a = el("a");
    a.href = img.src;
    a.target = "_blank";
    a.rel = "noopener";
    var i = el("img");
    i.src = img.src;
    i.alt = img.alt || img.caption || "";
    i.loading = "lazy";
    a.appendChild(i);
    f.appendChild(a);
    if (has(img.caption)) f.appendChild(el("figcaption", "", img.caption));
    return f;
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
    document.title = d.name + " · " + d.title + " · Process portfolio";
    $("navName").textContent = d.name + " · Portfolio";
    $("footName").textContent = d.name;
    $("titleDim").textContent = d.title;
    $("titleLit").appendChild(el("span", "c", d.title));
    $("subtitle").textContent = d.subtitle;
    $("subDim").textContent = d.subtitle;
  }

  function renderConcept(d) {
    $("conceptLead").textContent = d.conceptLead;
    var card = el("article", "card cave");
    var tags = el("div");
    (d.concept.tags || []).forEach(function (t) { tags.appendChild(el("span", "tag", t)); });
    card.appendChild(tags);
    card.appendChild(el("p", "big", d.concept.text));
    $("conceptBox").appendChild(card);

    var g = $("factsGrid");
    d.facts.forEach(function (f) {
      var c = el("article", "card");
      c.appendChild(el("h3", "", f.title));
      if (has(f.text)) c.appendChild(el("p", "", f.text));
      if (f.list) {
        var ul = el("ul");
        f.list.forEach(function (t) { ul.appendChild(el("li", "", t)); });
        c.appendChild(ul);
      }
      if (has(f.quote)) c.appendChild(el("div", "q", f.quote));
      g.appendChild(c);
    });
  }

  function renderPersona(d) {
    var p = d.persona;
    var card = el("article", "card persona pcard");
    var left = el("figure", "face");
    var img = el("img");
    img.src = p.avatar;
    img.alt = "Illustration of " + p.name;
    left.appendChild(img);
    if (has(p.avatarNote)) left.appendChild(el("figcaption", "", p.avatarNote));
    var right = el("div");
    right.appendChild(el("h3", "", p.name));
    right.appendChild(el("p", "who", p.line));
    p.parts.forEach(function (x) { right.appendChild(labelled(x.label, x.text)); });
    if (has(p.insight)) right.appendChild(el("div", "q", p.insight));
    card.appendChild(left);
    card.appendChild(right);
    $("personaBox").appendChild(card);

    var g = $("journeyGrid");
    d.journey.forEach(function (j) {
      var c = el("article", "card");
      c.appendChild(el("h3", "", j.phase));
      c.appendChild(el("p", "", j.text));
      c.appendChild(el("p", "feel", j.feel));
      g.appendChild(c);
    });
    if (has(d.touchpoints)) $("touchLine").appendChild(labelled("Touchpoints", d.touchpoints));
    else $("touchLine").hidden = true;
  }

  function renderDirections(d) {
    $("directionsLead").textContent = d.directionsLead;
    var g = $("dirGrid");
    d.directions.forEach(function (x) {
      var c = el("article", "card dir");
      c.appendChild(el("h3", "", x.name));
      if (x.words && x.words.length) {
        var w = el("div", "words");
        x.words.forEach(function (t) { w.appendChild(el("span", "tag", t)); });
        c.appendChild(w);
      }
      c.appendChild(figure({ src: x.mark, alt: x.markAlt, caption: "" }, "mark " + (x.markBg || "dark")));
      c.appendChild(figure({ src: x.moodboard, alt: "Moodboard " + x.name, caption: "Moodboard" }, "fig mood"));
      g.appendChild(c);
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
      body.appendChild(el("p", "", entry.text));
      if (entry.images && entry.images.length) {
        var row = el("div", "figs");
        entry.images.forEach(function (im) { row.appendChild(figure(im)); });
        body.appendChild(row);
      }
      det.appendChild(body);
      list.appendChild(det);
    });
  }

  function renderAi(d) {
    var ul = $("aiList");
    (d.ai || []).forEach(function (s) { ul.appendChild(el("li", "", s)); });
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
      renderPersona(d);
      renderDirections(d);
      renderLog(d);
      renderAi(d);
    })
    .catch(showError);
})();
