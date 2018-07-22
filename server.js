////////////////////////////
// DEPENDENCIES
////////////////////////////
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
////////////////////////////

// Set up port
var PORT = process.env.PORT || 3000;

// Instantiate Express App
var app = express();

// Express router
var router = express.Router();

// Require routes
require("./config/routes")(router);

// public folder is now static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to Express
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");

// Use bodyparser in app
app.use(bodyParser.urlencoded({
    extended: false
}));

// All requests go through router middleware
app.use(router);

// Used deployed db or local mongoosescraper db
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoosescraper";

// Connect mongoose to db
mongoose.connect(db, function(error) {
    // log errors when connecting to mongoose
    if (error) {
        console.log(error);
    } else {
        console.log("mongoose connection is successful");
    }
});

// Listen on port
app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
});
