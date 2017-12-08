! function() {
    "use strict";

    function e() {
        $("title").innerText = "Game Menu", hide([$("game-view"), $("main-menu-btn")]), hide(this), show($("menu-view"));
        for (var e = $$(".low-health"), n = 0; n < e.length; n++) e[n].classList.remove("low-health")
    }

    function n() {
        t(), $("new-game-btn").onclick = function() {
            J(this.id, "new-game-view")
        }, $("choose-pokemon-btn").onclick = function() {
            r("pokedex-view", pid), toggleDisplay($$("#new-game-view .part-iii")), this.classList.toggle("chosen-btn")
        }, $("start-game").onclick = function() {
            "" != F && ("" == Y && (Y = "-bot-"), x(Y))
        }
    }

    function t() {
        for (var e = $$(".opponent-btn"), n = 0; n < e.length; n++) e[n].onclick = function() {
            hide([$$("#new-game-view .part-ii"), $$("#new-game-view .part-iii")]), this.classList.toggle("chosen-btn");
            for (var n = $$("#new-game-view button"), t = 0; t < n.length; t++) n[t] != this && n[t].classList.remove("chosen-btn");
            for (t = 0; t < e.length; t++)
                if (e[t] != this)
                    if (this.classList.contains("chosen-btn")) e[t].classList.remove("chosen-btn"), "student" != this.id && hide($("choose-student")), show($$("#new-game-view .part-ii"));
                    else {
                        hide([$$("#new-game-view .part-ii")]), hide([$$("#new-game-view .part-iii")]);
                        for (var n = $$("#new-game-view button"), o = 0; o < n.length; o++) n[o].classList.remove("chosen-btn");
                        show(e[t])
                    }
            "student" == this.id ? (toggleDisplay($("choose-student")), $("choose-student").classList.contains("hidden") || (Y = "whitab")) : Y = this.id
        }
    }

    function o() {
        $("trade-btn").onclick = function() {
            J(this.id, "trade-view"), hide($("current-proposals-view")), hide($("new-proposal-view"))
        }, $("propose").onclick = function() {
            this.classList.toggle("chosen-btn"), this.classList.contains("chosen-btn") && $("view-proposals").classList.remove("chosen-btn"), hide($("current-proposals-view")), toggleDisplay($("new-proposal-view")), $("new-proposal-view").classList.contains("hidden") && (show($("show-p2-dex")), hide($("pokedices")))
        }, $("propose-submit").onclick = f, $("view-proposals").onclick = function() {
            toggleDisplay($("current-proposals-view")), this.classList.toggle("chosen-btn"), hide($("new-proposal-view")), this.classList.contains("chosen-btn") && ($("propose").classList.remove("chosen-btn"), a())
        }, $("show-p2-dex").onclick = function() {
            show([$$("#new-proposal-view .part-iv"), $("pokedices")]), this.classList.add("hidden"), r("my-pokemon", pid), r("their-pokemon", $("users").value)
        }, $("users").onchange = function() {
            r("my-pokemon", pid), r("their-pokemon", $("users").value)
        }
    }

    function s() {
        $("invite-btn").onclick = function() {
            i()
        }
    }

    function i() {
        getRequest(I + "list-games.php", creds(), k)
    }

    function r(e, n) {
        getRequest(I + "users.php", "?mode=pokemon&pid=" + n, function() {
            v(e, JSON.parse(this.responseText))
        })
    }

    function a() {
        var e = I + "list-trades.php";
        getRequest(e, creds(), c)
    }

    function p(e, n) {
        getRequest(I + "trade-info.php", creds() + "&trade_id=" + e, function() {
            h(JSON.parse(this.responseText), n)
        })
    }

    function d() {
        getRequest(I + "list-users.php", "", u)
    }

    function c() {
        var e = JSON.parse(this.responseText);
        0 == e.offers_from_me.length ? ($("trade-message").innerHTML = "There are no trades currently offered to you.", show($("trade-message"))) : l(e)
    }

    function l(e) {
        var n = "<tr><th>Player</th><th>Offer</th><th>Request</th><th>Date</th></tr>",
            t = e.offers_to_me;
        t.length > 0 ? $$("#to-you .results-table").innerHTML = n : $$("#to-you .results-table").innerHTML = "<p>You do not have any proposals to accept or decline.</p>";
        for (s = 0; s < t.length; s++) p(i = t[s], "to-me");
        var o = e.offers_from_me;
        o.length > 0 ? $$("#by-you .results-table").innerHTML = n : $$("#by-you .results-table").innerHTML = "<p>You do not have any proposals waiting to be accepted or declined by other players.</p>";
        for (var s = 0; s < o.length; s++) {
            var i = o[s];
            p(i, "by-you")
        }
        hide($("trade-message")), show([$("by-you"), $("to-you"), $$("#by-you .results-table"), $$("#to-you .results-table")])
    }

    function u() {
        for (var e = JSON.parse(this.responseText), n = $("users"), t = 0; t < e.length; t++)
            if (e[t] != pid) {
                var o = document.createElement("option");
                o.value = e[t], o.innerText = e[t], n.appendChild(o);
                var s = document.createElement("option");
                s.value = e[t], s.innerText = e[t], $("opps").appendChild(s)
            }
        $("opps").value = "whitab", $("users").value = "whitab", $("opps").onchange = function() {
            Y = this.value, show($("choose-pokemon-btn")), show($("start-game"))
        }
    }

    function h(e, n) {
        var t = gen("tr");
        t.id = e.id;
        var o = genText("td", e.offeree),
            s = gen("td"),
            i = genText("p", e.requested_pokemon),
            r = genText("p", e.offered_pokemon),
            a = $$("#pokedex-view .sprite[pokemon='" + e.requested_pokemon + "']").cloneNode();
        s.appendChild(i), i.appendChild(a);
        var p = gen("td"),
            d = $$("#pokedex-view .sprite[pokemon='" + e.offered_pokemon + "']").cloneNode();
        d.classList.remove("unfound"), p.appendChild(r), r.appendChild(d);
        var c = genText("td", e.created),
            l = gen("td");
        if (appendChildren(t, [o, p, s, c]), "to-me" == n) {
            var u = gen("button", "small-btn");
            u.innerText = "Accept";
            var h = gen("button", "small-btn");
            h.innerText = "Reject", appendChildren(l, [u, h])
        } else {
            var f = gen("button", "small-btn");
            f.innerText = "Cancel Request", l.appendChild(f), f.onclick = m
        }
        t.appendChild(l), $$("#" + n + " .results-table tbody").appendChild(t)
    }

    function m() {
        if (confirm("Are you sure you want to cancel this trade?")) {
            var e = this.parentNode.parentNode.id,
                n = new FormData;
            n.append("pid", pid), n.append("token", token), n.append("pokemon", this.parentNode.parentNode.querySelectorAll("td")[2].innerText.trim()), n.append("tradeid", e), postRequest(I + "cancel-trade.php", n, function() {
                alert("Trade successfully canceled"), a()
            })
        }
    }

    function f() {
        var e = $("offer").innerText,
            n = $("request").innerText;
        if ("" != e && "" != n) {
            var t = new FormData;
            t.append("pid", pid), t.append("pid2", $("users").value), t.append("token", token), t.append("pokemon", e), t.append("pokemon2", n), postRequest(I + "offer-trade.php", t, function() {
                alert("Proposal successful!")
            })
        } else alert("Please select a Pokemon to offer and request from the displayed Pokedex views.")
    }

    function v(e, n) {
        var t = $(e);
        g(e);
        for (var o = 0; o < n.length; o++) {
            var s = t.querySelector("img[pokemon='" + n[o] + "']");
            s.classList.remove("unfound"), s.onclick = "pokedex-view" == e ? _ : w
        }
    }

    function g(e) {
        for (var n = $(e).querySelectorAll(".sprite"), t = 0; t < n.length; t++) n[t].classList.add("unfound"), n[t].onclick = ""
    }

    function w() {
        this.parentNode.parentNode.querySelector("h2 span") ? this.parentNode.parentNode.querySelector("h2 span").innerText = this.getAttribute("pokemon") : (F = this.getAttribute("pokemon"), populateCard("choose-pokemon-card"), show($("start-game")))
    }

    function b() {
        getRequest(I + "pokedex.php", "?pokedex=all", y)
    }

    function k() {
        var e = JSON.parse(this.responseText);
        if (e.offered_by_me || e.offered_to_me || e.in_progress) {
            $("games-table").innerHTML = "<tr><th>Other Player</th></tr>", e.offered_by_me && L("Pending", "cancel", e.offered_by_me), e.offered_to_me && L("Pending", "accept", e.offered_to_me), e.in_progress && L("current", "join", e.in_progress)
        } else $$("#invite-results h3").innerHTML = "You currently have no games in progress or pending.";
        J("invite-btn", "invite-view")
    }

    function y() {
        for (var e = this.response.split("\n"), n = 0; n < e.length - 1; n++) {
            var t = e[n].split(":"),
                o = t[0],
                s = t[1],
                i = gen("img", ["sprite", "unfound"]);
            i.src = E + "sprites/" + s, i.setAttribute("pokemon", o), $("my-pokemon").appendChild(i), $("their-pokemon").appendChild(i.cloneNode()), $("pokedex-view").appendChild(i.cloneNode())
        }
    }

    function L(e, n, t) {
        for (var o = 0; o < t.length; o++) {
            var s = t[o][0],
                i = t[o][1];
            i == pid && (i = t[o][2]), i || (i = "(random)");
            var r = genText("td", i),
                a = gen("td"),
                p = gen("button", ["small-btn"]);
            if ("accept" == n) p.innerText = "Accept Invite", p.onclick = function() {
                q(this.parentNode.parentNode.id)
            }, a.appendChild(p);
            else if ("join" == n) p.innerText = "Continue Game", a.appendChild(p), p.onclick = function() {
                q(this.parentNode.parentNode.id)
            };
            else if ("cancel" == n) {
                var d = genText("span", "Invite Pending");
                a.appendChild(d)
            }
            var c = gen("tr");
            c.id = s, appendChildren(c, [r, a]), $("games-table").appendChild(c)
        }
        show($("games-table"))
    }

    function T(e) {
        var n = e;
        n.warning ? alert(n.warning) : (C(n), j = n.guid, $("title").innerText = "Pokemon Battle Mode!", O(), D(), hide([$("menu-view"), $("start-game")]), show([$("game-view"), $("main-menu-btn"), $("results-container")]))
    }

    function x(e) {
        if ("" == F) alert("Please select a Pokemon to start a game with.");
        else {
            var n = new FormData;
            n.append("opponent", e), n.append("mypokemon", F), n.append("pid", pid), n.append("token", token), postRequest(I + "create-game.php", n, function() {
                "-bot-" == e ? T(JSON.parse(this.responseText)) : (alert("Game invite sent successfully!"), i())
            })
        }
    }

    function q(e) {
        j = e, getRequest(I + "game-info.php", creds() + "&guid=" + e, function() {
            T(JSON.parse(this.responseText))
        })
    }

    function S(e, n) {
        e = "#" + e, $$(e + " .name").innerHTML = n.name, $$(e + " .pokepic").src = E + n.images.photo, $$(e + " .weakness").src = E + n.images.weaknessIcon, $$(e + " .type").src = E + n.images.typeIcon, $$(e + " .info").innerHTML = n.info.description, $$(e + " .hp").innerHTML = n.hp + "HP";
        for (var t = n.moves, o = $$(e + " .moves button"), s = 0; s < t.length; s++) {
            t[s].name;
            var i = o[s];
            i.classList.contains("hidden") && i.classList.remove("hidden"), i.children[0].innerText = t[s].name, i.children[2].src = E + "icons/" + t[s].type + ".jpg";
            var r = i.children[1];
            t[s].dp ? r.innerText = t[s].dp + " DP" : r.innerText = "", "#my-card" == e && (i.disabled = !1, i.onclick = function() {
                N(this.children[0].innerText)
            })
        }
        for (; s < 4;) o[s].classList.add("hidden"), s++
    }

    function N(e) {
        $("p1-turn-results").innerHTML = "", $("p2-turn-results").innerHTML = "", show($("loading")), e = e.toLowerCase();
        var n = new FormData;
        n.append("move", e), n.append("guid", j), n.append("pid", pid), n.append("token", token);
        var t = new XMLHttpRequest;
        t.onreadystatechange = function(e) {
            4 === t.readyState && (200 === t.status ? P(JSON.parse(this.responseText)) : alert(JSON.parse(t.statusText).error))
        }, t.open("POST", I + "move.php"), t.send(n)
    }

    function _() {
        $("start-game").classList.contains("hidden") && $("start-game").classList.remove("hidden");
        var e = this.getAttribute("pokemon");
        "" != e && (F = e, getRequest(I + "pokedex.php", "?pokemon=" + e, function() {
            var e = JSON.parse(this.responseText);
            S("chosen-card", e), S("my-card", e)
        }))
    }

    function C(e) {
        var n = e.pid1 == pid ? e.p1 : e.p2,
            t = e.pid1 == pid ? e.p2 : e.p1;
        S("my-card", n), S("their-card", t), H("my-card", n), H("their-card", t)
    }

    function P(e) {
        var n = e.pid1 == pid ? e.p1 : e.p2,
            t = e.pid1 == pid ? e.p2 : e.p1;
        H("my-card", n), H("their-card", t);
        var o = e.results,
            s = o["p1-result"],
            i = o["p2-result"];
        i && ($("p2-turn-results").innerHTML = "Player 2 played " + o["p2-move"] + " and " + i + "!"), s && ($("p1-turn-results").innerHTML = "Player 1 played " + o["p1-move"] + " and " + s + "!"), hide($("loading")), show([$("p1-turn-results"), $("p2-turn-results")])
    }

    function H(e, n) {
        if (!n.error) {
            var t = $(e);
            t.querySelector(".hp").innerText = n["current-hp"] + "HP", t.querySelector(".buffs").innerHTML = "", M($$("#" + e + " .buffs"), n.buffs, n.debuffs);
            var o = 1 * n["current-hp"] / n.hp;
            if (t.querySelector(".health-bar").style.width = 100 * o + "%", "my-card" == e) 0 == o ? R(!1) : o <= .2 && t.querySelector(".health-bar").classList.add("low-health");
            else if ("their-card" == e)
                if (0 == o) {
                    if (R(!0), "medskm" == pid || "-bot-" != Y) {
                        n.images.photo;
                        var s = n.name;
                        $("my-pokemon").querySelector(".sprite[pokemon=" + s + "]").classList.contains("unfound") && A(s)
                    }
                } else o <= .2 && t.querySelector(".health-bar").classList.add("low-health")
        }
        hide($("loading"))
    }

    function M(e, n, t) {
        for (var o = 0; o < n.length + t.length; o++) {
            var s = o < n.length ? n[o] : t[o],
                i = document.createElement("div");
            i.className = o < n.length ? "buff" : "debuff", i.classList.add(s), e.appendChild(i)
        }
        return e
    }

    function R(e) {
        for (var n = $("my-card").querySelectorAll(".moves button"), t = 0; t < n.length; t++) n[t].disabled = !0;
        $("title").innerHTML = "You " + (e ? "won!" : "lost!"), show([$("results-container"), $("endgame")])
    }

    function A(e) {
        var n = new FormData;
        n.append("name", e), postRequest("insert.php", n, function() {
            alert("Success! You have added " + e + " to your Pokedex!"), r("pokedex-view", pid), r("my-pokemon", pid)
        })
    }

    function O() {
        for (var e = $$(".opponent-btn"), n = 0; n < e.length; n++) e[n].classList.remove("chosen-btn"), e[n].classList.remove("hidden");
        e = $$(".menu-btn");
        for (n = 0; n < e.length; n++) e[n].classList.remove("chosen-btn")
    }

    function D() {
        for (var e = document.querySelectorAll(".sub-menu"), n = 0; n < e.length; n++) hide(e[n])
    }

    function J(e, n) {
        if ($(e).classList.contains("chosen-btn")) $(e).classList.remove("chosen-btn"), D();
        else {
            for (var t = document.querySelectorAll(".sub-menu"), o = document.querySelectorAll(".chosen-btn"), s = 0; s < o.length; s++) o[s] != e && o[s].classList.remove("chosen-btn");
            if ($(e).classList.add("chosen-btn"), $(n).classList.contains("hidden"))
                for (s = 0; s < t.length; s++) t[s] != $(n) ? hide(t[s]) : (show(t[s]), "trade-view" === n && (hide($("new-proposal-view")), hide($("current-proposals-view"))))
        }
    }
    var F = "",
        Y = "",
        j = "",
        I = "https://webster.cs.washington.edu/pokedex-2/17au/",
        E = "https://webster.cs.washington.edu/pokedex/";
    window.onload = function() {
        fetchPid(), b(), d(), n(), s(), o(), $("main-menu-btn").onclick = e, $("endgame").onclick = e, $("restart-btn").onclick = function() {
            confirm("Are you sure you want to remove all Pokemon from your Pokedex and start with three new random Pokemon?") && getDex(pid, token, !0)
        }
    }
}();
