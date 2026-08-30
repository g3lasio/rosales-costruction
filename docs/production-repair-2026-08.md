# Reparación de producción — entrega de imágenes y validación completa

Fecha: 2026-08-30 · Alcance: solicitud "pulida, validación y corrección" para Railway.

## Qué estaba roto

Las 15 imágenes del sitio se referenciaban bajo `/manus-storage/...`, una ruta del entorno de desarrollo anterior. Esa ruta depende de un proxy (`server/_core/storageProxy.ts`) que necesita credenciales `BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY`, que no existen (ni deben existir) en Railway. Resultado: **HTTP 500 en las 15 rutas** — hero, tarjetas de servicio, proyectos, comparador antes/después, cronología, logo y previews sociales sin origen válido.

## Qué se corrigió

1. **Migración completa a `/images/...`** — `client/src/lib/site-content.ts` y `client/src/ssr/prefetch.ts` ya no contienen ninguna ruta `/manus-storage/`. Los archivos viven en `client/public/images/` con nombres semánticos (`paver-driveway-hero.webp`, `front-approach-before.webp`, etc.) y se sirven como estáticos por Express. Un test nuevo (`server/assets.integrity.test.ts`) falla si alguna referencia `/manus-storage/` reaparece o si falta un archivo referenciado.
2. **Compatibilidad con URLs antiguas** — `server/assetRedirects.ts` redirige con 301 cada una de las 15 claves antiguas de `/manus-storage/` a su ruta nueva (HTML cacheado, previews sociales y marcadores siguen funcionando). Claves desconocidas ahora responden 404 en lugar de 500.
3. **Pipeline de recuperación de las fotos reales** — `pnpm fetch:assets` (`scripts/fetch-assets.mjs` + `scripts/asset-manifest.json`) descarga cada foto original desde la primera fuente disponible, la optimiza con sharp (resize + WebP q80) y la escribe con el nombre final:
   - una carpeta local (`--from-dir <carpeta>`),
   - el storage de Manus/Forge (si exportas `BUILT_IN_FORGE_API_URL`/`KEY` del entorno anterior),
   - la biblioteca de medios pública del WordPress legado (`rosaleslandscapingandconstruction.com`, configurable con `WP_ORIGIN`).
   `pnpm fetch:assets --check` reporta qué archivos ya son fotografía real.
4. **Placeholders de marca temporales** — este entorno de trabajo no tiene salida de red hacia Railway, el WordPress legado ni el storage de Manus, así que los binarios de las fotos no pudieron recuperarse desde aquí. Para que producción quede estable ya (todo 200, cero saltos de layout), cada ruta `/images/...` tiene un placeholder ligero con la identidad de Rosales generado por `scripts/generate-placeholders.mjs`. Cada placeholder lleva el marcador binario `rosales-placeholder`: `fetch:assets` los distingue de las fotos reales y los sustituye sin tocar fotografía verdadera. Los pares reales del comparador antes/después no se sustituyen por fotos genéricas: sus dos rutas quedan reservadas y etiquetadas en el manifiesto.
5. **Header y CTA fijos reparados (causa raíz)** — `.site-shell { overflow: hidden }` y `body { overflow-x: hidden }` convertían el shell en contenedor de recorte y anulaban el `position: sticky` del header: el header de marca y el CTA de estimado **desaparecían al hacer scroll** en desktop y móvil. Se cambió a `overflow-x: clip`, que recorta el desborde horizontal sin romper sticky. Verificado con navegador real en 390 y 1440 px.
6. **367 KB de peso muerto eliminados de cada página** — `vite-plugin-manus-runtime` incrustaba ~350 KB de tooling del preview de Manus dentro del `index.html` de producción (~105 KB gzip enviados en cada respuesta SSR). Los plugins de Manus ahora son solo de desarrollo: `index.html` pasó de 367 KB a 0.5 KB.
7. **Petición rota de analytics eliminada** — `index.html` incluía un script con placeholders `%VITE_ANALYTICS_ENDPOINT%` sin valor en Railway, generando una petición fallida en cada carga de página. Eliminado; un test lo vigila.
8. **Entrega de imágenes pulida** — `loading="lazy"` + `decoding="async"` fuera de los heros, `fetchPriority="high"` en los heros, dimensiones intrínsecas en el logo, `og:image` siempre absoluta (basada en `CANONICAL_ORIGIN`) también al navegar en cliente.
9. **Test roto de entorno anterior corregido** — `vite.styles.test.ts` dependía de la ruta `/home/ubuntu/rosales-premium-website/...` de la máquina de desarrollo anterior y no podía pasar en ningún otro entorno; ahora usa un fixture temporal propio.

