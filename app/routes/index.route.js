module.exports = function (app) {
    var index = require( '../controllers/index.controller' );
    var user = require( '../controllers/user.controller' );
    var fb = require( '../controllers/fb.controller' );
    var tt = require( '../controllers/tt.controller' );
    var gg = require( '../controllers/gg.controller' );
    // INDEX ROUTE
    app.get( '/' , index.render );

    // FACEBOOK ROUTE
    app.get( '/getPosts'   , fb.getPosts );
    app.get( '/getPage'   , fb.getPage );
    // TWITTER ROUTE
    app.get( '/getUserTweet' , tt.getUserTweet );
    app.get( '/searchTweet' , tt.searchTweet );
    app.get( '/getTweet' , tt.getTweet );
    app.get( '/getUser' , tt.getUser );
    
    // GOOGLE ROUTE
    app.get( '/getTrends' , gg.getTrends );   
    
}

