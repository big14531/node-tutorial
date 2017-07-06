module.exports = function (app) {
    var index = require( '../controllers/index.controller' );
    var user = require( '../controllers/user.controller' );
    var fb = require( '../controllers/fb.controller' );
    var tt = require( '../controllers/tt.controller' );
    var gg = require( '../controllers/gg.controller' );
    // INDEX ROUTE
    app.get( '/' , index.render );
    
    // USER ROUTE    
    app.post( '/login'  , user.login );
    app.post( '/logout' , user.logout );   

    // FACEBOOK ROUTE
    app.get( '/getFbPost'   , fb.getFbPost );
    app.get( '/extendToken' , fb.extendToken );

    // TWITTER ROUTE
    app.get( '/searchTweet' , tt.searchTweet );
    app.get( '/getTweet' , tt.getTweet );
    // GOOGLE ROUTE
    app.get( '/getGoogle' , gg.getTrends );   
    
}

