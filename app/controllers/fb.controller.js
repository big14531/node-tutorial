var FB = require('fb');
var curl = require('curl');
var config = require( '../../config/config' );

FB.setAccessToken(config.facebookAuth.fb_access_token);
FB.options({version: 'v2.8'});

exports.extendToken = function( req , res ){
    console.log( 'accessToken' );
}

exports.getFbPost = function( req , res ){
    FB.api('MajorGroup/feed', { fields: ['id', 'name','created_time'] , limit:100 }, function (res) {    
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        // console.log(res.data);
        curlGetJson( res.paging.next , res.data.length , function(response){
            console.log( response );
        });
    });
}

function curlGetJson( previous_link , count , callback ) {
    curl.getJSON( previous_link , {} , function(err, response, data){
        if( !data.paging ){
            callback( 'Done Total count  : '+count );
            return;
        }
        new_count = count+data.data.length;
        callback( data.data[99].created_time );
        callback( 'count  : '+count );
        curlGetJson( data.paging.next ,new_count, callback );
    });
}

