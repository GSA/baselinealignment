function on() {
	var add_div = document.createElement('div');
	add_div.setAttribute('id', 'mydiv');
    add_div.style.position = "absolute";
    add_div.style.zIndex = "9";
	//add option to choose vertical or horizontal rectangle
	var ori = prompt("Enter 'h' for a horizontal rectangle or 'v' for a vertical rectangle:");
	if (ori == "h") {
		//Horizontal rectangle
		add_div.innerHTML = '<canvas id="myCanvas" width="341" height="256" style="border:1px solid #000000; background:#8080C0;">';
		
	} 
		else if (ori == "v") {
		//Vertical rectangle
		add_div.innerHTML = '<canvas id="myCanvas" width="256" height="341" style="border:1px solid #000000; background:#8080C0;">';
	} else {return;}
	
	//add div to body//
    document.body.appendChild(add_div);
//Make the DIV element draggable: https://www.w3schools.com/howto/howto_js_draggable.asp
dragElement(document.getElementById(("mydiv")));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
}
