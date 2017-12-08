<?php

    /*
    Wasif Siddique, CSE 154 AI
    Given the pokemon name, deletes the corresponding pokemon name and details from
    the database. If Pokemon is missing in the database then throws an error. Given a mode
    equal removeall, removes the whole Pokdex table in the database. If passed mode isn't equal 
    to removeall, throws an error.
    */
    include 'common.php';
    
    $pokeName = isset($_POST["name"]) ? $_POST["name"] : null;
    $mode = isset($_POST["mode"]) ? $_POST["mode"]: null;
    parameterValidity("name",$pokeName,"mode",$mode,false);
    
    if (isset($pokeName)) {
        missingPokemon($database,$pokeName);
        deletePokemon($database,$pokeName);
        successMessage("Success! $pokeName removed from your Pokedex!");
    } elseif (isset($mode)) {
        if ($mode !== "removeall") {
            dieError("Error: Unknown mode $mode");
        }
        $database->query("TRUNCATE TABLE Pokedex;");
        successMessage("Success! All Pokemon removed from your Pokedex!");
    }
?>