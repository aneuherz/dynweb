function myOnloadFunc(){
	document.getElementById("usergreeting").innerHTML = document.cookie;
	
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  return parts.pop().split(";").shift();
}

window.onload = myOnloadFunc;