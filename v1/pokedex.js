/*
Wasif Siddique, CSE 154 AI
Homework 5

This is the javascript program that implements views for a pokedex and two pokemon cards.
*/

/*global fetch*/
"use strict";

(function() {
  
    function $(id){ return document.getElementById(id); }
    function qs(selector){ return document.querySelector(selector); }
    function qsa(selector){ return document.querySelectorAll(selector); }
    
    let pokeFound = [];
    let gameID = null; 
    let playerID = null;
    let pokeSelect = null; //pokemon that player 1 selects to play
    let pokeHP = null; //HP of the pokemon selected
    
    //loads the pokedex as the window loads 
    
    window.onload = function(){
        getPokedex();
    };
    
    // Selects the sprite which is clicked on to get their card view 
    function getPokemon() {
        let allSprites = qsa('.sprite');
        for ( let i = 0; i < allSprites.length; i++) {
            allSprites[i].onclick = getCard;
        }    
    }
    
    // gets the pokedex data from from a Pokedex API that returns a plain text response with
    // all 151 pokemon names and sprite image names each on its own line
    function getPokedex() {
        let url = "https://webster.cs.washington.edu/pokedex/pokedex.php?pokedex=all";
        fetch(url)
         .then(checkStatus)
         .then(fillPokedex)
         .then(getPokemon);
    }
    
    // fills out the pokedex in the HTML with the response data received from the Pokedex API
    function fillPokedex(response) {
        let pokeList = response.split('\n');
        for (let i=0; i<pokeList.length; i++) {
            let pokeicon = document.createElement("img");
            pokeicon.classList.add("sprite");
            let imgsrc = pokeList[i].split(':');
            pokeicon.id = imgsrc[0];
            pokeicon.src = "sprites/" + imgsrc[1];
            pokeicon.classList.add("unfound");
            if (pokeList[i].includes("Bulbasaur") || pokeList[i].includes("Charmander") ||
            pokeList[i].includes("Squirtle")) {
                pokeFound.push(pokeicon.id);
                pokeicon.classList.remove("unfound");
            }
            $("pokedex-view").appendChild(pokeicon);
        }
    }
  
    // checks the status of the response from a request, returns response text if succeeds,
    // error message if fails
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
    
    // Requests data for a certain pokemon sprite that contains the card information for that pokemon
    function getCard() {
        if (!this.classList.contains("unfound")) {
            let id = this.id;
            let url = "https://webster.cs.washington.edu/pokedex/pokedex.php?pokemon=" + id;
            fetch(url)
            .then(checkStatus)
            .then(JSON.parse)
            .then(myCard);
        }
    }
    
    //uses the reponse from the API to fill the card with information. Lets the user
    // choose a pokemon to battle
    function myCard(response) {
        pokeSelect = response.name;
        pokeHP = response.hp;
        fillCard(response,"#my-card");
        $("start-btn").classList.remove("hidden");
        $("start-btn").onclick = gameRequest;
    }
    
    //fills up the card with information like name, hp, type and adds images and descriptions
    // response is the data from the API with card information
    // whichCard refers to the either of the player 1 or 2 pokemon cards
    function fillCard(response, whichCard) {
        qs(whichCard +' .name').innerHTML = response.name;
        qs(whichCard +' .hp').innerHTML = response.hp + "HP";
        qs(whichCard +' .type').src = response.images.typeIcon;
        qs(whichCard +' .pokepic').src = response.images.photo;
        qs(whichCard +' .weakness').src = response.images.weaknessIcon;
        qs(whichCard +' .info').innerHTML = response.info.description;
        
      for (let i=0; i<4; i++) {
          if (i<response.moves.length) {
              qsa(whichCard +" button")[i].classList.remove("hidden");
              getMoves(response,whichCard);
          } else {
              qsa(whichCard +" button")[i].classList.add("hidden");
          }
      }
    }
    
    // fills the card with moves and moves icon, also adds DP if applicable
    // response is the data from the API with card information
    // whichCard refers to the either of the player 1 or 2 pokemon cards

    function getMoves(response,whichCard) {
        for (let i=0; i<response.moves.length; i++) {
            qsa(whichCard +" .move")[i].innerHTML = response.moves[i].name;
            let typeIcon = response.moves[i].type;
            qsa(whichCard +" .moves img")[i].src = "icons/" + typeIcon+".jpg"; 
            if (response.moves[i].dp) {
                qsa(whichCard +" .dp")[i].innerHTML = response.moves[i].dp + " DP";
            } else {
                qsa(whichCard +" .dp")[i].innerHTML = "";
            }
        }
    }
   
    //starts the game and requests for data containing information about the opponent
    // pokemon card
    function gameRequest() {
        $("pokedex-view").classList.add("hidden");
        $("their-card").classList.remove("hidden");
        qs("#my-card .hp-info").classList.remove("hidden");
        $("results-container").classList.remove("hidden");
        $("p1-turn-results").classList.remove("hidden");
        $("p2-turn-results").classList.remove("hidden");
        $("flee-btn").classList.remove("hidden");
        $("start-btn").classList.add("hidden");
        $("title").innerHTML = "Pokemon Battle Mode!";
        
        for (let i=0; i<qsa('.buffs').length; i++) {
            qsa('.buffs')[i].classList.remove("hidden");    
        }    
        
        let url = "https://webster.cs.washington.edu/pokedex/game.php";
        let data = new FormData();
        data.append("startgame",true);
        data.append("mypokemon",pokeSelect);
        
        fetch(url, {method:"POST", body:data})
            .then(checkStatus)
            .then(JSON.parse)
            .then(gameView);
    }
    
    // fills the opponent card by using fetched response data, also enables the flee option
    function gameView(response) {
        gameID = response.guid;
        playerID = response.pid;
        fillCard(response.p2,"#their-card");
        
        let allMyMoves = qsa('#my-card .moves button');
        for ( let i = 0; i < allMyMoves.length; i++) {
            allMyMoves[i].onclick = playGame;
        }   
        $("flee-btn").onclick = flee;
    }
    
    // fetches game status data according to the moves the user makes. Enables a loading pikachu screen
    // while a move loads
    function playGame() {
        let myMove = this.children[0].innerHTML.toLowerCase();
        
        let url = "https://webster.cs.washington.edu/pokedex/game.php";
        let data = new FormData();
        data.append("guid",gameID);
        data.append("pid",playerID);
        data.append("move", myMove);
        
        $("loading").classList.remove("hidden");
        
        fetch(url, {method:"POST", body:data})
            .then(checkStatus)
            .then(JSON.parse)
            .then(playMove);
        
        $("loading").classList.add("hidden");
    }
    
    // updates game and the game view status as the user plays a move. Declares victory or
    // loss according to the pokemon HP, also shows what moves the player made and if it hit the 
    // opponent.
    // response is the data received from the pokemon API containing information about the game 
    // as the user plays a move
    function playMove(response) {
        getHealth(response.p1,"#my-card");
        getHealth(response.p2, "#their-card");
        getBuffs(response.p1, "#my-card");
        getBuffs(response.p2, "#their-card");
        
        if (response.p2["current-hp"] == 0 || response.p1["current-hp"] == 0) {
            if (response.p2["current-hp"] == 0 ) {
                $("title").innerHTML = "You won!";
                if (!pokeFoundContains(pokeFound,response.p2.name)) {
                    pokeFound.push(response.p2.name);
                    $(response.p2.name).classList.remove("unfound");
                }
            } else if (response.p1["current-hp"] == 0) {
                $("title").innerHTML = "You lost!";
            }
            $("endgame").classList.remove("hidden");
        }
        $("p1-turn-results").innerHTML = "Player 1 played " + response.results["p1-move"] +
            " and " + response.results["p1-result"] + "!";
        if (!response.p2["current-hp"] == 0) {    
            $("p2-turn-results").innerHTML = "Player 2 played " + response.results["p2-move"] +
                " and " + response.results["p2-result"] + "!";
        } else {
            $("p2-turn-results").innerHTML = "";
        } 
        $("endgame").onclick = endgame;  
        
    }
    
    // Returns if a pokemon exists in an array 
    function pokeFoundContains (pokeFound,pokename) {
        for (let i=0; i < pokeFound.length; i++) {
            if (pokeFound[i] === pokename) {
                return true;
            }
        }
        return false;
    }
    
    // fills out the healthbar according to the game state, also shows low-health red bar
    // when health is below 20% of either pokemon duelling
    // response is the data that contains pokemon info like hp and current hp
    // whichCard refers to either one of the two player 1 and opponent pokemon cards
    function getHealth(response, whichCard) {
        qs(whichCard + " .hp").innerHTML = response["current-hp"];
        let healthPercentage = response["current-hp"] / response.hp * 100;
        qs(whichCard + " .health-bar").style.width = healthPercentage + "%";
        if (healthPercentage < 20) {
            qs(whichCard + " .health-bar").classList.add("low-health");
        } else {
            qs(whichCard + " .health-bar").classList.remove("low-health");
        }
    }
    
    // shows the buffs in each of the card.
     // response is the data that contains pokemon info like hp and current hp and buffs
    // whichCard refers to either one of the two player 1 and opponent pokemon cards
    function getBuffs(response, whichCard) {
        qs(whichCard + " .buffs").innerHTML = "";
        for (let i=0; i<response.buffs.length; i++) {
            let buff = document.createElement("div");
            buff.classList.add("buff") ;
            buff.classList.add(response.buffs[i]);
            qs(whichCard + " .buffs").appendChild(buff);
        }
        
        for (let i=0; i<response.debuffs.length; i++) {
            let debuff = document.createElement("div");
            debuff.classList.add("debuff") ;
            debuff.classList.add(response.debuffs[i]);
            qs(whichCard + " .buffs").appendChild(debuff);
        }
    }
    
    //fetches data about fleeing the duel and following game results. Adds a pikachu loading
    // screen during the request
    function flee() {
        let url = "https://webster.cs.washington.edu/pokedex/game.php";
        let data = new FormData();
        data.append("guid",gameID);
        data.append("pid",playerID);
        data.append("move", "flee");
        
        $("loading").classList.remove("hidden");
        
        fetch(url, {method:"POST", body:data})
            .then(checkStatus)
            .then(JSON.parse)
            .then(fledTheGame);
        
        $("loading").classList.add("hidden");
    }
    
    //Shows the game status after fleeing the duel using the response from the flee request
    // response contains game state data after player 1 pokemon flees
    function fledTheGame(response) {
        $("p1-turn-results").innerHTML = "Player 1  " + response.results["p1-move"] + 
            " and " + response.results["p1-result"] + "!";
        $("p2-turn-results").innerHTML = "";
        qs("#my-card .hp").innerHTML = "0HP";
        qs("#my-card .health-bar").style.width = "0%";
        qs("#my-card .health-bar").classList.add("low-health");
        $("flee-btn").classList.add("hidden");
        $("endgame").classList.remove("hidden");
        $("endgame").onclick = endgame;  
    } 
    
    // makes the pokedex visible after the game ends, most recent pokemon chosen populates
    // the player 1 card. Restores pokemon health, removes the flee button, shows the correct title
    // and clears the results container.
    function endgame() {
        $("flee-btn").classList.add("hidden");
        $("endgame").classList.add("hidden");
        $("their-card").classList.add("hidden");
        $("pokedex-view").classList.remove("hidden");
        qs("#my-card .buffs").classList.add("hidden");
        qs("#my-card .health-bar").style.width = "100%";
        qs("#my-card .hp").innerHTML = pokeHP + "HP";
        $("results-container").classList.add("hidden");
        $("p1-turn-results").classList.add("hidden");
        $("title").innerHTML = "Your Pokedex";
        $("start-btn").classList.remove("hidden");
    }
    
})();