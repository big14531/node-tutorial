var Twitter = require('twitter');
var config = require( '../../config/config' );

var client = new Twitter({
    consumer_key        : config.twitterAuth.consumer_key,
    consumer_secret     : config.twitterAuth.consumer_secret,
    access_token_key    : config.twitterAuth.access_token_key,
    access_token_secret : config.twitterAuth.access_token_secret
});

var params = {
    screen_name :'Kom_chad_luek',
    count:100
};

exports.getTweet = function( req , res ) {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        console.log( req );
        res.render( 'tweet', {
            tweet : tweets
        } );
    });
}