## Qué falta para el 10/10 visual

**Actualización: la hidratación ahora es automática en cada deploy.** `pnpm build` ejecuta primero `node scripts/fetch-assets.mjs --best-effort`: en Railway (que sí tiene internet) descarga las fotos reales desde el WordPress legado antes de compilar, así el deploy sale con la fotografía real sin ningún paso manual. Si alguna foto no es recuperable en línea (por ejemplo el par antes/después generado fuera de WordPress), esa ruta conserva el placeholder hasta hidratarla manualmente.

Para dejarlas fijadas en el repositorio (recomendado, elimina la dependencia del sitio legado), un solo paso desde cualquier máquina con internet normal:

```bash
pnpm install
pnpm fetch:assets            # recupera y optimiza las 15 fotos reales
pnpm fetch:assets --check    # debe reportar 15/15
git add client/public/images && git commit -m "Hydrate real project photography" && git push
```

Si alguna foto no se recupera automáticamente, colócala en una carpeta y ejecuta `pnpm fetch:assets --from-dir <carpeta>` (acepta el nombre final, la clave de Manus o el nombre original de WordPress; ver `scripts/asset-manifest.json`).

## Resultados de validación (build de producción local)

| Comprobación | Resultado |
|---|---|
| `pnpm check` | ✅ sin errores |
| `pnpm test` | ✅ 17 pasan, 3 skip deliberados (tests vivos de LeadPrime) |
| `pnpm build` | ✅ cliente + SSR + servidor |
| `RUN_SSR_INTEGRATION=true pnpm vitest run server/ssr.production.integration.test.ts` | ✅ |
| Rutas `/images/*` (15) | ✅ HTTP 200 |
| `/manus-storage/<clave antigua>` | ✅ 301 → `/images/...`; clave desconocida → 404 |
| SSR de `/`, `/services/pavers`, `/terms` | ✅ HTML con título, canonical, stylesheet y og:image absoluta |
| `robots.txt`, `sitemap.xml`, `llms.txt`, redirecciones legadas | ✅ 200 / 301 conservadas |
| Consola y red (11 páginas × 390/768/1280/1440 px, Chromium) | ✅ 0 errores de consola, 0 peticiones fallidas, 0 imágenes rotas |
| Overflow horizontal en 390/768/1280/1440 px | ✅ ninguno |
| Header + CTA visibles durante el scroll (desktop y móvil) | ✅ |
| Inglés inicial, toggle ES persistente (navegación y recarga) | ✅ |
| Formulario (validación, honeypot, timing, UTM, consentimiento SMS) | ✅ código verificado + tests de validación existentes |
| LeadPrime | ✅ token de embed vía tRPC, webhook solo en servidor (test de frontera de secretos pasa) |

Nota: la validación en navegador se hizo contra el build de producción servido localmente (`NODE_ENV=production node dist/index.js`), porque este entorno de trabajo no tiene salida de red hacia `rosales-costruction.up.railway.app`. Tras el deploy, verificar en Railway: carga de `/`, una página de servicio y `/terms`; y que `/images/paver-driveway-hero.webp` responde 200.

## Capturas

`docs/screenshots/` — build de producción local: portada desktop (1440 px, página completa), página de servicio, proyectos, portada móvil (390 px, página completa) y contacto móvil.

## Variables de Railway

Sin cambios: `LEADPRIME_EMBED_TOKEN`, `LEADPRIME_WEBHOOK_URL`, `CANONICAL_ORIGIN`, `SITE_NAME`. Ningún valor sensible aparece en commits, logs ni documentación.
