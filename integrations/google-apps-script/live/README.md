# Existing production Google integration

`Code.gs` is the observed source from the existing Surface Talent Website Submissions Apps Script project. It includes the audit-observability and write-confirmation patch deployed as Version 10 on 8 October 2026, followed by the reviewed authenticated receipt-recovery patch. Provider deployment evidence records the published version separately.

The original exported `../Code.gs` remains an undeployed v2 reference. Do not use its defaults to replace the live workbook.

Version 10 preserves the existing deployment ID, workbook, page tabs, private CV folder, secret property and notification recipients. It reports `audit_ok`, logs audit-write exceptions and stores the latest bounded failure under the project-local `LAST_AUDIT_FAILURE` property. It flushes each append and optional phone write before reporting that operation successful. An audit failure leaves the already-saved business record successful, so the visitor is not prompted to create a duplicate enquiry.

The source was copied from the authenticated editor, compared byte for byte with Version 7 in Project history, and reviewed against that baseline. The patch passed VM success and injected-failure checks. Google UI confirmed the existing deployment was updated successfully. Deployment success and synthetic business persistence are separate evidence from audit persistence.

Never commit property values or copy client records into global memory. Test records and provider evidence remain in the ignored project-local `design-dump/seo-20261008/automations/` directory.

The existing workbook also had obsolete strict Status validation on column F of eight operational tabs. Only those misplaced rules were removed from `F2:F1000`; actual Status rules, values and formatting were preserved. Provider readback is retained with the test evidence. The script does not roll back partial writes or guarantee exactly-once processing.

Receipt recovery uses Google's native ScriptCache. It stores only the completed submission ID, sheet and technical outcome flags for up to 30 minutes. It authenticates the lookup with the existing secret before reading the cache. New submissions reuse the validated website-generated ID; legacy callers retain the previous ID generator. Cache eviction or a failed lookup remains an explicit failure. The website sends the enquiry once and can read the actual completed receipt through a fresh response URL.
