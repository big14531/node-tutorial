var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FB_DataSchema = new Schema({
    created_at      : Date,
    fb_id           : String,
    create_by       : String,
    lang            : String,
    geo             : String
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