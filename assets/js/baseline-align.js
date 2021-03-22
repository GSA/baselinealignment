// Toggle between showing and hiding the sidebar, and add overlay effect
function sidebarOpenClose() {
	$("#site-nav").toggleClass("flyover-sidebar");
	$("#site-nav").toggleClass("d-none");
	$("#site-nav").toggleClass("col");
	$("#site-nav").toggleClass("d-md-block");
	$("#site-nav").toggleClass("col-md-3");
	$("#site-nav").toggleClass("col-xl-2");
	$("#site-nav").toggleClass("fixed-sidebar");
	$("#site-nav").toggleClass("order-0");
	$("#closeSidebar").toggleClass("d-none");
	$("#myOverlay").toggleClass("d-none");
	var openCloseMenu = document.getElementById("openCloseMenu")
	var x = openCloseMenu.getAttribute("aria-expanded"); 
	if (x == "true") 
		{x = "false"} else 
		{x = "true"}
	openCloseMenu.setAttribute("aria-expanded", x);
}

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
		var listItem = "<li class='toc-item' id='"+myIDtoc+"'><a class='bg-light' href='#" + myID + "'>" + $(this).text() + "</a></li>";
		
		// Add TOC li for h2 elements
		if ($(this).is("h2")){
			$("#toc-list").append(listItem);
			indexH3 = 0;
			prevID = "#" + myIDtoc;
		} else {
			// If the h3 is the fist h3 under h2, add new, nested
			// ul to previous li and append TOC li for the h3 heading
			if (indexH3 == 0){
				$(prevID).append("<ul></ul>");
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

// Wrap content into bootstrap 'card' styles
$(document).ready(function(){
	// Put h1 in its own 'card'
	$("#card-holder h1")
	.wrap('<div class="card shadow" />')
	.wrap('<div class="card-body" />');
	$("main h1").addClass("card-title");

	// Put all content under h2 in a card with the h2 heading
	$("#card-holder h2").each(function(){ 
		$(this)
			.nextUntil("h2")
			.addBack()
			.wrapAll('<div class="card shadow my-3" />')
			.wrapAll('<div class="card-body" />');
	});
});

// Highlight the menu item for the active page/section the site
$(document).ready(function(){
	// Get the current file path
	var path = window.location.pathname;

	// Highlight the menu item that relates to the current page, based on file name
	if (path.indexOf("/index")>=0) {
		$("#home").toggleClass("active");
		$("#home").toggleClass("bg-light");
	} else if (path === "/") {
		$("#home").toggleClass("active");
		$("#home").toggleClass("bg-light");
	} else if (path.indexOf("/contributing")>=0) {
		$("#contributing").toggleClass("active");
		$("#contributing").toggleClass("bg-light");
	} else if (path.indexOf("/testcases")>=0) {
		$("#testcases").toggleClass("active");
		$("#testcases").toggleClass("bg-light");
	} else {}
});

// Add Bootstrap table classes to tables
$(document).ready(function(){
	$("table")
		.addClass("table")
		.addClass("table-hover");
	$("table thead").addClass("thead-dark");
});