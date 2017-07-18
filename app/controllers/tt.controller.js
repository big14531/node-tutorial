var Twitter = require('twitter');
var config = require( '../../config/config' );
var social_db = require( 'mongoose' ).model( 'tt_tweet_collection' );

var client = new Twitter({
    consumer_key        : config.twitterAuth.consumer_key,
    consumer_secret     : config.twitterAuth.consumer_secret,
    access_token_key    : config.twitterAuth.access_token_key,
    access_token_secret : config.twitterAuth.access_token_secret
});

/**
* 
*      Callable API Function 
* 
*/


/**
* Function get tweet by name
*/
exports.getUserTweet = function( req , res ) {
    // Set Param

    var params = {
        screen_name :req.query.twitter||'me',
        count:200
    };

    // Get Data and injection function
    getTimelinebyName( limit=0 , params , function( limit , params ,tweets ) {
        res.render( 'tweet', {
            tweet : tweets
        }); 
    });
};  


/**
* Function search tweet by keyword
*/
exports.searchTweet = function( req , res ) {
    // Set Param
    var params = {
        q : req.query.twitter||'me',
        // result_type : "popular"
        result_type : "recent"
    };

    // Get Data and injection function
    searchTweetByKeyword( params , function( tweets ) {
        console.log( tweets );
        res.render( 'tweet', {
            tweet : tweets.statuses
        }); 
    });

};  

/**
* Function get and save tweet to database
*/
exports.getTweet = function( req , res , next ) {

    // Set Param
    var max_id=null;
    const limit = 3200;                /** Max tweet that api can acces*/
    var params = {
        screen_name :"Chanokporn",
        trim_user   :false,
        include_rts :false,         /** Is Include Retweet?*/
        count       :200            /** Max call per 15 mins*/
    };
 
    // Get Data and injection function1
    getTimelinebyName( limit , params , callbackGetTimeline );
    
};

/**
* Function get user data from screen and or id , can select multiple user 
*/
exports.getUser = function( req , res , next ) {

    // Set Param
    var max_id=null;
    const limit = 3200;                /** Max tweet that api can acces*/

    var params = {
        screen_name :"Chanokporn,9GAG"
    };
 
    // Get Data and injection function1
    getUserData( params , function (data) {
        console.log( data );
    });
    
};



/**
* 
*      Helper Function 
* 
*/


/**
*  Function callback for get all timeline tweet
* 
* @param {* Max tweet that can get : 3200} limit 
* @param {* Param for API} params 
* @param {* Tweet list } tweets 
*
*/
function callbackGetTimeline( limit , params , tweets ) {
    if ( params.count > limit ) {
        return;
    }
    var tweet_array = [];
        for (var i = 0, len = tweets.length; i < len; i++) 
        {
            var tweet = tweets[i];
            var data =
            {
                _id             : tweet.id_str,     /** If this exist , not insert to mongooo!!!!*/
                created_at      : tweet.created_at,
                tweet_text      : tweet.text,
                create_by       : tweet.user.id_str,
                create_by_sname : tweet.user.screen_name,
                geo             : tweet.geo,
                retweet_count   : tweet.retweet_count,
                favorite_count  : tweet.favorite_count,
                lang            : tweet.lang,
                geo             : tweet.geo,
                url             : "https://twitter.com/"+tweet.user.id_str+"/status/"+tweet.id_str
            };
            
            var social_object = new social_db( data );
            social_object.save();
            tweet_array.push( data );
        } 
        
    console.log( "Date : "+tweets[tweets.length-1].created_at );
    console.log( "Total Get Tweet : "+tweets.length );
    console.log( "===========" );

    // Set New Max_id and count
    params.max_id = tweets[tweets.length-1].id_str;
    params.count += 200;

    // Call itself again , inject new max_id and new count
    getTimelinebyName( limit , params , callbackGetTimeline );
}


/**
* Function get tweet from api
* 
* @param {*} limit 
* @param {*} params 
* @param {*} callback 
*
*/
function getTimelinebyName( limit , params , callback) {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if( error ){ 
            console.log( error );
        }
        callback( limit , params , tweets )
    });
    
}

/**
* Function get followers data by user_id or screen_name
* 
* @param {*} param 
* @param {*} callback 
*
*/
function getUserData( params , callback ) {
    client.get('users/lookup', params, function(error, user, response) {
        if( error ){ 
            console.log( error );
        }
        callback( user );
    });
}

/**
 * Function search tweet from keyword
 * 
 * @param {*} params 
 * @param {*} callback 
 */
function searchTweetByKeyword( params , callback ) {
    client.get('search/tweets', params , function(error, tweets, response) {
        if( error ){ 
            console.log( error );
        }
        callback( tweets )
    });
}

/**
 * Function get follower data or follower id from user_id or screen_name
 * 
 * @param {*} params 
 * @param {*} callback 
 */
function getFollowerData( params , callback) {
    client.get('search/tweets', params , function(error, tweets, response) {
        if( error ){ 
            console.log( error );
        }
        callback( tweets )
    });
}