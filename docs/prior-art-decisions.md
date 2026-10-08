# Prior-art decisions

## Completed form receipt recovery, 8 October 2026

ADOPT Google Apps Script's native ScriptCache inside the existing web app. The need is to recover the actual completed receipt when Google's original ContentService response URL cannot be read. Cache only technical receipt fields and use the existing authenticated endpoint, request ID, credentials and Google integration. Do not create a database, workbook, paid dependency or second submission path.

Google documents script-scoped caching and permits early eviction. The lookup therefore returns honest unavailability on a miss and is never treated as durable storage. The submission Sheet remains the business record. References: https://developers.google.com/apps-script/reference/cache/cache-service and https://developers.google.com/apps-script/reference/cache/cache.
