---
title: 12 - Graduate PDF Parsing
---

Lets graduate users upload a PDF from UAchieve and easily see the parsed courses added into
their plan

## WHY

Ease of use for graduate users. Takes out the pain of needing to upload 
every single course manually

## WHAT

Added a new dependency: `pdf-parse`

Added a file upload input on the graduate plan page. User uploads their uachieve pdf,
the server parses it and extracts courses, and they get added into their plans.

## IMPLEMENTATION STEPS

1. add `pdf-parse` dependency
2. create route to accept pdf upload and parse course data
3. map parsed courses to course structure
4. add upload UI on the graduate plan page

## ROLLBACK STEPS

This is the HOW... if something goes wrong. How will you revert back to the original
state? What tests will show when something goes wrong?

1. If something goes wrong in prod, declare an incident
2. Remove the upload UI from the graduate plan page
3. Delete the parsing route
4. Remove `pdf-parse` from dependencies

## APPENDIX
