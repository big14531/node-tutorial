var FB = require('fb');
var curl = require('curl');
var config = require( '../../config/config' );

FB.setAccessToken(config.facebookAuth.fb_access_token);
FB.options({version: 'v2.8'});

exports.extendToken = function( req , res ){
    console.log( 'accessToken' );
}

exports.getFbPost = function( req , res ){
    FB.api('DramaAdd/feed', { fields: ['id', 'name','created_time','description'] , limit:100 }, function (fb_res) {    
        if(!fb_res || fb_res.error) {
            console.log(!fb_res ? 'error occurred' : fb_res.error);
            return;
        }

        res.render( 'facebook', {
            posts : fb_res.data
        } );
        curlGetJson( fb_res.paging.next , fb_res.data.length , res , function(response){
            console.log( response );
        });
    });
}

function curlGetJson( previous_link , count , res ,  callback ) {
    curl.getJSON( previous_link , {} , function(err, response, data , res ){
        if( !data.paging ){
            callback( 'Done Total count  : '+count );
            return;
        }
        new_count = count+data.data.length;
        callback( data.data[0].created_time );
        callback( 'count  : '+count );
        curlGetJson( data.paging.next ,new_count, callback );
    });
}

