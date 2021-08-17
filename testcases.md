---
layout: page
title: Placeholder Index of Test Cases
---
# ICT Baseline Alignment Framework - Test Cases
## Placeholder Index

Until we modify the primary index file, this serves as a placeholder with links to current test case documents.

Test Case documents are organized by Baseline Test (each serving as a Test Scenario or general "functional requirement" for testing), which inculde multiple Test Cases. Will need to develop a Test Scenario template to summarize Test Scenario purpose and subordinate Test Cases

* `5.` Changing Content
  * [Changing Content - aria-live='off' (TC05.1-1-fail-1)](testcases/TC05.1-1-fail-1.html)
* `6.` Images
  * [Image - no accessible name or description (TC06.1-1-fail-1)](testcases/TC06.1-1-fail-1.html)
  * [Meaningful Image - with non-descriptive alt text (TC06.1-2-fail-1)](testcases/TC06.1-2-fail-1.html)
  * [Meaningful Image - with role="presentation" (TC06.1-3-fail-1)](testcases/TC06.1-3-fail-1.html)
  * [Meaningful Image - with role="none" (TC06.1-4-fail-1)](testcases/TC06.1-4-fail-1.html)
  * [Meaningful Image - with aria-hidden="true" (TC06.1-5-fail-1)](testcases/TC06.1-5-fail-1.html)
  * [Meaningful Image - text equivalent in alt attribute (TC06.1-all-pass-1)](testcases/TC06.1-all-pass-1.html)
  * [Meaningful Image - text equivalent in title attribute (TC06.1-all-pass-2)](testcases/TC06.1-all-pass-2.html)
  * [Meaningful Image - text equivalent in aria-label attribute (TC06.1-all-pass-3)](testcases/TC06.1-all-pass-3.html)
  * [Meaningful Image - text equivalent in aria-labelledby attribute (TC06.1-all-pass-4)](testcases/TC06.1-all-pass-4.html)
  * [Meaningful Image - text equivalent in aria-describedby attribute (TC06.1-all-pass-5)](testcases/TC06.1-all-pass-5.html)
  * [Decorative Image - with no accessible name or description defined, not in background (TC06.2-all-fail-1)](testcases/TC06.2-all-fail-1.html)
  * [Decorative Image - with non descriptive text in accessible name and description (TC06.2-all-fail-2)](testcases/TC06.2-all-fail-2.html)
  * [Decorative Image - with descriptive text in accessible name (TC06.2-all-fail-3)](testcases/TC06.2-all-fail-3.html)  
  * [Decorative Image - with role equals presentation (TC06.2-1-pass-1)](testcases/TC06.2-1-pass-1.html)
  * [Decorative Image - with role equals none (TC06.2-2-pass-1)](testcases/TC06.2-2-pass-1.html)
  * [Decorative Image - with aria-hidden="true" (TC06.2-3-pass-1)](testcases/TC06.2-3-pass-1.html)
  * [Decorative Image - with alt="" (TC06.2-4-pass-1)](testcases/TC06.2-4-pass-1.html)
  * [Decorative Image - with image inserted via CSS (TC06.2-5-pass-1)](testcases/TC06.2-5-pass-1.html)
* `8.` Contrast
  * [Contrast - insufficient contrast ratio for small text (TC08.1-2-fail-1)](testcases/TC08.1-2-fail-1.html)
* `10.` Forms
  * [Input text element: no accessible name or description (TC10.1-1-fail-1)](testcases/TC10.1-1-fail-1.html)
* `13.` Content Structure
  * [Descriptive Headings - with a visual heading that does not describe purpose or topic of its contents (TC13.1-1-fail-1)](testcases/TC13.1-1-fail-1.html)
  * [Descriptive Headings - with an extended heading that describes purpose and/or topic of its contents (TC13.1-1-pass-1)](testcases/TC13.1-1-pass-1.html)
  * [Descriptive Headings - with an extended heading that describes purpose and/or topic of its contents (TC13.1-1-pass-2)](testcases/TC13.1-1-pass-2.html)
  * [Visual Headings - programmatic heading levels do not match the visual hierarchy(13.2-1-fail-1)](testcases/TC13.2-1-fail-1.html)
  * [Visual Headings - most important heading does not have the higher priority level programmatically (13.2-1.a-fail-1)](testcases/TC13.2-1.a-fail-1.html)
  * [Visual Headings - with the same heading level used for subsections, but styled to be smaller (13.2-1.b-fail-1)](testcases/TC13.2-1.b-fail-1.html)
  * [Visual Headings - with the visual heading not being defined programmatically (13.2-1.c-fail-1)](testcases/TC13.2-1.c-fail-1.html)
  * [Visual Headings - with visual headings defined programmatically using heading elements, but role=heading is used AND aria-level  does not match heading element level (13.2-1.c-fail-2)](testcases/TC13.2-1.c-fail-2.html)
  * [Visual Headings - with visual headings defined programmatically with multiple heading element levels AND role=heading BUT aria-level is not defined (13.2-1.c-fail-3)](testcases/TC13.2-1.c-fail-3.html)
  * [Visual Headings - with visual headings, with multiple levels visually apparent, are defined programmatically using role=heading BUT aria-level is not defined (13.2-1.c-fail-4)](testcases/TC13.2-1.c-fail-4.html)
