// Populate secondary TOC navigation with headings from main content
// Assumes that heading levels follow logical structure for h3 headings nested directly
// under h2 headings.
$(document).ready(function() {
	$("#toc-list").empty();
	var indexH3 = 0;
	var prevID = "";
	
	$("main h2, main h3").each(function() {
		// Find the ID for the heading element
		var myID = $(this).attr("id");
		var myIDtoc = myID + "TOC"
		// Define TOC li content with link to heading
		var listItem = "<li class='usa-sidenav__item list' id='"+myIDtoc+"'><a class='header-menu-text' href='#" + myID + "'>" + $(this).text() + "</a></li>";
		
		// Add TOC li for h2 elements
		if ($(this).is("h2")){
			$("#toc-list").append(listItem);
			indexH3 = 0;
			prevID = "#" + myIDtoc;
		} else {
			// If the h3 is the fist h3 under h2, add new, nested
			// ul to previous li and append TOC li for the h3 heading
			if (indexH3 == 0){
				$(prevID).append("<ul class='usa-sidenav__sublist items'></ul>");
				$(prevID +" ul").append(listItem);
				indexH3++;
			// If the h3 is not the fist h3 under h2, simply append
			// the h3 TOC li to the nested ul under the h2 TOC li
			} else {
				$(prevID +" ul").append(listItem);
			}
		}
	});
});

// Add Bootstrap table classes to tables
$(document).ready(function(){
	$("table")
		.addClass("table")
		.addClass("table-hover");
	$("table thead").addClass("bg-primary-darker text-white");
	$("table caption").addClass("text-primary-dark");
});