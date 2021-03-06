function $(e) {
    return document.getElementById(e)
}

function $$(e) {
    var n = document.querySelectorAll(e);
    return 1 == n.length ? n[0] : n
}

function hide(e) {
    if (e instanceof Array)
        for (var n = 0; n < e.length; n++) e[n].classList.add("hidden");
    else e.classList.add("hidden")
}

function show(e) {
    if (e instanceof Array)
        for (var n = 0; n < e.length; n++) e[n].classList.remove("hidden");
    else e.classList.remove("hidden")
}

function toggleDisplay(e) {
    if (e instanceof Array)
        for (var n = 0; n < e.length; n++) e[n].classList.toggle("hidden");
    else e.classList.toggle("hidden")
}

function gen(e, n) {
    var t = document.createElement(e);
    if (n && "" != n)
        if (n instanceof Array)
            for (var o = 0; o < n.length; o++) t.classList.add(n[o]);
        else t.classList.add(n);
    return t
}

function genText(e, n) {
    var t = document.createElement(e);
    return t.innerText = n, t
}

function appendChildren(e, n) {
    for (var t = 0; t < n.length; t++) e.appendChild(n[t]);
    return e
}

function getRequest(e, n, t) {
    var o = new XMLHttpRequest;
    o.open("GET", e + n), o.onload = t, o.onerror = function() {
        console.log(this.responseText)
    }, o.send()
}

function postRequest(e, n, t) {
    var o = new XMLHttpRequest;
    o.open("POST", e), o.onload = t, o.onerror = function() {
        console.log(this.responseText)
    }, o.send(n)
}

function fetchPid() {
    if (!pid || !token) {
        var e = new XMLHttpRequest;
        e.onload = function() {
            var e = this.responseText.split("\n");
            pid = e[0], token = e[1], console.log("PID: " + pid + " Token: " + token)
        }, e.open("GET", "getcreds.php"), e.send()
    }
}

function restartMyDex() {
    var e = new FormData;
    e.append("mode", "removeall");
    var n = new XMLHttpRequest;
    n.open("POST", "delete.php"), n.onload = function() {
        console.log(JSON.parse(this.responseText))
    }, n.onerror = function() {
        console.log(this.responseText)
    }, n.send(e)
}

function getDex(e, n, t) {
    var o = new FormData;
    o.append("pid", e), o.append("token", n), t && o.append("force", "true");
    var r = new XMLHttpRequest;
    r.onload = function() {
        var e = JSON.parse(this.responseText);
        if (e.length > 1) {
            restartMyDex();
            for (i in e) console.log(e[i]), addPokemon(e[i])
        }
    }, r.open("POST", SERVICE_URL + "restart.php"), r.send(o)
}

function trade(e, n) {
    addToPokedex(n), removeFromPokedex(e)
}

function removeFromPokedex(e) {
    var n = new FormData;
    n.append("name", e);
    var t = new XMLHttpRequest;
    t.open("POST", "delete.php"), t.onload = function() {
        $(e).classList.add("unfound"), $(e).onclick = ""
    }, t.send(n)
}

function addPokemon(e) {
    var n = new FormData;
    n.append("name", e);
    var t = new XMLHttpRequest;
    t.open("POST", "insert.php"), t.onload = function() {
        console.log(JSON.parse(this.responseText))
    }, t.send(n)
}

function creds() {
    return "?pid=" + pid + "&token=" + token
}
var token, pid, SERVICE_URL = "https://webster.cs.washington.edu/pokedex-2/17au/";
