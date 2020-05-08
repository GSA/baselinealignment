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
