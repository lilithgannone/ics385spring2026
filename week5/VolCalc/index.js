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
  res.sendFile(__dirname + "/VolCalculator.html");
});

//Human written comment: Make the page refreshable.
app.get("/VolCalc", function (req, res) {
  res.sendFile(__dirname + "/VolCalculator.html");
});

// this gets the response from the values in the web page.
//Human written comment:Found parseInt on w3schools.
app.post("/VolCalc", function (req, res) {
  var radius = parseInt(req.body.radius);
  var height = parseInt(req.body.height);

  // does the computation of the input variables, as numbers.
  //Human written comment: Found toFixed on w3schools.
  var volume = Math.PI * Math.pow(radius, 2) * height;
  var volumeformatted = volume.toFixed(2);

  // sends the results back to the web page.
  //Human written comment: Found some info online and on w3schools on how to make the output display on the same page.
  res.send(`<!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8" />
      <title>Cylinder Volume Calculator</title>
    </head>
    <body>
      <!-- human written comments: title to display to users -->
      <h1>Cylinder Volume Calculator</h1>
      <p>Please Fill in Radius and Height Below.</p>
  
      <!-- human written comments: prompt and accept user input -->
      <form action="/VolCalc" method="post">
      <input type="number" name="radius" placeholder="Radius" />
      <input type="number" name="height" placeholder="Height"/>
        <button type="submit">Calculate Volume</button> <br />
        <p>Volume of Cylinder: = ${volumeformatted}</p>
      </form>
    </body>
  </html>
  `);
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
