function load() {
    document.getElementById("form-register").style.display = "none";
    document.getElementById("form-login").style.display = "block";
    deleteAllCookies();
}
function spoiler(control, control2) {
    var elem = document.getElementById(control);
    var elem2 = document.getElementById(control2);
    var elem3 = document.getElementById("link-register");
    if (elem.style.display == "none") {
        elem.style.display = "block";
        elem2.style.display = "none";
        elem3.innerHTML = "Login now!";
    } else {
        elem.style.display = "none";
        elem2.style.display = "block";
        elem3.innerHTML = "Register Now!";
    }
}

function login() {

}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}