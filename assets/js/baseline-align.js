// Add Bootstrap table classes to tables
$(document).ready(function(){
	$("table")
		.addClass("usa-table")
		.addClass("usa-table--borderless");
	$("table thead th").attr('scope', "col");
	$("table tbody th").attr('scope', "row");
});