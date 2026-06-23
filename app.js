/* TechCam Hogar — Portal "La Casa Viva"
   Lógica vanilla (sin runtime propietario). Réplica fiel del .dc.html de Claude Design.
   CSP-safe: sin handlers inline; todo se ata por listeners. */
(function () {
  "use strict";

  /* ---- Contacto (configurable; verificado del portal TechCam previo) ---- */
  var WA_NUMBER = "5491178298512";
  var WA_TEXT = "Hola TechCam Hogar 👋 Quiero hacer una consulta.";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================ NAV (scroll) ============================ */
  function applyNav() {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.style.background = "rgba(11,16,18,.82)";
      nav.style.backdropFilter = "blur(16px)";
      nav.style.webkitBackdropFilter = "blur(16px)";
      nav.style.borderBottomColor = "rgba(255,255,255,.08)";
      nav.style.boxShadow = "0 10px 30px -18px rgba(0,0,0,.8)";
    } else {
      nav.style.background = "transparent";
      nav.style.backdropFilter = "none";
      nav.style.webkitBackdropFilter = "none";
      nav.style.borderBottomColor = "transparent";
      nav.style.boxShadow = "none";
    }
  }

  /* ============================ PARALLAX ============================ */
  var mx = 0, my = 0, praf = null;
  function parallax() {
    var els = document.querySelectorAll("[data-depth]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var f = parseFloat(el.getAttribute("data-depth")) || 0;
      el.style.transform = "translate(" + (mx * 26 * f).toFixed(1) + "px," + (my * 20 * f).toFixed(1) + "px)";
    }
  }

  /* ============================ REVEAL ============================ */
  function initReveal() {
    var all = document.querySelectorAll("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      all.forEach(function (el) { el.style.setProperty("opacity", "1", "important"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var d = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          el.style.animation = "pf-rise .8s cubic-bezier(.16,.84,.44,1) " + d + "ms both";
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    all.forEach(function (el) { io.observe(el); });
    /* red de seguridad: si algo no disparó, forzar visible */
    setTimeout(function () {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        if (getComputedStyle(el).opacity === "0") el.style.setProperty("opacity", "1", "important");
      });
    }, 1500);
  }

  /* ============================ COUNTERS ============================ */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1500, t0 = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString("es-AR") + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = Math.round(target).toLocaleString("es-AR") + suffix;
    }
    requestAnimationFrame(tick);
  }
  function initCounters() {
    var nodes = document.querySelectorAll("[data-counter]");
    if (!("IntersectionObserver" in window) || reduce) {
      nodes.forEach(function (el) {
        el.textContent = (parseFloat(el.getAttribute("data-target")) || 0).toLocaleString("es-AR") + (el.getAttribute("data-suffix") || "");
      });
      return;
    }
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nodes.forEach(function (n) { cio.observe(n); });
  }

  /* ============================ ZONAS (casa viva) ============================ */
  var Z = {
    "z-aire":  { state: "is-aire",  freq: 660, color: "#25E0D0", kicker: "Zona fría", title: "Aire acondicionado", sub: "Frío y calor, instalado prolijo." },
    "z-elec":  { state: "is-elec",  freq: 440, color: "#FFD23F", kicker: "Energía",   title: "Electricidad",        sub: "Instalaciones seguras y al día." },
    "z-refac": { state: "is-refac", freq: 294, color: "#C65D3B", kicker: "En obra",   title: "Refacciones",         sub: "Una cuadrilla para toda la obra." }
  };
  function bindZones() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) return;
    var scene = document.querySelector("#pf-scene");
    var board = scene && scene.querySelector("[data-board]");
    function q(s) { return board && board.querySelector(s); }
    function showService(d) {
      if (!board) return;
      var dot = q("[data-board-dot]");
      if (dot) { dot.style.background = d.color; dot.style.boxShadow = "0 0 9px " + d.color; }
      var k = q("[data-board-kicker]"); if (k) k.textContent = d.kicker;
      var t = q("[data-board-title]");  if (t) t.textContent = d.title;
      var s = q("[data-board-sub]");    if (s) s.textContent = d.sub;
      var c = q("[data-board-cta]");    if (c) c.style.color = d.color;
      var bg = q("[data-board-bg]");    if (bg) bg.style.borderColor = d.color + "55";
      board.style.opacity = "1";
      board.style.transform = "translateX(0)";
    }
    function showDefault() {
      if (!board) return;
      board.style.opacity = "0";
      board.style.transform = "translateX(-10px)";
    }
    Object.keys(Z).forEach(function (cls) {
      var z = document.querySelector("." + cls);
      if (!z) return;
      var d = Z[cls];
      var on = function () {
        hero.classList.remove("is-aire", "is-elec", "is-refac");
        hero.classList.add(d.state);
        showService(d);
        blip(d.freq);
      };
      var off = function () { hero.classList.remove(d.state); showDefault(); };
      z.addEventListener("mouseenter", on);
      z.addEventListener("mouseleave", off);
      z.addEventListener("focusin", on);
      z.addEventListener("focusout", off);
    });
    var biblio = document.querySelector(".biblio-hot");
    if (biblio) {
      biblio.addEventListener("mouseenter", function () { hero.classList.add("is-biblio"); });
      biblio.addEventListener("mouseleave", function () { hero.classList.remove("is-biblio"); });
    }
  }

  /* ============================ AUDIO (generado, off por defecto) ============================ */
  var actx = null, master = null, soundOn = false;
  function initAudio() {
    if (actx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    master = actx.createGain();
    master.gain.value = 0;
    master.connect(actx.destination);
    var pad = actx.createGain(); pad.gain.value = 0.5; pad.connect(master);
    var lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.connect(pad);
    [82.4, 110, 164.8].forEach(function (f, i) {
      var o = actx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      var g = actx.createGain(); g.gain.value = i === 0 ? 0.5 : 0.28;
      o.connect(g); g.connect(lp); o.start();
    });
    var lfo = actx.createOscillator(); lfo.frequency.value = 0.07;
    var lfg = actx.createGain(); lfg.gain.value = 90;
    lfo.connect(lfg); lfg.connect(lp.frequency); lfo.start();
  }
  function toggleSound() {
    initAudio();
    if (!actx) return;
    if (actx.state === "suspended") actx.resume();
    soundOn = !soundOn;
    var t = actx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.linearRampToValueAtTime(soundOn ? 0.05 : 0, t + 0.6);
    updateSoundUI();
  }
  function blip(freq) {
    if (!soundOn || !actx) return;
    var t = actx.currentTime;
    var o = actx.createOscillator(); o.type = "sine"; o.frequency.value = freq;
    var g = actx.createGain(); g.gain.value = 0;
    o.connect(g); g.connect(master);
    g.gain.linearRampToValueAtTime(0.6, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.42);
    o.start(t); o.stop(t + 0.46);
  }
  var ICON_ON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9H4z" stroke="#25E0D0" stroke-width="1.7" stroke-linejoin="round"/><path d="M16 9c1 1 1 5 0 6M18.5 7c2 2 2 8 0 10" stroke="#25E0D0" stroke-width="1.7" stroke-linecap="round"/></svg>';
  var ICON_OFF = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  function updateSoundUI() {
    document.querySelectorAll("[data-sound-icon]").forEach(function (s) { s.innerHTML = soundOn ? ICON_ON : ICON_OFF; });
    document.querySelectorAll("[data-sound-label]").forEach(function (s) { s.textContent = soundOn ? "Sonido" : "Silencio"; });
    document.querySelectorAll("[data-sound-btn]").forEach(function (b) {
      b.setAttribute("aria-pressed", soundOn ? "true" : "false");
      b.setAttribute("aria-label", soundOn ? "Silenciar ambiente sonoro" : "Activar ambiente sonoro");
    });
  }

  /* ============================ MENÚ MOBILE ============================ */
  function setMenu(open) {
    var hero = document.querySelector("[data-hero]");
    if (hero) hero.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    document.querySelectorAll('[data-action="menu-open"]').forEach(function (b) {
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ============================ HOVER (data-hov-in/out) ============================ */
  function bindHovers() {
    document.querySelectorAll("[data-hov-in]").forEach(function (el) {
      var i = {}, o = {};
      try { i = JSON.parse(el.getAttribute("data-hov-in") || "{}"); } catch (_) {}
      try { o = JSON.parse(el.getAttribute("data-hov-out") || "{}"); } catch (_) {}
      el.addEventListener("mouseenter", function () { for (var k in i) el.style[k] = i[k]; });
      el.addEventListener("mouseleave", function () { for (var k in o) el.style[k] = o[k]; });
    });
  }

  /* ============================ WHATSAPP ============================ */
  function bindWa() {
    var href = WA_NUMBER ? ("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_TEXT)) : "#contacto";
    document.querySelectorAll("[data-wa]").forEach(function (a) { a.setAttribute("href", href); });
  }

  /* ============================ INIT ============================ */
  function init() {
    applyNav();
    window.addEventListener("scroll", function () { applyNav(); if (!reduce) parallax(); }, { passive: true });
    if (!reduce) {
      window.addEventListener("mousemove", function (e) {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
        if (!praf) praf = requestAnimationFrame(function () { praf = null; parallax(); });
      });
    }
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-action]") : null;
      if (!t) return;
      var a = t.getAttribute("data-action");
      if (a === "sound") toggleSound();
      else if (a === "menu-open") setMenu(true);
      else if (a === "menu-close") setMenu(false);
    });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    initReveal();
    initCounters();
    bindZones();
    bindHovers();
    bindWa();
    updateSoundUI();
    setMenu(false);

    if (window.matchMedia && window.matchMedia("(max-width: 879px)").matches) {
      var h = document.querySelector(".hint-d");
      if (h) h.textContent = "Tocá una habitación para ver el servicio";
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
