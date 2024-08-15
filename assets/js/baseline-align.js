// Add Bootstrap table classes to tables
$(document).ready(function(){
	$("table")
		.addClass("usa-table")
		.addClass("usa-table--borderless")
		.addClass("usa-table--stacked");
		// .wrap("<div class='usa-table-container--scrollable'></div>");
	$("table thead th").attr('scope', "col");
	$("table tbody th").attr('scope', "row");
});