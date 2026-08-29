# Integration and Deployment Plan

## LeadPrime integration contract

The client application never receives the LeadPrime webhook URL. The browser submits an estimate request to the public `lead.submitEstimate` application procedure. Server code validates and normalizes the request, enforces the honeypot and minimum-time controls, enriches the request with the page and UTM context, and forwards it to the LeadPrime webhook stored only in `LEADPRIME_WEBHOOK_URL`.

The client receives no webhook credential. The LeadPrime Embed Kit token is read by the application server and made available only to the official widget bootstrap mechanism. The token is not hardcoded in source control. As an embed token is necessarily passed to the authorized widget at runtime, it should be treated as a publishable integration identifier and rotated in LeadPrime if unauthorized use is suspected; the webhook URL remains private.

### Delivery behavior

| Event | Server behavior | Visitor-facing behavior | Operational action |
|---|---|---|---|
| Valid estimate submission | Sends normalized data, service, page URL, optional SMS consent and UTM fields to LeadPrime. | Shows an accessible success confirmation. | Confirm the lead appears in LeadPrime. |
| Invalid required fields | Rejects the request before any external call. | Identifies the missing contact method. | No lead is created. |
| Honeypot or too-fast submit | Silently accepts honeypot traffic or rejects implausibly fast submissions. | No customer data is forwarded. | Review only if bot activity becomes material. |
| Webhook timeout or network error | Aborts after eight seconds and logs only the safe error message. | Shows a call-to-action fallback with the business phone number. | Check the LeadPrime webhook status and hosting logs. |
| Webhook 4xx/5xx response | Treats the delivery as failed; no false success is returned. | Shows the same call fallback. | Validate the endpoint configuration and retry only with the customer’s consent. |
| Embed Kit failure | Emits a visible, dismissible chat-unavailable message with click-to-call fallback. | Keeps phone and estimate form as working paths. | Confirm token and widget availability in LeadPrime. |

## Railway handoff

The repository deliberately avoids committed `.env` files. The Railway variable template is documented in `docs/railway-environment.example.md`, with variable names only. Railway must be configured with `LEADPRIME_WEBHOOK_URL` and `LEADPRIME_EMBED_TOKEN` as service variables; neither value appears in the repository, browser source code, screenshots, nor fixtures.

| Railway step | Requirement |
|---|---|
| Source | Connect the private repository created for this project. |
| Build command | `pnpm build` |
| Start command | `pnpm start` |
| Runtime | Node 22 or later. Railway must supply `PORT`; the server reads it automatically. |
| Required variables | `LEADPRIME_WEBHOOK_URL`, `LEADPRIME_EMBED_TOKEN`, `CANONICAL_ORIGIN=https://rosaleslandscapingandconstruction.com`, `SITE_NAME=Rosales Landscaping & Construction`. |
| Optional variable | `LEADPRIME_WEBHOOK_HMAC_SECRET` only if LeadPrime is configured to require signing. |
| Health verification | Open the home page, a service page, `/sitemap.xml`, `/robots.txt`, and `/llms.txt`. Confirm the chat bubble appears. |
| Lead verification | Submit a consented internal test with a designated team inbox or run the intentionally gated live test with `LEADPRIME_LIVE_TESTS=true`; verify one corresponding lead in LeadPrime, then return the flag to `false`. |

Do not set `LEADPRIME_LIVE_TESTS=true` during normal builds or recurring CI. This variable only permits deliberate synthetic lead delivery and should be removed or set to `false` immediately after an intentional integration check.

## Verification contract

Two synthetic webhook submissions were authorized and validated before the user-facing form was built. Live tests are gated so routine test commands do not create CRM records. Automated unit tests cover payload mapping, server-side delivery behavior, and the absence of a webhook credential in the request body. Browser and production checks cover client validation, server error state, success confirmation, page/service attribution, UTM preservation, crawler-visible content, metadata, and legacy redirects.
