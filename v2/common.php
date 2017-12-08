<?php
    /*
    Wasif Siddique, CSE 154 AI, Assignment 7
    This php file contains shared code that is called in other php files to perform
    backend services such as inserting and deleting pokemons from the database, trading them
    and updating nicknames. Also throws error when necessary and prints json success message when
    certain thing to do is successful.
    */
    error_reporting(E_ALL);
    
    $database = new PDO("mysql:dbname=hw7;host=localhost;charset=utf8", "root", "");
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    header("Content-Type: application/json");
    date_default_timezone_set('America/Los_Angeles');
    
    #uses the pokedex database and a pokemon name that is passed. 
    # outputs the JSON result of the nickname, name and datefound of the selected pokemon
    # if no pokemon name is passed then prints out all the nickname, name and datefound for all
    # pokemon
    function selectPokemon($database,$pokemon = null) {
        if (isset($pokemon)) {
            $selectQuery = "SELECT name,nickname,datefound FROM Pokedex WHERE name = '$pokemon';";
        } else {
            $selectQuery = "SELECT name,nickname,datefound FROM Pokedex;";
        }
        $result = $database->query($selectQuery);
        
        $JSON_OUTPUT = [];
        
        foreach ($result as $row) {
            $poke_array = [
                "name" => $row["name"],
                "nickname" => $row["nickname"],
                "datefound" => $row["datefound"]
            ];
            $JSON_OUTPUT[] = $poke_array;
        }
        return $JSON_OUTPUT;
    }
    
    #checks if the passed pokemon exists in the given database
    function ifPokemonExists($database,$pokemon) {
        $JSON_OUTPUT = selectPokemon($database,$pokemon);
        if (count($JSON_OUTPUT) > 0) {
            return true;
        }
        return false;
    }
    
    #inserts a given pokemon with a nickname into a database. If no nickname 
    # is passed then capitalized pokemon name is placed in the nickname column
    function insertPokemon($database,$pokeName,$pokenickame = null) {
        $time = date('y-m-d H:i:s');
        $pokenickame = isset($pokenickame) ? $pokenickame : strtoupper($pokeName);
        $db = $database->query("INSERT INTO Pokedex  (name, nickname, datefound) " .
            "VALUES ('$pokeName', '$pokenickame', '$time' );");
    }
    
    #deletes a given pokemon from the given database
    function deletePokemon($database,$pokeName) {
        $database->query("DELETE FROM Pokedex WHERE name = '$pokeName';");
    }
    
    #throws a pokemon not found error if selected pokemon passed isn't found in
    # the database
    function missingPokemon($database,$selectedPokemon) {
        if (!ifPokemonExists($database,$selectedPokemon)) {
            dieError("Error: Pokemon $selectedPokemon not found in your Pokedex.");
        }
    }
    
    # sends a 400 bad requests, json outputs the passed error message. 
    # kills the following php functionality
    function dieError($error) {
        header("HTTP/2 400 Bad Request");
        echo json_encode(array(
            "error" => $error
            ), JSON_PRETTY_PRINT);
        die();
    }
    
    # json outputs the success message passed
    function successMessage($success) {
        echo json_encode(array(
            "success"=> $success
            ), JSON_PRETTY_PRINT);
    }
    
    
    #throws error if any parameter1 or parameter2 or both aren't existent or if their values
    # are null. bothParameters refer to if both parameters are supposed to exist.
    function parameterValidity($p1,$p1val,$p2 = null, $p2val = null, $bothParameters = true) {
        if ($bothParameters) {
            if (isset($p1) && isset($p2)) {
                if (!isset($p1val) && !isset($p2val)) {
                    dieError("Missing $p1 and $p2 parameters");
                } elseif (!isset($p1val)) {
                    dieError("Missing $p1 parameter");
                } elseif (!isset($p2val)) {
                    dieError("Missing $p2 parameter");
                }
            } elseif (isset($p1) && !isset($p1val)) {
                dieError("Missing $p1 parameter");
            } 
        } elseif (!isset($p1val) && !isset($p2val)) {
            dieError("Missing $p1 and $p2 parameters");
        }
    }   
?>