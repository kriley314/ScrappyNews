var express = require( "express" );
//var request = require( "request" );
var logger = require( "morgan" );
var mongoose = require( "mongoose" );
var axios = require( "axios" );
var cheerio = require( "cheerio" );

// Require all models
var db = require( "../models" );
var Article = require( "../models/Article.js" );
var Comment = require( "../models/Note.js" );

var router = express.Router();

// ============= ROUTES FOR HOME PAGE =============//

// Scrape data from NPR website and save to mongodb
router.get( "/scrape", function( req, res ) {
  // Grab the body of the html with request
console.log( "Here startng to scrape.." );
  axios.get( "http://www.npr.org/sections/news/archive" ).then( function( response ) {
    // Load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load( response.data );

    // Grab every part of the html that contains a separate article
    $( "div.archivelist > article" ).each( function( i, element ) {

      // Save an empty result object
      var result = {};

      // Get the title and description of every article, and save them as properties of the result object
      // result.title saves entire <a> tag as it appears on NPR website
      result.title = $( element ).find( "div.item-info" ).children( "h2.title" ).children( "a" ).text();
      // result.description saves text description
	    result.summary = $( element ).find( "div.item-info" ).children( "p.teaser" ).children( "a" ).text();
      // result.link saves text description
      result.link = $( element ).find( "div.item-info" ).children( "p.teaser" ).children( "a" ).attr( "href" );
      
      console.log( result );

      // Using our Article model, create a new entry
      var entry = new Article( result );

  console.log( "Created the Article entry for the DB." );
  
      // Now, save that entry to the db
      entry.save( function( err, doc ) {
        // Log any errors
        if ( err ) {
          console.log( err );
        }
        // Or log the doc
        else {
          console.log( doc );
        }
      });
    });

    // Reload the page so that newly scraped articles will be shown on the page
    res.send( "Scape complete" );
  });  
});

// This will get the articles we scraped from the mongoDB
router.get( "/articles", function( req, res ) {
  // Ask mongoose for all your Article data..
  db.Article.find({})
    .then( function( dbArticle ) {
      res.json( dbArticle );
    })
    .catch( function( err ) {
      // If an error has occurred, send it to the client..
      res.json( err );
    });
});

// Save an article
router.post( "/save/:id", function( req, res ) {
  // Use the article id to find and update it's saved property to true
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  // Execute the above query
  .exec( function( err, doc ) {
    // Log any errors
    if ( err ) {
      console.log( err );
    }
    // Log result
    else {
      console.log( "doc: ", doc );
    }
  });
});

// ============= ROUTES FOR SAVED ARTICLES PAGE =============//

// Grab an article by it's ObjectId
router.get( "/articles/:id", function( req, res ) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate( "notes" )
  // now, execute our query
  .exec( function( error, doc ) {
    // Log any errors
    if ( error ) {
      console.log( error );
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json( doc );
    }
  });
});

// Create a new note
router.post( "/note/:id", function( req, res ) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note( req.body );
  // And save the new note the db
  newNote.save( function( error, newNote ) {
    // Log any errors
    if ( error ) {
      console.log( error );
    }
    // Otherwise
    else {
      // Use the article id to find and update it's comment
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": newNote._id }}, { new: true })
      // Execute the above query
      .exec( function( err, doc ) {
        // Log any errors
        if ( err ) {
          console.log( err );
        }
        else {
          console.log( "doc: ", doc );
          // Or send the document to the browser
          res.send( doc );
        }
      });
    }
  });
});

// Remove a saved article
router.post( "/unsave/:id", function( req, res ) {
  // Use the article id to find and update it's saved property to false
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  // Execute the above query
  .exec( function( err, doc ) {
    // Log any errors
    if ( err ) {
      console.log( err );
    }
    // Log result
    else {
      console.log( "Article Removed" );
    }
  });
  res.redirect( "/saved" );
});

module.exports = router;
