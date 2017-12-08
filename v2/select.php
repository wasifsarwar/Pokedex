<?php
    /*
    Wasif Siddique, CSE 154 AI, Assignment 7
    output a JSON response of all Pokemon found in the Pokedex table, including the
    name, nickname, and found date/time for each Pokemon.
    */
    include 'common.php';
    $output = array();
    $output["pokemon"]= selectPokemon($database);
    print(json_encode($output,JSON_PRETTY_PRINT));
?>

