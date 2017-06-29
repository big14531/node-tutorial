var express = require( 'express' );
var morgan = require( 'morgan' );
var compression = require( 'compression' );
var bodyParser = require( 'body-parser' );
var sass = require( 'node-sass-middleware' );
var expressValidator = require( 'express-validator' );
var cookieSession = require( 'cookie-session' );

module.exports = function () {
    var app = express();
    if( process.env.NODE_ENV === 'development' ){
        app.use( morgan('dev') );
    } else{
        app.use( compression() );
    }
    app.use( cookieSession({
        name:'session',
        keys:[ 'secert_key1' , 'secert_key1' ]
    }));

    app.use( bodyParser.urlencoded({
        extended:true
    }));
    app.use( bodyParser.json() );
    app.use( expressValidator() );
    
    app.set( 'views' ,'./app/views' );
    app.set( 'view engine' , 'jade' );
   
    require( '../app/routes/index.route' )(app);

    // เอาไว้ก่อน express.static
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