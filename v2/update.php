<?php
    /*
    Wasif Siddique
    Updates a Pokemon in the Pokedex table with the given name (case-insensitive) parameter to have
    the given nickname (overwriting any previous nicknames). Throws error if pokemon is missing.
    */
    include 'common.php';
    
    $name = isset($_POST["name"]) ? $_POST["name"] : null;
    $nickname = $_POST["nickname"] ? $_POST["nickname"] : null; 
    parameterValidity("name",$name,"nickname",$nickname);
    missingPokemon($database,$name);
    
    $database->query("UPDATE Pokedex SET nickname = '$nickname' WHERE name = '$name'");
    successMessage("Success! Your $name is now named $nickname!");
?>