* `15.` Language
  * [Language of Page - Pass (TC15.1-all-pass-1)](testcases/TC15.1-all-pass-1.html)
  * [Language of Page - not identified (TC15.1-2-fail-1)](testcases/TC15.1-2-fail-1.html)
  * [Language of Page - lang attribute on wrong tag (TC15.1-2-fail-2)](testcases/TC15.1-2-fail-2.html)
  * [Language of Page - invalid language subtag (TC15.1-3-fail-1)](testcases/TC15.1-3-fail-1.html)
  * [Language of Page - wrong language identified (TC15.1-3-fail-2)](testcases/TC15.1-3-fail-2.html)
  * [Language of Parts - Pass (TC15.2-all-pass-1)](testcases/TC15.2-all-pass-1.html)
  * [Language of Parts - not identified (TC15.2-2-fail-1)](testcases/TC15.2-2-fail-1.html)
  * [Language of Parts - invalid language subtag (TC15.2-3-fail-1)](testcases/TC15.2-3-fail-1.html)
  * [Language of Parts - incorrect language identified (TC15.2-3-fail-2)](testcases/TC15.2-3-fail-2.html)
  * [Language of Parts - Does Not Apply (TC15.2-ic-dna-1)](testcases/TC15.2-ic-dna-1.html)
* `17.` Synchronized Media
  * [ Media Player Controls - no synchronized media player on page (TC17.1-ic-dna-1)](testcases/TC17.1-ic-dna-1.html)
  * [ Media Player Controls - media player on page, but it does not play synchronized media (only audio-only) (TC17.1-ic-dna-2)](testcases/TC17.1-ic-dna-2.html)
  * [ Media Player Controls - no controls for captions or for audio descriptions (TC17.1-1-fail-1)](testcases/TC17.1-1-fail-1.html)
  * [ Media Player Controls - controls for captions, but not for audio descriptions (TC17.1-1-fail-2)](testcases/TC17.1-1-fail-2.html)
  * [ Media Player Controls - controls for audio descriptions, but not for captions (TC17.1-fail-3)](testcases/TC17.1-1-fail-3.html)
  * [ Media Player Controls - controls provided for both captions and audio descriptions (TC17.1-all-pass-1)](testcases/TC17.1-all-pass-1.html)
  * [ Media Player Caption Control Level - no synchronized media player on page (TC17.2-ic-dna-1)](testcases/TC17.2-ic-dna-1.html)
  * [ Media Player Caption Control Level - media player on page, but it does not play synchronized media (only audio-only) (TC17.2-ic-dna-2)](testcases/TC17.2-ic-dna-2.html)
  * [ Media Player Audio Description Control Level - no synchronized media player on page (TC17.3-ic-dna-1)](testcases/TC17.3-ic-dna-1.html)
  * [ Media Player Audio Description Control Level - media player does not play synchronized media (only audio) (TC17.3-ic-dna-2)](testcases/TC17.3-ic-dna-2.html)
  * [ Captions (Prerecorded) - no synchronized media on page (TC17.4-ic-dna-1)](testcases/TC17.4-ic-dna-1.html)
  * [ Captions (Prerecorded) - no captions (TC17.4-2-fail-1)](testcases/TC17.4-2-fail-1.html)
  * [ Captions (Prerecorded) - inaccurate captions (TC17.4-3b-fail-2)](testcases/TC17.4-3b-fail-2.html)
  * [ Captions (Prerecorded) - captions are complete, accurate, synchronized, and do not obscure other important on-screen text (TC17.4-all-pass-1)](testcases/TC17.4-all-pass-1.html)
  * [ Audio Description (Prerecorded) - no synchronized media on page (TC17.5-ic-dna-1)](testcases/TC17.5-ic-dna-1.html)
  * [ Audio Description (Prerecorded) - no audio descriptions (TC17.5-2-fail-1)](testcases/TC17.5-2-fail-1.html)
  * [ Audio Description (Prerecorded) - audio descriptions do not adequately describe important visual content (TC17.5-3-fail-1)](testcases/TC17.5-3-fail-1.html)
  * [ Audio Description (Prerecorded) - audio descriptions adequately describe all important visual content (TC17.5-all-pass-1)](testcases/TC17.5-all-pass-1.html)
