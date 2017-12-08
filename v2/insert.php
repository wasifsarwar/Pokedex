<?php
    /*
    Wasif Siddique
    Taking the name and optional nickname as a POST parameter, it puts the
    name into the database. If no nickname is provided then the stored nickname is
    the capitalized name of the pokemon to be inserted. If pokemon already exists,
    throws an error. Shows a success message upon successful insertion of pokemon
    to the database.
    */
    
    include 'common.php';
    
    $name = isset($_POST["name"]) ? $_POST["name"] : null;
    $nickname = isset($_POST["nickname"]) ? $_POST["nickname"] : null; 
    parameterValidity("name",$name);
    
    if (ifPokemonExists($database,$name)) {
        dieError("Error: Pokemon $name already found.");
    } 
   
    insertPokemon($database,$name,$nickname);
    successMessage("Success! $name added to your Pokedex!");
?>
