<?php

    /*
    Wasif Siddique
    Stores player id and token and returns them for the frontend of the game-web service
    to verify players.
    */
    
    include 'common.php';
    
    header("Content-Type: text/plain");
    $token = "poketoken_5a2098ed340b96.08193604";
    $id = "wasifs";
    
    echo "$id\n$token";
?>
