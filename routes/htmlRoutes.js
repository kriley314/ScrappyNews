var express = require( "express" );
var exphbs = require( "express-handlebars" );

// Require all models
var db = require( "../models" );

var router = express.Router();

router.get( "/", ( req, res ) => {
  res.render( "index" );
});

router.get( "/saved", ( req, res ) => {
	res.render( "saved" );
});

module.exports = router;
