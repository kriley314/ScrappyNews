var express = require( "express" );
var bodyParser = require("body-parser");
var mongoose = require( "mongoose" );
var exphbs = require( "express-handlebars" );
var logger = require( "morgan" );

// Requiring my models..
var Article = require( "./models/Article.js" );
var Note = require( "./models/Note.js" );

// My routes..
var htmlRouter = require( "./routes/htmlRoutes.js" );
var articleRouter = require( "./routes/articleRoutes.js" );

// Our scraping tools
var axios = require( "axios" );
var cheerio = require( "cheerio" );

// Initialize Express
var PORT = process.env.PORT || 3000;
var app = express();

// Use body parser with the app
app.use( bodyParser.urlencoded({
    extended: false
}));
  
// Initialize Handlebars
app.engine( "handlebars", exphbs({ defaultLayout: "main" }));
app.set( "view engine", "handlebars" );
  
// Routing
app.use( "/", htmlRouter );
app.use( "/", articleRouter );

// Make public a static dir
app.use( express.static( "public" ));

// Database configuration with mongoose
var URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news-scraper'; 
mongoose.connect( URI );
var db = mongoose.connection;

// Show any mongoose errors
db.on( "error", function( error ) {
  console.log( "Mongoose Error: ", error );
});

// Once logged in to the db through mongoose, log a success message
db.once( "open", function() {
  console.log( "Mongoose connection successful." );
});

// Listen on port 3000
app.listen(port, function() {
  console.log( "App running on port 3000!" );
});

/*
app.use( express.urlencoded({ extended: false }));
app.use( express.json());
app.use( express.static( "public" ));

app.engine( "handlebars",
    exphbs({
      defaultLayout: "main"
    })
);

app.set( "view engine", "handlebars" );

require( "./routes/htmlRoutes" )( app );

// Use morgan logger for logging requests
app.use( logger( "dev" ));

// Parse request body as JSON
app.use( express.urlencoded({ extended: true }));
app.use( express.json());

// Make public a static folder
app.use( express.static( "public" ));

app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set( "view engine", "handlebars" );
  
  
  
// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
var MONGODB_URI = "mongodb://localhost/mongoHeadlines";
mongoose.connect( MONGODB_URI, { useNewUrlParser: true });

console.log( "Still initializing things in server.js" );

// A GET route for scraping the echoJS website
app.get( "/scrape", function( req, res ) {

console.log( "Here in the scrape route.." );

    // First, we grab the body of the html with axios
//    axios.get( "http://www.echojs.com/" ).then( function( response ) {
    axios.get( "http://www.npr.org/" ).then( function( response ) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load( response.data );
  
      // Now, we grab every h2 within an article tag, and do the following:
      $( "article h2" ).each( function( i, element ) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $( this )
          .children( "a" )
          .text();
        result.link = $( this )
          .children( "a" )
          .attr( "href" );
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create( result )
          .then( function( dbArticle ) {
            // View the added result in the console
            console.log( dbArticle );
          })
          .catch( function( err ) {
            // If an error occurred, log it
            console.log( err );
          });
      });
  
      // Send a message to the client
      res.send( "Scrape Complete" );
    });
});

// Route for getting all Articles from the db
app.get( "/articles", function( req, res ) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then( function( dbArticle ) {
        // If we were able to successfully find Articles, send them back to the client
        res.json( dbArticle );
    })
    .catch( function( err ) {
        // If an error occurred, send it to the client
        res.json( err );
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get( "/articles/:id", function( req, res ) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate( "note" )
      .then( function( dbArticle ) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json( dbArticle );
      })
      .catch( function( err ) {
        // If an error occurred, send it to the client
        res.json( err );
      });
});
  
// Route for saving/updating an Article's associated Note
app.post( "/articles/:id", function( req, res ) {
    // Create a new note and pass the req.body to the entry
    db.Note.create( req.body )
    .then( function( dbNote ) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then( function( dbArticle ) {
        // If we were able to successfully update an Article, send it back to the client
        res.json( dbArticle );
    })
    .catch( function( err ) {
        // If an error occurred, send it to the client
        res.json( err );
    });
});
  
console.log( "About to start listening.." );

// Start the server
app.listen( PORT, function() {
    console.log( "App running on port " + PORT + "!" );
});
*/