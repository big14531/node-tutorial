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
    created_time    : Date,
    from            : { type : Object },
    id              : { type : String , unique : true, required : true, dropDups: false },
    post_id         : { type : String },
    page_id         : { type : String },
    name            : { type : String },
    type            : { type : String },    
    picture         : { type : String },
    object_id       : { type : String },
    link            : { type : String },
    permalink_url   : { type : String },
    message         : { type : String },
    description     : { type : String },
    message_tags    : { type : JSON },
    place           : { type : JSON },
    feed_targeting  : { type : JSON },
    likes           : { type : JSON },
    comments        : { type : JSON },
    reactions       : { type : JSON },
    shares          : { type : JSON },
    is_delete       : { type : Boolean }
});

var fb_page_schema = new Schema({
    id                              : { type : String , unique : true, required : true, dropDups: false },
    about                           : { type : String },
	fan_count                       : { type : String },
	category_list                   : { type : String },
	link                            : { type : String },
	website                         : { type : String },
	cover                           : { type : JSON },
	name                            : { type : String }, 
	category                        : { type : String },   
	displayed_message_response_time : { type : String },
	engagement                      : { type : JSON },
	is_verified                     : { type : String },
	verification_status             : { type : String },
	location                        : { type : JSON },
	talking_about_count             : { type : String },
	picture                         : { type : JSON } 
});

mongoose.model( 'fb_post_collection' , fb_post_schema );
mongoose.model( 'fb_page_collection' , fb_page_schema );
fb_post_model = mongoose.model( 'fb_post_collection' , fb_post_schema );
fb_page_model = mongoose.model( 'fb_page_collection' , fb_page_schema );



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

exports.insertPostFacebook = function( data ){
    data.forEach(function(item) {
        fb_post_model.update(
            { id : item.id },
            { $set : item },
            { upsert : true },
            function(err){
                if(err) console.log(err);
            }
        );
    });
    console.log('Save Post Complete : '+data.length);
};

/**
*   Function insert Post facebook
*       update and replace data
* 
*/
exports.insertPageFacebook = function( data ){
    fb_page_model.update(
        { id : data.id },
        { $set : data },
        { upsert : true },
        function(err){
            if(err) console.log(err);
        }
    );
    console.log('Save Complete');
};

/**
 *  Function get post facebook
 *  
 * 
 */
exports.getPostFacebook = function( query , callback ){
    fb_post_model.aggregate( 
        query,
        function(err,result){
            callback( result );
            return result;
        } 
    );
}