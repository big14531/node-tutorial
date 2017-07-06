var Twitter = require('twitter');
var config = require( '../../config/config' );
var social_db = require( 'mongoose' ).model( 'Twitter_object' );

var client = new Twitter({
    consumer_key        : config.twitterAuth.consumer_key,
    consumer_secret     : config.twitterAuth.consumer_secret,
    access_token_key    : config.twitterAuth.access_token_key,
    access_token_secret : config.twitterAuth.access_token_secret
});


/**
 * Function search tweet by name
 */
exports.searchTweet = function( req , res ) {
    // Set Param
    var params = {
        screen_name :req.query.twitter,
        count:100
    };

    // Get Data and injection function
    getTimelinebyName( params , function( tweets ) {
        res.render( 'tweet', {
            tweet : tweets
        }); 
    });
};  

/**
 * Function get and save tweet to database
 */
exports.getTweet = function( req , res , next ) {

    // Set Param
    var params = {
        screen_name :req.query.twitter,
        count:10
    };

    // Get Data and injection function1
    getTimelinebyName( params , function( tweets ) {

        var tweet_array = [];
        for (var i = 0, len = tweets.length; i < len; i++) 
        {
            var tweet = tweets[i];
            var data =
            {
                created_at      : tweet.created_at,
                tweet_id        : tweet.id_str,
                tweet_text      : tweet.text,
                create_by       : tweet.user.id_str,
                create_by_id    : tweet.user.screen_name,
                geo             : tweet.geo,
                retweet_count   : tweet.retweet_count,
                favorite_count  : tweet.favorite_count,
                lang            : tweet.lang,
                geo             : tweet.geo,
                url             : "https://twitter.com/"+tweet.user.id_str+"/status/"+tweet.id_str
            };
            tweet_array.push( data );
        } 
        // var social_object = new social_db( tweet_array );
        try {
            social_db.updateMany(
                { tweet_id  : tweet_array.tweet_id},
                { $set      : tweet_array },
                { upsert    : true }
            );
        } catch (e) {
            console.log( e );
        }
        console.log( "Total Get Tweet : "+tweet_array.length );
    });
};

/**
 * Function get tweet from api
 */
function getTimelinebyName( params , callback) {

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if( error ){ 
            console.log( error );
        }
        callback( tweets )
    });
    
}
