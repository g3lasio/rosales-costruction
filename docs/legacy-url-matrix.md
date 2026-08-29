# Legacy URL Matrix

The following routes were observed in the public WordPress sitemap during the discovery audit. The production server sends permanent redirects for changed commercial and legal routes before its SSR handler runs.

| Legacy route | Production behavior | Reason |
|---|---|---|
| `/` | Preserved | Main commercial homepage. |
| `/about/` | Preserved as `/about` | Commercial about page. |
| `/services/` | Preserved as `/services` | Commercial service index. |
| `/gallery/` | 301 to `/projects` | The new projects route supersedes the former gallery. |
| `/reviews/` | Preserved as `/reviews` | Current public review-links page. |
| `/contact/` | Preserved as `/contact` | Main estimate and contact path. |
| `/privacy-policy/` | 301 to `/privacy` | New privacy policy is specific to the LeadPrime form process. |
| `/hello-world/` | 301 to `/` | Removed WordPress residue with no commercial value. |
| `/category/uncategorized/` | 301 to `/` | Removed WordPress category residue with no commercial value. |
| `/author/g-macias8993gmail-com/` | 301 to `/` | Removed WordPress author archive. |
| `/metform-form/*` | 301 to `/` | Removed technical WordPress form routes. |

The new service routes do not have corresponding public WordPress service URLs to preserve. Each is a dedicated, canonical commercial page created for the new information architecture.
