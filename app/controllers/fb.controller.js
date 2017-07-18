var FB = require('fb');
var async = require('async');
var graph = require('fbgraph');
var social_db = require( 'mongoose' ).model( 'fb_post_collection' );
var config = require( '../../config/config' );
FB.setAccessToken(config.facebookAuth.fb_access_token);

FB.options({version: 'v2.9'});

exports.getPosts = function( req , res ){

    // Set Param and page
    var page = 'DramaAdd/feed';
    var params = {
        fields: [
            'id', 
            'name',
            'created_time',
            'description' , 
            'likes.limit(1).summary(true)'  ],
        limit:2
    }
    var max_count = 10;

    /**
     *  async description
     *  1. getAccessToken and pass param to getPostbyParam
     *  2. getPostbyParam got "access_token" and "error" from getAccessToken , and inject "Param" by apply
     *  3. 
     */
    async.waterfall([
        getAccessToken,
        async.apply( getPostbyParam, [ page , params , max_count ] ),
    ], function (err, result) {
        console.log( result );
    });

    
}

/**
 *  Function call facebook api endpoint and get data by param
 * 
 * @param {*} param         =>  Inject from async.waterfall  ( field , count , limit )
 * @param {*} error         =>  Get from before funciton
 * @param {*} access_token  =>  Access token
 * @param {*} callback      =>  Callback for something
 */
function getPostbyParam( param_array , error , access_token , callback ) {
    var page    = param_array[0];
    var param   = param_array[1];
    var count   = param_array[2];
    FB.api( page , param , function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log( res.data );
        recursivePost( res , param_array , count );
    });
    
    callback( null ,"Done!!");
}


/**
 *  Function recursive for getPost
 * @param {*} res           =>  respond object from API
 * @param {*} param_array   =>  query field
 * @param {*} count         =>  Counter number , stop recursive when equal 0
 */
function recursivePost( res , param_array , count ) {
    if( count<=0 ) return;
    graph.get( res.paging.next , function (err,res) {
        if(!res || err) {
            console.log(!res ? 'error occurred' : err);
            return;
        }
        console.log( res.data );
        count -= param_array[1].limit;
        recursivePost( res , param_array , count );
    });
   
}

/**
 * Function get access Token by facebook client_id and secert_id 
 */
function getAccessToken( callback ) {
    FB.api('oauth/access_token', {
        client_id       : config.facebookAuth.fb_client_id,
        client_secret   : config.facebookAuth.fb_secert_id,
        grant_type: 'client_credentials'
        }, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }   
            callback( null , res.error , res.access_token );
    });
}


