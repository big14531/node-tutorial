var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FB_DataSchema = new Schema({
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
mongoose.model( 'Facebook_object' , FB_DataSchema );

var TT_DataSchema = new Schema({
    created_at      : Date,
    _id             : String,
    tweet_type      : String,
    tweet_text      : String,
    create_by       : String,
    geo             : String,
    retweet_count   : String,
    favorite_count  : String,
    lang            : String,
    geo             : String
});
mongoose.model( 'Twitter_object' , TT_DataSchema );
