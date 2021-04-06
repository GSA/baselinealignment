// Pull in the relevant code snippet from the sample code file

//ENTER Test File full URL with http or https.

    let file = document.getElementById("samplecodelink").textContent;
    console.log("File path:" + file);

    fetch (file)
    .then(function (response) {
    // 
    return response.text();
    })
    .then(function(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        
        var testcasesnip = doc.getElementById("tc_code").innerHTML;
        testcasesnip = testcasesnip.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        //console.log("Test case snip: " + testcasesnip);
        document.getElementById("ta_code").innerHTML = testcasesnip;
    })
    //.then(y => document.getElementById("ta_code").innerHTML = testcasesnip);
    .catch(function (err) {  
        console.warn('Failed to fetch page: ', err);  
    });
