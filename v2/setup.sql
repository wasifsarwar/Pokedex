-- Wasif Siddique, CSE 154 AI
-- Creates a hw7 database, creates a table Pokedex with 
-- three columns: “name” for each Pokemon’s name which also serves as the table’s PRIMARY KEY,
-- “nickname” for Pokemon’s nickname , and “datefound” for the date and time the pokemon found
CREATE DATABASE IF NOT EXISTS hw7;
use hw7;

-- drop old versions of Pokdex
DROP TABLE IF EXISTS Pokedex;


CREATE TABLE Pokedex (
    name VARCHAR(255),
    nickname VARCHAR(255),
    datefound DATETIME,
    PRIMARY KEY(name)
);
