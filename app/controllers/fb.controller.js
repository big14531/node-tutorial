var FB = require('fb');
var async = require('async');
var graph = require('fbgraph');
var model = require('../models/data.model');
var config = require( '../../config/config' );

FB.options({version: 'v2.9'});

/**
*  Function get Post facebook data
* 
*/
exports.getPosts = function( req , res ){

    // Set Param and page
    var page = 'khaosod/feed';
    var params = {
        fields: [
            'created_time',
            'from',
            'id', 
            'name',
            'type',
            'picture',
            'object_id',
            'link',
            'permalink_url',
            'message',
            'description' , 
            'message_tags',
            'place',
            'feed_targeting',
            'likes.limit(1).summary(true)',
            'reactions.limit(1).summary(true)',
            'comments.limit(1).summary(true)',
            'shares.limit(1).summary(true)'  ],
        limit:100
    }
    var max_count = 1000;

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
        res.json({ status: 'Done' });
    });

    
}

/**
*  Function get Page facebook data
* 
*/
exports.getPage = function( req , res ){

    // Set Param and page
    var page = 'khaosod';
    var params = {
        fields: [
            'about',
            'fan_count',
            'category_list',
            'link',
            'website',
            'cover',
            'name',
            'category',
            'displayed_message_response_time',
            'engagement',
            'is_verified',
            'verification_status',
            'location',
            'talking_about_count',
            'picture'
        ]
    }

    /**
    *  async description
    *  1. getAccessToken and pass param to getPostbyParam
    *  2. getPostbyParam got "access_token" and "error" from getAccessToken , and inject "Param" by apply
    *  3. 
    */
    async.waterfall([
        getAccessToken,
        async.apply( getPagebyParam, [ page , params ] ),
    ], function (err, result) {
        res.json({ status: 'Done' });
    });   
}


/**
*  Function call facebook api endpoint for get post data and recursive paging
* 
* @param {*} param         =>  Inject from async.waterfall  ( field , count , limit )
* @param {*} error         =>  Get from before funciton
* @param {*} callback      =>  Callback for something
*/
function getPostbyParam( param_array , error , callback ) {
    var page    = param_array[0];
    var param   = param_array[1];
    var count   = param_array[2];
    FB.api( page , param , function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        
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
        model.insertPostFacebook( res.data );
        count -= param_array[1].limit;
        recursivePost( res , param_array , count );
    });
}


/**
*  Function call facebook api endpoint for get Page data
* 
* @param {*} param         =>  Inject from async.waterfall  ( field , count , limit )
* @param {*} error         =>  Get from before funciton
* @param {*} callback      =>  Callback for something
*/
function getPagebyParam( param_array , error , callback ) {
    var page    = param_array[0];
    var param   = param_array[1];
    FB.api( page , param , function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log( res )
        model.insertPageFacebook( res );
    });
    
    callback( null ,"Done!!");
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
            
            FB.setAccessToken( res.access_token );
            callback( null , res.error );
    });
}


