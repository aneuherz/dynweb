function spoiler(control, control2) {
    var elem = document.getElementById(control);
    var elem2 = document.getElementById(control2);
    if (elem.style.display == "none") {
        elem.style.display = "block";
        elem2.style.display = "none";
    } else {
        elem.style.display = "none";
        elem2.style.display = "block";
    }
}

function inputChanged() {
    var input = document.getElementById('inputfield');
    var description = document.getElementById('description');
    var c = input.innerHTML.charAt(0);
    var len = input.innerHTML.length;
    var text = '';
    input.style.border = "2px solid white";

    if (c == 's' || c == 'S') {
        description.src = 'resources/icons/icon-show.svg';
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                document.getElementById("test").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", "index.js/select", false);
        xhttp.send();
    }
    else if (c == 'e' || c == 'E' || c == 'c' || c == 'C') {
        description.src = 'resources/icons/icon-edit.svg';
        document.getElementById("test").innerHTML = 'NOT YET IMPLEMENTED';
    }
    else if (c == 'd' || c == 'D' || c == 'r' || c == 'R' || c == '-') {
        description.src = 'resources/icons/icon-minus.svg';
        document.getElementById("test").innerHTML = 'NOT YET IMPLEMENTED';
    }
    else if (c=='i' || c=='I' || c == 'a' || c == 'A' || c == 'n' || c == 'N' || c == '+') {
        description.src = 'resources/icons/icon-add.svg';
        document.getElementById("test").innerHTML = 'NOT YET IMPLEMENTED';
    }
    else {
        description.src = 'resources/icons/icon-error.svg';
        input.style.border = "2px solid red";
        document.getElementById("test").innerHTML = 'SOME ERROR?!';
    }

}

function load() {
    document.getElementById("usergreeting").innerHTML = 'Hi, ' + getCookie('username') + '!';

    addToGroupList();


}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    return parts.pop().split(";").shift();
}
function addToGroupList()
{
    var groupList = document.getElementById("grouplist");
    while (groupList.firstChild) {
        groupList.removeChild(groupList.firstChild);
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var json = JSON.parse(xhttp.responseText);
            for(var i = 0; i< json.length;i++)
            {
                var node = document.createElement("li");
                var textnode = document.createTextNode(json[i]['groupname']);
                node.appendChild(textnode);
                groupList.appendChild(node);
            }

        }
    };
    var username = getCookie('username');
    xhttp.open("GET", "index.js/"+username+"/groups", true);
    xhttp.send();
}


