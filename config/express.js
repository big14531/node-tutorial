// modules =================================================

var compression = require( 'compression' );
var express = require( 'express' );
var morgan = require( 'morgan' );
var bodyParser = require( 'body-parser' );
var sass = require( 'node-sass-middleware' );
var expressValidator = require( 'express-validator' );
var cookieSession = require( 'cookie-session' );
var cookieSession = require( 'mongoose' );

// Setting express App
module.exports = function () {
    var app = express();

    // Check Environments
    if( process.env.NODE_ENV === 'development' ){ app.use( morgan('dev') ); } 
    else{ app.use( compression() ); }

    // Set middleware
    app.use( morgan('dev'));
    app.use( bodyParser.urlencoded({ extended:true }));
    app.use( bodyParser.json() );
    app.use( expressValidator() );
    
    // view engine setup
    app.set( 'views' ,'./app/views' );
    app.set( 'view engine' , 'jade' );
   
    // require ALL PATH
    require( '../app/routes/index.route' )(app);

    // เอาไว้ก่อน express.static
    // css compress
    app.use( sass({
        src:'./sass',
        dest:'./public/css',
        outputStyle:'compressed',
        prefix:'/css',
        debug:true
    }));

    app.use( express.static( './public' ) );
    return app;
}