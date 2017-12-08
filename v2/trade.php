<?php
    /* 
    Wasif Siddique, CSE 154 AI, Assignment 7
    Takes player1 pokemon and player2 pokemon and swaps them. Deletes player1 pokemon from
    pokedex database and inserts player2 pokemon in player1 pokedex database. If player1 
    pokemon doesn't exist then throws error. If player1 already has player2 pokemon in 
    pokedex then throws error. Throws success message after completing trade.
    */
    include 'common.php';
    
    $mypokemon = isset($_POST["mypokemon"]) ? $_POST["mypokemon"]:null;
    $theirpokemon = isset($_POST["theirpokemon"]) ? $_POST["theirpokemon"]: null;
    
    parameterValidity("mypokemon",$mypokemon,"theirpokemon",$theirpokemon);
    missingPokemon($database,$mypokemon);  
    
    if (ifPokemonExists($database,$theirpokemon)) {
        dieError("Error: You have already found $theirpokemon");
    }
    
    insertPokemon($database,$theirpokemon);
    deletePokemon($database,$mypokemon);
    successMessage("Success! You have traded your $mypokemon for $theirpokemon");
?>