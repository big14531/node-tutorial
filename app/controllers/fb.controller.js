var FB = require('fb');
var graph = require('fbgraph');
var curl = require('curl');
var social_db = require( 'mongoose' ).model( 'fb_post_collection' );
var config = require( '../../config/config' );

FB.setAccessToken(config.facebookAuth.fb_access_token);
graph.setAccessToken(config.facebookAuth.fb_access_token);

FB.options({version: 'v2.9'});

exports.extendToken = function( req , res ){
    console.log( 'accessToken' );
}

exports.getFbPost = function( req , res ){
    var page = 'DramaAdd/feed?fields=message,shares,reations.type(LIKE).summary(totalCount)';
    var param = { 
        fields:'created_time , id , name , type , message , description , link , permalink_url ' ,
        limit:1
    };
    var count = 2;

    getPostsbyPageParamNumber( page , param , count , function ( data ) {
        for (var i = 0, len = data.length; i < len; i++) 
        {
            var post = data[i];
            // var data =
            // {
            //     created_at      : post.id_str,     /** If this exist , not insert to mongooo!!!! */
            //     _id             : post.created_at,
            //     post_id         : post.text,
            //     page_id         : post.user.id_str,
            //     name            : "https://twitter.com/"+tweet.user.id_str+"/status/"+tweet.id_str,
            //     type            :
            //     message         :         
            //     description     :            
            //     link            :         
            //     permarlink     :            
            // };
            console.log( post );
            // var social_object = new social_db( data );
            // social_object.save();
            // tweet_array.push( data );
        } 
    });
}

function getPostsbyPageParamNumber( page , param , count=0 , callback) {

    graph.get( page, function(err, res) {
        callback( res.data );
        if(res.paging && res.paging.next) {
            graph.get(res.paging.next, function(err, res) {
                
                
            });
        }
    
    });
    
    
}
// exports.getFbPost = function( req , res ){
//     FB.api('DramaAdd/feed', { fields: ['id', 'name','created_time','description'] , limit:100 }, function (fb_res) {    
//         if(!fb_res || fb_res.error) {
//             console.log(!fb_res ? 'error occurred' : fb_res.error);
//             return;
//         }

//         res.render( 'facebook', {
//             posts : fb_res.data
//         } );
//         curlGetJson( fb_res.paging.next , fb_res.data.length , res , function(response){
//             console.log( response );
//         });
//     });
// }

// function curlGetJson( previous_link , count , res ,  callback ) {
//     curl.getJSON( previous_link , {} , function(err, response, data , res ){
//         if( !data.paging ){
//             callback( 'Done Total count  : '+count );
//             return;
//         }
//         new_count = count+data.data.length;
//         callback( data.data[0].created_time );
//         callback( 'count  : '+count );
//         curlGetJson( data.paging.next ,new_count, callback );
//     });
// }

