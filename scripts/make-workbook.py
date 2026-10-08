#!/usr/bin/env python3
"""
Build the Surface Talent website workbook as an .xlsx, ready to upload to Drive where Google
converts it to a Sheet with every tab intact.

The tab list, headers and dropdown values are read straight out of the Apps Script, so the file
this produces and the code that later writes into it can never drift apart. Re-run it whenever
those definitions change:

    python3 scripts/make-workbook.py out.xlsx

The Apps Script remains the thing that keeps a live workbook formatted; this exists so a workbook
starts out right rather than starting empty.
"""

import json
import re
import sys
from pathlib import Path

import xlsxwriter

ROOT = Path(__file__).resolve().parent.parent
CODE = ROOT / "integrations" / "google-apps-script" / "Code.gs"
FONT = "Mulish"

NAVY = "#0D2233"
NAVY_MID = "#193E5A"
COPPER = "#B87333"
LIVE_GREEN = "#EAF7EC"
OFF_GREY = "#F5F5F5"


def const(name: str) -> list[str]:
    """
    Read a top-level array constant out of the Apps Script. Entries may be string literals or
    references to other constants (PAGE_TABS holds SHEET_PAGE_* names), so identifiers are resolved
    to the string they were declared with.
    """
    src = CODE.read_text()
    m = re.search(r"var " + name + r" = \[(.*?)\];", src, re.S)
    if not m:
        raise SystemExit(f"{name} not found in {CODE}")
    out = []
    for raw in (x.strip() for x in m.group(1).split(",")):
        if not raw:
            continue
        if raw[0] in "\"'":
            out.append(raw.strip('"').strip("'"))
            continue
        ref = re.search(r'var ' + re.escape(raw) + r' = "([^"]+)";', src)
        if not ref:
            raise SystemExit(f"{name} references {raw}, which is not a string constant")
        out.append(ref.group(1))
    return out


HELP = [
    ("Surface Talent website workbook", "title"),
    ("", None),
    ("This one file drives the vacancies on the website and collects everything the forms send in.", None),
    ("", None),
    ("TO POST A VACANCY", "head"),
    ("1. Open the 'Live Jobs' tab.", None),
    ("2. Add a row. Title is the only field the site insists on; the rest show only if you fill them.", None),
    ("3. Set Status to 'Live'. The role appears on surfacetalent.co.uk/jobs within five minutes.", None),
    ("4. To take it down, change Status to Filled, Closed or On hold. Do not delete the row.", None),
    ("Green rows are live on the site right now. Grey rows are not.", None),
    ("", None),
    ("WHERE SUBMISSIONS LAND", "head"),
    ("The workbook mirrors the website. Every message is written twice.", None),
    ("Once to the tab for the page it came from: Home, Clients, Candidates, Jobs, Disciplines,", None),
    ("About, Contact. Use these to see what a page is actually producing.", None),
    ("Once to the tab for the kind of form it was: Candidate Submissions, Client Enquiries,", None),
    ("Contact Enquiries. Use these to work a pipeline.", None),
    ("Every row carries a Submission ID. Quote it in a reply so the thread can be traced.", None),
    ("", None),
    ("WHERE THE CVs ARE", "head"),
    ("Every uploaded CV goes to Drive, into a dated folder under 'Surface Talent — Website CVs'.", None),
    ("The 'CV / Document' column is a direct link to the file. Click it.", None),
    ("", None),
    ("EMAIL ALERTS", "head"),
    ("Every submission emails the address in NOTIFY_TO.", None),
    ("Extensions > Apps Script > Project Settings > Script Properties. No code edit needed.", None),
    ("", None),
    ("THE _Raw AND _Audit TABS", "head"),
    ("Hidden on purpose. _Raw is the untouched payload, _Audit is the delivery log. Leave both.", None),
    ("They are what makes it possible to prove what someone sent and when.", None),
    ("", None),
    ("IF THE FORMATTING GETS MESSY", "head"),
    ("Extensions > Apps Script > run formatWorkbook. It restyles every tab and never touches rows.", None),
]


