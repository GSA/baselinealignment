---
layout: page_no-toc
title: Test Cases - Baseline Alignment for Web
scripts: datatables
---
## Index of Test Cases

The table below lists test cases for evaluating whether test processes produce results consistent with the <a href="https://ictbaseline.access-board.gov/" class="usa-link usa-link--external">Section 508 ICT Testing Baseline for Web</a>. Available cases provide evidence for the procedures and scenarios they exercise; they do not by themselves certify a process or establish complete Baseline alignment. See [Evaluating a Test Process](evaluating-test-processes.html) for guidance.

Test Case documents are organized by Baseline test; each ICT Baseline may correspond to multiple Test Cases. Each Test Case provides a specific example, with sample code, of web content that passes, fails, or does not apply to a particular Baseline procedure. You can also download expanded test case index information in JavaScript Object Notation (JSON) or comma-separated values (CSV) formats.

[Download .json]({{ site.baseurl }}/assets/baselineTestCases.json) <span>|</span> [Download .csv]({{ site.baseurl }}/assets/baselineTestCases.csv)

For candidate test-process inputs, download the [candidate JSON index]({{ '/assets/baselineTestCases-candidate.json' | relative_url }}) or [candidate CSV index]({{ '/assets/baselineTestCases-candidate.csv' | relative_url }}). These Web-only exports omit expected-result fields, case titles, rationale, and explanatory case-document links. Existing case IDs, filenames, and sample content can still reveal outcomes, so these exports are not blinded inputs. See the [reporting tool guidance]({{ '/reporting-guide.html' | relative_url }}).

<table id="test-case-index" class="display compact" data-order='[[ 0, "asc" ]]' data-page-length='25'>
  <caption>
    Index of Baseline Alignment Framework Test Cases
  </caption>
  <thead>
    <tr>
      <th scope="col">Test Case</th>
      <th scope="col">Sample Code</th>
      <th scope="col">ICT Baseline</th>
      <th scope="col">Relevant Standard</th>
    </tr>
  </thead>
  <tbody>
    {% for page in site.pages %}
      {% if page.layout == "testcase" %}
      {% assign baselineID = page.tcid | slice: 2, 2 %}
      <tr>
        <td>
          <a target="_blank" href="{{ site.baseurl }}{{ page.url }}">{{ page.tcid }} {{ page.title | markdownify }}</a>
        </td>
        <td>
          <a target="_blank" href="{{ site.baseurl }}{{ page.sample }}">{{ page.tcid }} Test Page</a>
        </td>
        <td>
        {% for baseline in site.data.baselines %}
          {% if baseline.id == baselineID %}
          <a target="_blank" href="{{ baseline.url }}" class="usa-link usa-link--external">{{ baseline.name }}</a>
          {% endif %} 
        {% endfor %}
        </td>
        <td>
          <a target="_blank" href="{{ page.standard-ref-url }}" class="usa-link usa-link--external">{{ page.standard }} {{ page.standard-ref }}</a>
        </td>
      </tr>
      {% endif %}
    {% endfor %}
  </tbody>
</table>
