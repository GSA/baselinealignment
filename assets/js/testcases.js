// Pull in the relevant code snippet from the sample code file

//ENTER Test File full URL with http or https.

    let file = document.getElementById("samplecodelink").textContent;
    // console.log("File path:" + file);

    fetch (file)
    .then(function (response) {
    // 
    return response.text();
    })
    .then(function(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        
        var testcasesnip = doc.getElementById("tc_code").innerHTML;
        // testcasesnip = testcasesnip.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        //console.log("Test case snip: " + testcasesnip);
        document.getElementById("ta_code").innerHTML = htmlEntities(testcasesnip);
    })
    //.then(y => document.getElementById("ta_code").innerHTML = testcasesnip);
    .catch(function (err) {  
        console.warn('Failed to fetch page: ', err);  
    });

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Make the first column in each row in the Test Case Instruction table a table header
// using scope="row" and by changing the first column td to th
$(document).ready(function() {
    var attrs = { };

    $("#TCsteps_table table tbody tr td:first-child").each(function(_idx, attr) {
        attrs[attr.nodeName] = attr.nodeValue;
    });


    $("#TCsteps_table table tbody tr td:first-child").replaceWith(function () {
        attrs.text = $(this).text();
        return $("<th />", attrs);
    });

    $("#TCsteps_table table tbody tr th").attr("scope", "row");//.attr('data-label', 'Test Instruction');
    $("#TCsteps_table table thead tr th").attr("scope", "col");
    // $("#TCsteps_table table tbody tr td").first().attr('data-label', 'Instruction Detail');
    // $("#TCsteps_table table tbody tr td").last().attr('data-label', 'Expected Test Case Result');

    // Add labels
    const headerLabels = $("#TCsteps_table table thead th").map(function() {
        return $(this).text();
    }).get();

    console.log(headerLabels);

    // Loop through each row in the tbody
    $("#TCsteps_table table tbody tr").each(function() {
        // Get all th and td tags in the row
        $(this).children("th, td").each(function(index) {
            // Assign the corresponding data-label
            if (headerLabels[index]) {
                $(this).attr("data-label", headerLabels[index]);
            }
        });
    });

    // Add captions
    $('#TCsteps_table table').first().prepend('<caption>Test Case Instruction</caption>');

    // Set active menu
    $('a[data-nav-item-url="/testcases.html"]').addClass('usa-current');
});