def build(path: str) -> None:
    page_headers = const("PAGE_HEADERS")
    jobs_headers = const("JOBS_HEADERS")
    page_tabs = const("PAGE_TABS")

    wb = xlsxwriter.Workbook(path, {"default_date_format": "yyyy-mm-dd"})
    base = {"font_name": FONT, "font_size": 11}
    head = wb.add_format({**base, "bold": True, "font_color": "#FFFFFF", "bg_color": NAVY,
                          "valign": "vcenter", "text_wrap": True, "border": 0})
    head_page = wb.add_format({**base, "bold": True, "font_color": "#FFFFFF", "bg_color": NAVY_MID,
                               "valign": "vcenter", "text_wrap": True})
    head_jobs = wb.add_format({**base, "bold": True, "font_color": "#FFFFFF", "bg_color": COPPER,
                               "valign": "vcenter", "text_wrap": True})
    body = wb.add_format({**base, "valign": "top"})
    title = wb.add_format({**base, "bold": True, "font_size": 16, "font_color": NAVY})
    section = wb.add_format({**base, "bold": True, "font_color": COPPER})
    note = wb.add_format({**base, "font_color": "#3C3C3C"})
    live_row = wb.add_format({**base, "bg_color": LIVE_GREEN})
    off_row = wb.add_format({**base, "bg_color": OFF_GREY, "font_color": "#7A7A7A"})

    # 1. instructions
    ws = wb.add_worksheet("How to use this")
    ws.hide_gridlines(2)
    ws.set_column(0, 0, 108, note)
    for i, (text, kind) in enumerate(HELP):
        ws.write(i, 0, text, title if kind == "title" else section if kind == "head" else note)

    # 2. the vacancy board
    jobs = wb.add_worksheet("Live Jobs")
    widths = {"Status": 12, "Reference": 13, "Title": 34, "Subtitle": 34, "Hook": 40, "Internal Notes": 32}
    for c, h in enumerate(jobs_headers):
        jobs.write(0, c, h, head_jobs)
        jobs.set_column(c, c, widths.get(h, 18), body)
    jobs.freeze_panes(1, 3)
    jobs.set_row(0, 30)
    col = {h: i for i, h in enumerate(jobs_headers)}
    last = len(jobs_headers) - 1
    for name, values in (("Status", const("JOBS_STATUS")), ("Employment Type", const("JOBS_TYPE")),
                         ("Seniority", const("JOBS_SENIORITY"))):
        jobs.data_validation(1, col[name], 500, col[name], {"validate": "list", "source": values})
    jobs.conditional_format(1, 0, 500, last, {"type": "formula", "criteria": '=$A2="Live"', "format": live_row})
    jobs.conditional_format(1, 0, 500, last, {"type": "formula", "criteria": '=AND($A2<>"",$A2<>"Live")', "format": off_row})
    jobs.write_row(1, 0, [
        "Draft", "ST-EXAMPLE", "EXAMPLE ROW — delete or overwrite this", "Short line under the job title",
        "Anodising", "Process and production", "Engineer", "Permanent", "West Midlands", "£45-55k",
        "One sentence on why this role is worth a look.", "", "", "Set Status to Live to publish.",
    ], body)

    # 3. one tab per page of the website, then one per form
    statuses = const("SUBMISSION_STATUS")
    sheets = [(t, page_headers, head_page) for t in page_tabs] + [
        ("Candidate Submissions", const("CANDIDATE_HEADERS"), head),
        ("Client Enquiries", const("CLIENT_HEADERS"), head),
        ("Contact Enquiries", const("CONTACT_HEADERS"), head),
    ]
    for name, headers, fmt in sheets:
        s = wb.add_worksheet(name)
        for c, h in enumerate(headers):
            s.write(0, c, h, fmt)
            s.set_column(c, c, 40 if h in ("Message", "Brief", "Notes", "Internal Notes") else 20, body)
        s.freeze_panes(1, 1)
        s.set_row(0, 30)
        if "Status" in headers:
            i = headers.index("Status")
            s.data_validation(1, i, 500, i, {"validate": "list", "source": statuses})

    wb.close()


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "surface-talent-workbook.xlsx")
    print("written")
