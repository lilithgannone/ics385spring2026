//jshint esversion:6

// create an express object from the express package Learned more from Expressjs.
const express = require("express");
const bodyParser = require("body-parser");

// create an app object from the express object
const app = express();
// this allows the parsing of the html file using body parser
app.use(bodyParser.urlencoded({ extended: true }));

//this sends the html file to the web page using the root directory
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/f2cCalc.html");
});

//Human-written comment: Make the page refreshable.
app.get("/f2c", function (req, res) {
  res.sendFile(__dirname + "/VolCalculator.html");
});

// this gets the response from the values in the web page.
//Human-written comment: Found parseInt on w3schools.
app.post("/f2c", function (req, res) {
  var fahrenheit = parseInt(req.body.fahrenheit);

  // does the computation of the input variables, as numbers.
  //Human-written comment: Found math.round on w3schools.
  var celcius = Math.round(((fahrenheit - 32) * 5) / 9);

  // sends the results back to the web page.
  //Human-written comment: Had a hard time making the output display on the same page. Found some info online and on w3 schools.
  res.send(`<!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Fahrenheit to Centigrade Calculator</title>
    </head>
    <body>
  <!-- human written comments: title to display to users -->
  <h1>Fahrenheit to Centigrade Calculator</h1>
  <p> Please Enter a Whole Numeber. Only Whole Numbers Will be Accepted.</p>
  
  <!-- human written comments: prompt and accept user input -->
    <form action="/f2c" method="post">
      <input type="number" name="fahrenheit" placeholder="Temperature in Fahrenheit">
      <button type="submit">Convert to Celcius</button> <br>
      <p>Converted Temperature (As an Integer): = ${celcius} </p>
    </form>
  
    </body>
  </html>`);
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
