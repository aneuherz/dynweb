/**
* @author: Michael Wilhelm Koch
*/


function myOnloadFunc(){
	document.getElementById("folderImg").addEventListener("mouseenter", function (){
	    //Erstellt einen AjaxRequest
	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function() {
	        if (xhttp.readyState == 4 && xhttp.status == 200) {
	            var responseObj=JSON.parse(xhttp.responseText);
		    document.getElementById("todoText").innerHTML = responseObj.todoText;
	            document.getElementById("creator").innerHTML = responseObj.createdBy;
	            document.getElementById("date").innerHTML = responseObj.ceratDate;
	        }
	    };
	    xhttp.open("GET", "imageAjax", true);
	    xhttp.send();
	});

	document.getElementById("submit_button").addEventListener("click", function (){
	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function() {
	        if (xhttp.readyState == 4 && xhttp.status == 200) {
	            var responseObj=JSON.parse(xhttp.responseText);
				document.getElementById("todoText").innerHTML = responseObj.primeNumber;
			}
		}
		xhttp.open("POST", "index.js/primZahlen", true);
		xhttp.send("primeNumber=" + document.getElementById("zahl").value);
		return false;
	});
}


window.onload = myOnloadFunc;