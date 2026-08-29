# Railway environment variables

Set these values in the Railway service configuration. Do not create a committed `.env` file and do not paste production values into GitHub issues, browser code, screenshots, or documentation.

| Variable | Required | Purpose | Value in repository |
|---|---:|---|---|
| `LEADPRIME_WEBHOOK_URL` | Yes | Private server-side destination for estimate form submissions. | Never committed. |
| `LEADPRIME_EMBED_TOKEN` | Yes | Token supplied to the official LeadPrime chat bootstrap at runtime. | Never committed. |
| `LEADPRIME_LIVE_TESTS` | No | Enables intentional live synthetic webhook tests only. | Use `false` by default. |

The hosting platform must also provide its application runtime environment. The current project does not require a database to collect estimates; the LeadPrime webhook remains the system of record for lead intake.
