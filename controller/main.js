//the main controller

// 2015-11-19
// 1 html-formular bereitstellen: Eingabe unserer Zahl
// 2 css file in html-formular einbinden
// 3 Zahl mittels AJAX an den Server und der Server liefert diese Zahl mit Kommentar zurueck

"use strict";

var fs = require("fs");
var qs = require('querystring');
var db = require("../model/db");
var user = '';

function parsepost(request, response, action) {
    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            body = body.trim().replace(/\r\n/g,"&");
            var post = qs.parse(body);
            action(response, post);
        });
    }
}
function redirectUrl(response, post) {
        console.log(post);
        console.log(post['username']);
        user = post['username'];
        console.log(post['password']);
        response.statusCode = 302;
        response.setHeader("Location", "/main.html");
        response.end();
}
function addGroup(response, post)
{
    db.addGroup(response, post);
}
function Cookie(name, v) {
    this.name = name
    this.value = v
    this.maxage = null; //60*60*3 // 60 sec * 60 min => 3h
    var expireOn = new Date()
    expireOn.setDate(expireOn.getDate() + 3) // expire in three days
    this.expires = expireOn.toUTCString() // "Mon, 31-Dec-2035 23:00:01 GMT"
    // this.domain=null ... path=... secure=.... }
}

Cookie.prototype.toString = function () {
    var result = this.name + "=" + this.value;
    if (this.maxage) result += "; Max-Age=" + this.maxage;
    if (this.expires) result += "; expires=" + this.expires;
    return result;
}

Cookie.prototype.delete = function () {
    var expireOn = new Date()
    expireOn.setDate(expireOn.getDate() - 1) // expire in three days
    this.expires = expireOn.toUTCString()

}

function extractCookiesDict(req) {
    // console.log("Now extract req.headers.cookie: '"+ req.headers.cookie+ "'" )
    var cookiesDict = {};
    var rc = req.headers.cookie;
    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        var name = parts.shift().trim()
        var value = unescape(parts.join('='))
        cookiesDict[name] = new Cookie(name, value)
    });

    return cookiesDict;
}

var startup = function () {
    var http = require("http");
    var server = http.createServer(
        function (req, res) {
            var filename = "/login.html";
            var mimeType = "text/html";
            var imgInfos = {};

            console.log("###LOGGING### URL: " + req.url);

            // wie unterscheidet man, welche url aufgerufen wird?

            if (req.url.lastIndexOf(".css") > -1) {
                mimeType = "text/css";
                filename = req.url; // "/css/layout.css"
            } else if (req.url.lastIndexOf(".png") > -1) {
                mimeType = "image/png";
                filename = req.url; // "/img/logo.png"
            } else if (req.url.lastIndexOf("loginNow") > -1) {
                // POST, PUT, GET, DELETE bis 12.12.2015 ergaenzen
                console.log('login');
                parsepost(req, res, redirectUrl);
                return;
            }
            else if (req.url.lastIndexOf("addgroup") > -1) {
                // POST, PUT, GET, DELETE bis 12.12.2015 ergaenzen
                parsepost(req, res, addGroup);
                return;
            }
            else if (req.url.lastIndexOf('select') > -1){
                db.find(res, 'tuser');
                return;
            }
            else if (req.url.lastIndexOf('users') > -1){
                var url = req.url.split('/');
                var username = url[url.length-2];
                console.log(req.url);
                db.findAllAvailableUsers(res, username);
                return;
            }
            else if (req.url.lastIndexOf('groups')>-1)
            {
                var url = req.url.split('/');
                var username = url[url.length-2];
                db.findAllGroups(res, username);
                return;
            }
            else if (req.url.lastIndexOf(".js") > -1) {
                mimeType = "application/javascript";
                filename = req.url;
            }
            else if (req.url.lastIndexOf(".svg") > -1) {
                mimeType = "image/svg+xml"
                filename = req.url
            }
            else if (req.url.lastIndexOf(".html") > -1) {
                mimeType = "text/html";
                filename = req.url; // "/img/logo.png"
            }
            else if(req.url.lastIndexOf(".ttf")>-1)
            {
                mimeType = "application/octet-stream";
                filename = req.url;
            }
            else
            {
                console.log(req.url + ' NOT FOUND');
            }

            //form.html
            //layout.css
            //create cookie

            var cookies = extractCookiesDict(req);
            var currentUserCookie = cookies['username']

            if (user!='' && currentUserCookie==null) {
                    var cook = new Cookie("username", user);
                    res.writeHead(200, {"Content-Type": mimeType, "Set-Cookie": [cook]});
            }
            else {
                res.writeHead(200, {"Content-Type": mimeType});
            }

            //console.log("###LOGGING### Prime number is: " + data.zahl);
            fs.readFile("public" + filename, function (err, data) {
                //console.log("###LOGGING### we loaded: " + data.length);
                if (err === null) {
                    var dataUTF8;
                    if (mimeType != "image/png") {
                        dataUTF8 = data.toString('UTF-8');
                    } else {
                        dataUTF8 = data;
                    }
                    //console.log("###LOGGING### DATA in UTF8: " + dataUTF8);
                    res.end(dataUTF8);
                } else {
                    console.log("++++ERROR++++ " + err);
                }
            });
        }
    );
    server.listen(8000);
    console.log("Server runs: http://localhost:8000");
}

module.exports.start = startup;