//jshint esversion:6

// Add the superheroes package and supervillains package
const superheroes = require('superheroes');
const supervillains = require('supervillains');

// Generate a random superhero name and a random supervillain name
var mySuperHeroName = superheroes.random();
var mySuperVillainName = supervillains.random();

//log the names to the console
console.log(mySuperHeroName);
console.log(mySuperVillainName);

//Add inspirational quotes package and generated a random quote
const Quote = require('inspirational-quotes');
var myQuote = Quote.getRandomQuote();
console.log(myQuote);

//Added movie quotes section
//Add popular-movie-quotes package and generate a random movie quote
const movieQuotes = require('popular-movie-quotes');
var myMovieQuote = movieQuotes.getRandomQuote();
console.log(myMovieQuote);

//Added famous last words section
//Add famous-last-words package and generate a random famous last words quote
const famousLastWords = require('famous-last-words');
var myFamousLastWords = famousLastWords[0];
console.log(myFamousLastWords);

// creates a local web server and displays the above variables
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

//Updated res.end and const fs to write the five separate text files
//in res.end, send the output to the browser
//in fs.writeFileSync, write five separate text files for each variable
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Super Hero: " + mySuperHeroName + "\n" +
          "Super Villain: " + mySuperVillainName + "\n" +
          "Quote of the Day: " + myQuote + "\n" +
          "Movie Quote: " + myMovieQuote + "\n" +
          "Famous Last Words: " + myFamousLastWords + "\n");
    
    const fs = require("fs");
  fs.writeFileSync("hero.txt", "Super Hero: " + mySuperHeroName );
  fs.writeFileSync("villain.txt", "Super Villain: " + mySuperVillainName );
  fs.writeFileSync("inspirational-quote.txt", "Quote of the Day: " + myQuote );
  fs.writeFileSync("popular-movie-quote.txt", "Movie Quote: " + myMovieQuote );
  fs.writeFileSync("famous-last-words.txt", "Famous Last Words: " + myFamousLastWords );

});

// Start the server and log message to the console
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});