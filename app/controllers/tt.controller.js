var Twitter = require('twitter');
var config = require( '../../config/config' );

var client = new Twitter({
    consumer_key        : config.twitterAuth.consumer_key,
    consumer_secret     : config.twitterAuth.consumer_secret,
    access_token_key    : config.twitterAuth.access_token_key,
    access_token_secret : config.twitterAuth.access_token_secret
});



exports.getTweet = function( req , res ) {

    var params = {
        screen_name :req.query.twitter,
        count:100
    };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if( error ){ console.log( error );}
        res.render( 'tweet', {
            tweet : tweets
        } );
    });
}

