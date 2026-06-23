/* TechCam Hogar — motor compartido de landings (aire / electricidad / refacciones)
   Lee window.TC_CONFIG. Réplica vanilla del runtime de Claude Design + captura de lead.
   CSP-safe: sin inline handlers; POST sólo a la API del backend. */
(function () {
  "use strict";
  var C = window.TC_CONFIG || {};
  var API = "https://api.techcam.com.ar";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.querySelector("[data-root]");

  /* ---------- NAV ---------- */
  function applyNav() {
    var nav = document.querySelector("[data-nav]"); if (!nav) return;
    if (window.scrollY > 40) {
      nav.style.background = "rgba(11,16,18,.82)";
      nav.style.backdropFilter = nav.style.webkitBackdropFilter = "blur(16px)";
      nav.style.borderBottomColor = "rgba(255,255,255,.08)";
      nav.style.boxShadow = "0 10px 30px -18px rgba(0,0,0,.8)";
    } else {
      nav.style.background = "transparent";
      nav.style.backdropFilter = nav.style.webkitBackdropFilter = "none";
      nav.style.borderBottomColor = "transparent"; nav.style.boxShadow = "none";
    }
  }

  /* ---------- PARALLAX ---------- */
  var mx = 0, my = 0, praf = null;
  function parallax() {
    var sy = window.scrollY || 0;
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var f = parseFloat(el.getAttribute("data-parallax")) || 0;
      var tx = mx * 40 * f * 6, ty = (my * 40 * f * 6) + (sy * f);
      el.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0)";
    });
  }

  /* ---------- REVEAL ---------- */
  function initReveal() {
    var all = document.querySelectorAll("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      all.forEach(function (el) { el.style.setProperty("opacity", "1", "important"); }); return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target, d = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          el.style.animation = "tc-rise .8s cubic-bezier(.16,.84,.44,1) " + d + "ms both";
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    all.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        if (getComputedStyle(el).opacity === "0") el.style.setProperty("opacity", "1", "important");
      });
    }, 1400);
  }

  /* ---------- COUNTERS ---------- */
  function fmt(v, dec) { return dec > 0 ? v.toFixed(dec).replace(".", ",") : Math.round(v).toLocaleString("es-AR"); }
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0,
        dec = parseInt(el.getAttribute("data-decimals") || "0", 10),
        suf = el.getAttribute("data-suffix") || "", t0 = performance.now();
    (function tick(now) {
      var p = Math.min(1, (now - t0) / 1500), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e, dec) + suf;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target, dec) + suf;
    })(performance.now());
  }
  function initCounters() {
    var nodes = document.querySelectorAll("[data-counter]");
    if (!("IntersectionObserver" in window) || reduce) {
      nodes.forEach(function (el) { el.textContent = fmt(parseFloat(el.getAttribute("data-target")) || 0, parseInt(el.getAttribute("data-decimals") || "0", 10)) + (el.getAttribute("data-suffix") || ""); });
      return;
    }
    var cio = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nodes.forEach(function (n) { cio.observe(n); });
  }

  /* ---------- AIRFLOW CANVAS (hero) ---------- */
  function initCanvas() {
    var canvas = document.querySelector("[data-airflow]"); if (!canvas) return;
    var ctx = canvas.getContext("2d"); if (!ctx) return;
    var fx = C.fx || { streak: "37,224,208", dot: "160,232,226" };
    var w, h, dpr, raf = null;
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      var r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize(); window.addEventListener("resize", resize);
    var N = reduce ? 28 : 70, parts = [], streaks = [];
    for (var i = 0; i < N; i++) parts.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + 0.4, vx: Math.random() * 0.5 + 0.25, amp: Math.random() * 16 + 4, ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.012 + 0.004, a: Math.random() * 0.5 + 0.15 });
    for (var k = 0; k < 5; k++) streaks.push({ y: Math.random(), o: Math.random() * 0.04 + 0.02, sp: Math.random() * 0.3 + 0.15, x: Math.random() * w });
    function draw() {
      ctx.clearRect(0, 0, w, h);
      streaks.forEach(function (s) {
        s.x += s.sp; if (s.x > w + 200) s.x = -200; var y = s.y * h;
        var g = ctx.createLinearGradient(s.x - 160, 0, s.x + 160, 0);
        g.addColorStop(0, "rgba(" + fx.streak + ",0)"); g.addColorStop(0.5, "rgba(" + fx.streak + "," + s.o + ")"); g.addColorStop(1, "rgba(" + fx.streak + ",0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(s.x - 160, y);
        ctx.bezierCurveTo(s.x - 60, y - 14, s.x + 60, y + 14, s.x + 160, y); ctx.stroke();
      });
      parts.forEach(function (p) {
        p.x += p.vx; p.ph += p.sp; if (p.x > w + 10) { p.x = -10; p.y = Math.random() * h; }
        ctx.beginPath(); ctx.arc(p.x, p.y + Math.sin(p.ph) * p.amp, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + fx.dot + "," + p.a + ")"; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    if (reduce) { draw(); if (raf) cancelAnimationFrame(raf); } else draw();
  }

  /* ---------- MAP (Leaflet local + tiles CartoDB) ---------- */
  function initMap() {
    var el = document.querySelector("[data-map]"); if (!el || !window.L || !C.map) return;
    try {
      var m = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: true }).setView(C.map.center, C.map.zoom);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: "&copy; OpenStreetMap &copy; CARTO", subdomains: "abcd", maxZoom: 19 }).addTo(m);
      L.circle(C.map.center, { radius: C.map.radius || 24000, color: C.accent, weight: 1.4, fillColor: C.accent, fillOpacity: 0.1, dashArray: "6 8" }).addTo(m);
      setTimeout(function () { m.invalidateSize(); }, 300);
    } catch (e) { /* noop */ }
  }

  /* ---------- LIGHTBOX ---------- */
  var lb = document.querySelector("#tc-lightbox"), lbImg = lb && lb.querySelector("[data-lightbox-img]");
  function openLightbox(src) { if (!lb) return; if (src) { lbImg.src = src; lbImg.style.display = ""; } lb.hidden = false; document.body.classList.add("tc-noscroll"); }
  function closeLightbox() { if (!lb) return; lb.hidden = true; document.body.classList.remove("tc-noscroll"); }

  /* ---------- MENU ---------- */
  function setMenu(open) {
    if (root) root.classList.toggle("menu-open", open);
    document.body.classList.toggle("tc-noscroll", open);
    document.querySelectorAll('[data-action="menu-open"]').forEach(function (b) { b.setAttribute("aria-expanded", open ? "true" : "false"); });
  }

  /* ---------- WHATSAPP links ---------- */
  function waGenericUrl() { return C.wa ? ("https://wa.me/" + C.wa + "?text=" + encodeURIComponent(C.waGeneric || "Hola TechCam Hogar 👋")) : "#cotizador"; }
  function bindWa() { var u = waGenericUrl(); document.querySelectorAll("[data-wa]").forEach(function (a) { a.setAttribute("href", u); }); }

  /* ---------- HOVERS ---------- */
  function bindHovers() {
    document.querySelectorAll("[data-hov-in]").forEach(function (el) {
      var i = {}, o = {};
      try { i = JSON.parse(el.getAttribute("data-hov-in") || "{}"); } catch (_) {}
      try { o = JSON.parse(el.getAttribute("data-hov-out") || "{}"); } catch (_) {}
      el.addEventListener("mouseenter", function () { for (var k in i) el.style[k] = i[k]; });
      el.addEventListener("mouseleave", function () { for (var k in o) el.style[k] = o[k]; });
    });
  }

  /* ---------- FAQ ---------- */
  function renderFaq() {
    var host = document.querySelector("#tc-faq"); if (!host || !C.faqs) return;
    host.innerHTML = C.faqs.map(function (f, i) {
      return '<div data-faq style="border-bottom:1px solid rgba(11,16,18,.12)">'
        + '<button data-faq-toggle="' + i + '" aria-expanded="false" style="width:100%;text-align:left;background:none;border:0;cursor:pointer;padding:24px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;font-family:\'Archivo\',sans-serif;font-weight:700;font-size:clamp(17px,2.4vw,21px);letter-spacing:-.01em;color:#0C1416">'
        + esc(f.q)
        + '<span data-faq-icon style="flex:none;width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(11,16,18,.2);display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s,border-color .3s">'
        + '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#0C1416" stroke-width="2" stroke-linecap="round"/></svg></span></button>'
        + '<div data-faq-body style="overflow:hidden;max-height:0;opacity:0;transition:max-height .4s cubic-bezier(.4,0,.2,1),opacity .3s">'
        + '<p style="margin:0;padding:0 0 24px;font-size:15.5px;line-height:1.65;color:#54625F;max-width:680px">' + esc(f.a) + '</p></div></div>';
    }).join("");
    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-faq-toggle]"); if (!btn) return;
      var item = btn.closest("[data-faq]"), body = item.querySelector("[data-faq-body]"),
          icon = item.querySelector("[data-faq-icon]"), open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      if (open) { body.style.maxHeight = "0"; body.style.opacity = "0"; icon.style.transform = "rotate(0deg)"; icon.style.background = ""; icon.style.borderColor = "rgba(11,16,18,.2)"; }
      else { body.style.maxHeight = "320px"; body.style.opacity = "1"; icon.style.transform = "rotate(135deg)"; icon.style.background = "#0C1416"; icon.style.borderColor = "#0C1416"; icon.querySelector("path").setAttribute("stroke", C.accent); }
    });
  }

  /* ---------- QUIZ + LEAD ---------- */
  function initQuiz() {
    var host = document.querySelector("#tc-quiz"); if (!host || !C.steps) return;
    var st = { step: 0, answers: {}, done: false };
    var A = C.accent, INK = "#04100E";

    function answersLines() { return C.steps.map(function (s) { return "• " + s.label + ": " + (st.answers[s.key] || "—"); }).join("\n"); }
    function waMessage(nombre) { return (C.waQuizIntro || C.waGeneric || "Hola TechCam Hogar 👋") + "\n\n" + answersLines() + "\n\nMi nombre es: " + nombre; }

    function render() {
      if (st.done) { renderDone(); return; }
      var step = C.steps[st.step], canNext = !!st.answers[step.key], last = st.step >= C.steps.length - 1;
      var opts = step.options.map(function (o) {
        var sel = st.answers[step.key] === o.value;
        var card = sel ? "border-color:" + A + ";background:" + A + "12;box-shadow:0 0 0 1px " + A + ",0 12px 32px -16px " + A + "b3" : "border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.02)";
        var dot = sel ? "background:" + A + ";border-color:" + A : "background:transparent;border-color:rgba(255,255,255,.28)";
        return '<button data-pick="' + esc(o.value) + '" style="text-align:left;cursor:pointer;border:1px solid;border-radius:15px;padding:18px;transition:border-color .25s,background .25s,box-shadow .25s,transform .2s;display:flex;align-items:flex-start;gap:13px;color:#ECF3F2;' + card + '">'
          + '<span style="flex:none;margin-top:2px;width:20px;height:20px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;' + dot + '">'
          + (sel ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="#04100E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' : "")
          + '</span><span><span style="display:block;font-family:\'Archivo\',sans-serif;font-weight:600;font-size:16px;line-height:1.2">' + esc(o.label) + '</span><span style="display:block;font-size:13px;color:#8FA0A1;margin-top:4px;line-height:1.4">' + esc(o.desc) + '</span></span></button>';
      }).join("");
      host.innerHTML = '<div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'
        + '<span style="font-family:\'Space Mono\',monospace;font-size:13px;letter-spacing:.14em;color:' + A + '">0' + (st.step + 1) + " / 0" + C.steps.length + "</span>"
        + '<span style="font-family:\'Space Mono\',monospace;font-size:12px;letter-spacing:.1em;color:#7E9091;text-transform:uppercase">' + esc(step.label) + "</span></div>"
        + '<div style="height:4px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-bottom:30px"><div style="height:100%;background:linear-gradient(90deg,' + A + '99,' + A + ');border-radius:4px;transition:width .45s cubic-bezier(.5,.1,.1,1);width:' + ((st.step + 1) / C.steps.length * 100) + '%"></div></div>'
        + '<h3 style="font-family:\'Archivo\',sans-serif;font-weight:700;font-size:clamp(22px,3.2vw,30px);letter-spacing:-.02em;margin:0 0 24px">' + esc(step.q) + "</h3>"
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:13px;margin-bottom:30px">' + opts + "</div>"
        + '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap">'
        + (st.step > 0 ? '<button data-back style="background:transparent;border:1px solid rgba(255,255,255,.16);color:#C4D0D0;font-weight:600;font-size:14.5px;padding:13px 20px;border-radius:12px;cursor:pointer;display:inline-flex;align-items:center;gap:8px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="#C4D0D0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Atrás</button>' : "<span></span>")
        + '<button data-next style="margin-left:auto;border:0;font-weight:700;font-size:15px;padding:14px 26px;border-radius:12px;cursor:' + (canNext ? "pointer" : "not-allowed") + ';display:inline-flex;align-items:center;gap:9px;transition:transform .2s;' + (canNext ? "background:" + A + ";color:" + INK : "background:rgba(255,255,255,.07);color:#5b6a6b") + '">' + (last ? "Ver mi presupuesto" : "Siguiente") + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>';
    }

    function renderDone() {
      var rows = C.steps.map(function (s) {
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.06)"><span style="font-family:\'Space Mono\',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7E9091">' + esc(s.label) + '</span><span style="font-weight:600;font-size:15px;color:#ECF3F2;text-align:right">' + esc(st.answers[s.key] || "—") + "</span></div>";
      }).join("");
      var field = function (label, id, type, ph, extra) {
        return '<label style="display:block"><span style="display:block;font-family:\'Space Mono\',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#7E9091;margin-bottom:7px">' + label + '</span>'
          + '<input id="' + id + '" type="' + type + '" placeholder="' + ph + '" ' + (extra || "") + ' style="width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:14px 15px;color:#ECF3F2;font-size:15px;font-family:\'Hanken Grotesk\',sans-serif"></label>';
      };
      host.innerHTML = '<div style="animation:tc-rise .5s ease">'
        + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:22px"><span style="width:48px;height:48px;border-radius:14px;background:' + A + '24;display:flex;align-items:center;justify-content:center;flex:none"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="' + A + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div><h3 style="font-family:\'Archivo\',sans-serif;font-weight:800;font-size:clamp(22px,3.4vw,30px);letter-spacing:-.02em;margin:0">Listo, ya armamos tu consulta</h3><p style="margin:4px 0 0;color:#8FA0A1;font-size:14.5px">Dejanos tu nombre y WhatsApp y te respondemos con el presupuesto.</p></div></div>'
        + '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:8px 6px;margin-bottom:22px">' + rows + "</div>"
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:8px">' + field("Tu nombre", "lead-nombre", "text", "Nombre y apellido", 'autocomplete="name"') + field("Tu WhatsApp", "lead-wa", "tel", "11 1234 5678", 'autocomplete="tel" inputmode="tel"') + "</div>"
        /* honeypot anti-bot: oculto, fuera del flujo de tab */
        + '<div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"><label>No completar este campo<input id="lead-hp" type="text" tabindex="-1" autocomplete="off"></label></div>'
        + '<p data-lead-error style="display:none;color:#ff9d9d;font-size:13.5px;margin:4px 2px 0"></p>'
        + '<button data-send style="margin-top:14px;width:100%;display:flex;align-items:center;justify-content:center;gap:11px;background:#FF9D2E;color:#1A1206;font-weight:700;font-size:17px;padding:18px;border:0;border-radius:14px;cursor:pointer;box-shadow:0 18px 40px -16px rgba(255,157,46,.8)"><svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1206"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.76.46 3.45 1.34 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z"/></svg>Enviar consulta por WhatsApp</button>'
        + '<div style="display:flex;justify-content:center;gap:22px;margin-top:18px"><button data-edit style="background:none;border:0;color:#9FB0B1;font-size:14px;cursor:pointer;text-decoration:underline;text-underline-offset:3px">Editar respuestas</button><button data-reset style="background:none;border:0;color:#9FB0B1;font-size:14px;cursor:pointer;text-decoration:underline;text-underline-offset:3px">Empezar de nuevo</button></div></div>';
    }

    function renderSent(nombre) {
      host.innerHTML = '<div style="animation:tc-rise .5s ease;text-align:center;padding:18px 6px">'
        + '<span style="display:inline-flex;width:60px;height:60px;border-radius:50%;background:' + A + '24;align-items:center;justify-content:center;margin-bottom:18px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="' + A + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
        + '<h3 style="font-family:\'Archivo\',sans-serif;font-weight:800;font-size:clamp(22px,3.4vw,28px);margin:0 0 8px">¡Gracias' + (nombre ? ", " + esc(nombre) : "") + '!</h3>'
        + '<p style="color:#9FB0B1;font-size:15px;max-width:420px;margin:0 auto 6px;line-height:1.55">Abrimos WhatsApp con tu consulta y registramos tu pedido. Si no se abrió, escribinos directamente.</p>'
        + '<a href="' + waGenericUrl() + '" target="_blank" rel="noopener" style="display:inline-flex;margin-top:14px;align-items:center;gap:9px;color:' + A + ';font-weight:700;text-decoration:none">Abrir WhatsApp →</a></div>';
    }

    function submit() {
      var nombre = (host.querySelector("#lead-nombre").value || "").trim();
      var wa = (host.querySelector("#lead-wa").value || "").trim();
      var hp = (host.querySelector("#lead-hp").value || "").trim();
      var err = host.querySelector("[data-lead-error]");
      var digits = wa.replace(/[^0-9]/g, "");
      if (!nombre) { showErr(err, "Ingresá tu nombre."); return; }
      if (digits.length < 8) { showErr(err, "Ingresá un WhatsApp válido."); return; }
      if (hp) { renderSent(nombre); return; } /* bot: descartar en silencio */
      /* abre WhatsApp de forma síncrona (gesto del usuario) */
      window.open("https://wa.me/" + C.wa + "?text=" + encodeURIComponent(waMessage(nombre)), "_blank", "noopener");
      /* registra el lead en el backend (no bloquea) */
      try {
        fetch(API + "/api/leads", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nombre, whatsapp: digits, motivo: (C.servicio || "Consulta") + " — " + answersLines().replace(/\n/g, " / "), website: hp })
        }).catch(function () {});
      } catch (e) {}
      renderSent(nombre);
    }
    function showErr(el, msg) { el.textContent = msg; el.style.display = "block"; }

    host.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t || !host.contains(t)) return;
      if (t.hasAttribute("data-pick")) { st.answers[C.steps[st.step].key] = t.getAttribute("data-pick"); render(); }
      else if (t.hasAttribute("data-next")) { if (st.answers[C.steps[st.step].key]) { if (st.step >= C.steps.length - 1) st.done = true; else st.step++; render(); } }
      else if (t.hasAttribute("data-back")) { st.step = Math.max(0, st.step - 1); render(); }
      else if (t.hasAttribute("data-edit")) { st.done = false; st.step = 0; render(); }
      else if (t.hasAttribute("data-reset")) { st.done = false; st.step = 0; st.answers = {}; render(); }
      else if (t.hasAttribute("data-send")) { submit(); }
    });
    render();
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- INIT ---------- */
  function init() {
    applyNav();
    window.addEventListener("scroll", function () { applyNav(); if (!reduce) parallax(); }, { passive: true });
    if (!reduce) window.addEventListener("mousemove", function (e) { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; if (!praf) praf = requestAnimationFrame(function () { praf = null; parallax(); }); });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (lb && !lb.hidden) closeLightbox(); else setMenu(false); } });
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-action]"); if (!t) return;
      var a = t.getAttribute("data-action");
      if (a === "menu-open") setMenu(true);
      else if (a === "menu-close") setMenu(false);
      else if (a === "lightbox") { var img = t.querySelector("img"); openLightbox(img && img.getAttribute("src")); }
      else if (a === "lightbox-close") { if (e.target === t || e.target.closest("[data-action='lightbox-close']") === t) closeLightbox(); }
    });
    initReveal(); initCounters(); initCanvas(); initMap();
    bindWa(); bindHovers(); renderFaq(); initQuiz();
    setMenu(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
