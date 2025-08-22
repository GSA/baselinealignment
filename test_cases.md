---
layout: page
title: Test Cases - Baseline Alignment for Web
scripts: datatables
redirect_from:
- /testcases/
- /testcases.html
---
## Index of Test Cases

The table below lists the test cases for validating alignment of test processes to the [Section 508 ICT Testing Baseline for Web](https://ictbaseline.access-board.gov/).

Test Case documents are organized by Baseline Test; each ICT Baseline corresponds to multiple Test Cases. Each Test Case provides a specific example (with sample code) of web content that passes, fails, or does not apply to particular ICT Baseline. You can also use the following links to download expanded test case index information in JavaScript Object Notation (JSON) or Comma-Separated Variable (CSV) formats.

[Download .json]({{ site.baseurl }}/assets/baselineTestCases.json) <span>|</span> [Download .csv]({{ site.baseurl }}/assets/baselineTestCases.csv)

<table id="test-case-index" class="display" data-order='[[ 1, "asc" ]]' >
  <caption>
    Index of Baseline Alignment Framework Test Cases
  </caption>
  <thead>
    <tr>
      <th scope="col">ICT Baseline</th>
      <th scope="col">Test Case</th>
      <th scope="col">Sample Code</th>
      <th scope="col">Relevant Standard</th>
    </tr>
  </thead>
  <tbody>
    {% for page in site.pages %}
      {% if page.layout == "testcase" %}
      {% assign baselineID = page.tcid | slice: 2, 2 %}
      <tr>
        <td>
        {% for baseline in site.data.baselines %}
          {% if baseline.id == baselineID %}
          <a href="{{ baseline.url }}">{{ baseline.name }}</a>
          {% endif %} 
        {% endfor %}
        </td>
        <td>
          <a href="{{ site.baseurl }}{{ page.url }}">{{ page.tcid }} {{ page.title | markdownify }}</a>
        </td>
        <td>
          <a href="{{ site.baseurl }}{{ page.sample }}">Test Page</a>
        </td>
        <td>
          {{ page.standard }} {{ page.standard-ref }}
        </td>
      </tr>
      {% endif %}
    {% endfor %}
  </tbody>
</table>