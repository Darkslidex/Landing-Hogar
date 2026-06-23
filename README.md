# Landing-Hogar — TechCam Hogar

Portal "La Casa Viva" + 3 landings (aire, electricidad, refacciones) para TechCam Hogar.
Sitio estático servido por nginx en Coolify (bunker).

- **Stack:** HTML5 + CSS (inline + fuentes locales) + JavaScript vanilla. Sin frameworks, sin CDNs.
- **Build:** `Dockerfile` (nginx:alpine) con `nginx.conf` propio (headers de seguridad + CSP).
- **Dominio previsto:** https://hogar.techcam.com.ar
- **Backend de leads:** `POST https://api.techcam.com.ar/api/leads` (lo usan los cotizadores de las landings).
- **Origen del diseño:** proyecto de Claude Design `d159b273…` (`TechCam Hogar - Portal.dc.html` y las 3 sub-páginas), recreado como estático puro sin el runtime propietario (`x-dc`/`sc-for`/`{{}}`/`image-slot`).

## Estructura

```
index.html              Portal "La Casa Viva" (casa interactiva + fallback mobile/reduced-motion)
app.js                  Lógica vanilla del portal (parallax, zonas, audio, menú, reveal, counters)
aire/                   Landing aire acondicionado (index.html + config.js + assets/)
electricidad/           Landing electricidad
refacciones/            Landing refacciones
assets/
  casa-hogar.png        Imagen de la casa del portal (1672×941)
  fonts.css + fonts/    @font-face locales (Archivo, Hanken Grotesk, Space Mono · subset latin)
  landing.js            Motor compartido de las 3 landings (quiz, FAQ, lightbox, mapa, lead)
  vendor/leaflet/       Leaflet 1.9.4 local (mapa de cobertura)
nginx.conf              Headers de seguridad + CSP + cache
Dockerfile              nginx:alpine
_src-design/            Fuentes .dc.html originales (referencia; no se sirven)
```

Las 3 landings comparten `assets/landing.js` (lee `<slug>/config.js`). El cotizador es un quiz
de 4 pasos que captura nombre + WhatsApp (con honeypot), hace `POST /api/leads` y abre `wa.me`.

## Seguridad

- CSP: `default-src 'none'`; `script-src 'self'` (sin `unsafe-inline`); `style-src 'self' 'unsafe-inline'`; `font-src 'self'`; `img-src 'self' data:`; `connect-src`/`form-action` → solo `https://api.techcam.com.ar`.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
- Sin secretos en el repo. El número de WhatsApp se configura en `app.js` (`WA_NUMBER`).
- Los forms (en las landings) llevan honeypot; rate-limit y cifrado del WhatsApp los hace el backend.

## Desarrollo local

```bash
python3 -m http.server 8099   # http://localhost:8099
```

## Estado

- [x] Portal + 3 landings recreados como estático puro y verificados en headless (0 errores de consola, CSP enforced, mobile + desktop).
- [x] Cotizadores conectados a `POST /api/leads` (+ honeypot) y `wa.me` (probado con backend mockeado).

## Deploy (EN PRODUCCIÓN ✅)

- **Repo:** `Darkslidex/Landing-Hogar` (público; servible por Coolify sin credenciales).
- **Coolify app UUID:** `ghwpa7t7b9eb1lclcv5f1cq2` · Build Pack: Dockerfile · puerto `${PORT:-80}` (Coolify inyecta 3000).
- **Dominios:** https://hogar.techcam.com.ar + `/aire/` `/electricidad/` `/refacciones/` (HTTP 200, SSL Let's Encrypt, Cloudflare proxy).
- **ALLOWED_ORIGINS** del backend: se agregó `https://hogar.techcam.com.ar` (sin wildcard). `.env` con backup; contenedor `backend-leads` recreado.
- **Contrato de leads** (verificado contra el backend real): `POST /api/leads` con
  `{ cliente_id, nombre, whatsapp, motivo, fuente_url, hp }`. `cliente_id` = `hogar-aire` / `hogar-electricidad` / `hogar-refacciones`. `vertical` → default `otro`. Honeypot = `hp`. Email de aviso → `info@techcam.com.ar` (NOTIFY_EMAIL del backend).
- **Verificado:** 0 errores de consola (4 páginas × desktop/mobile), CSP + headers, cotizador end-to-end (200 `success:true`, lead registrado + email).

## Pendientes (contenido — revisar antes de promocionar)

- [ ] **Testimonios** (Mariana G., Diego R., Lucía P.) vienen del diseño como *placeholder* — reemplazar por reales.
- [ ] Galería de aire: solo 2 fotos reales disponibles (las demás del diseño eran stock y se quitaron).
- [ ] Revisar que los *captions* de galería (elec/refac) coincidan con cada foto real.
