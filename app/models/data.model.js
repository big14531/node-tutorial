var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 *      Facebook Collection list 
 * 
 *          -   fb_post_collection      =>      Store all post data ( post_id , message , created_date , likes , shares  , .... )
 *          -   fb_page_collection      =>      Store all page data ( page_id , page_name , insight(?) , ..... )
 * 
 * 
 */
var fb_post_schema = new Schema({
    created_at      : Date,
    _id             : String,
    post_id         : String,
    page_id         : String,
    name            : String,
    type            : String,    
    message         : String,
    description     : String,
    link            : String,
    permarklink     : String,
    reaction        : String
});

var fb_page_schema = new Schema({
    created_at      : Date,
    _id             : String,
    post_id         : String,
    page_id         : String,
    name            : String,
    type            : String,    
    message         : String,
    description     : String,
    link            : String,
    permarklink     : String,
    reaction        : String
});

mongoose.model( 'fb_post_collection' , fb_post_schema );
mongoose.model( 'fb_page_collection' , fb_page_schema );


/**
 *      Twiiter Collection list
 * 
 *          -   tt_tweet_collection     =>  Store all tweet data
 *          -   tt_user_collection      =>  Store all user data
 * 
 */         
var tt_tweet_schema = new Schema({
    _id             : Date,
    created_at      : String,
    tweet_text      : String,
    create_by       : String,
    create_by_sname : String,
    geo             : String,
    retweet_count   : String,
    favorite_count  : String,
    lang            : String,
    geo             : String,
    url             : String
});

var tt_user_schema = new Schema({
    created_at      : Date,
    _id             : String,
    tweet_type      : String,
    tweet_text      : String,
    retweet_count   : String,
    create_by       : String,
    geo             : String,
    favorite_count  : String,
    lang            : String,
    geo             : String
});

mongoose.model( 'tt_tweet_collection' , tt_tweet_schema );
mongoose.model( 'tt_user_collection' , tt_user_schema );