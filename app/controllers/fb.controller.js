var FB = require('fb');
var async = require('async');
var graph = require('fbgraph');
var model = require('../models/data.model');
var config = require( '../../config/config' );

FB.options({version: 'v2.9'});

/**
*  Function pull Post  from api and update to db
* 
*   Input   : req.query.page_name ( string )
*           : req.query.count ( string ) 
*   Output  : error
*
*/
exports.savePostsAPI = function( req , res ){

    // Set Param and page
    var page = req.query.page_name+'/feed';
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
    var max_count = req.query.count;

    /**
    *  async description
    *  1. getAccessToken and pass param to pullPostfromAPI
    *  2. pullPostfromAPI got "access_token" and "error" from getAccessToken , and inject "Param" by apply
    *  3. 
    */
    async.waterfall([
        getAccessToken,
        async.apply( pullPostfromAPI, [ page , params , max_count ] ),
    ], function (err, result) {
        res.json({ status: 'Done' });
    });

    
}

/**
*  Function pull Post  from api and update to db
* 
*   Input   : req.query.page_name ( string )
*   Output  : error
*
*/
exports.savePageAPI = function( req , res ){

    // Set Param and page
    var page = req.query.page_name;
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
    *  1. getAccessToken and pass param to pullPostfromAPI
    *  2. pullPostfromAPI got "access_token" and "error" from getAccessToken , and inject "Param" by apply
    *  3. 
    */
    async.waterfall([
        getAccessToken,
        async.apply( pullPagefromAPI, [ page , params ] ),
    ], function (err, result) {
        res.json({ status: 'Done' });
    });   
}

/**
*  Function get Post and provide JSON
* 
*   Input   : page_id ( string )
*           : min_date ( date format : yyyy-mm-dd )
*           : max_date ( date format : yyyy-mm-dd )
*           : count ( string )
*   Output  : post data ( JSON )
*
*/
exports.getPosts = function ( req , res ) {

    /**
    * Get 4 Parameters
    *  1. page_id ( 'string' ) => Get post of this page.
    *  2. min_date             => Get post after min_date.
    *  3. max_date             => Get post before max_date.
    *  4. count                => Number of Post that will returned.
    */  
    var query = [
        { $match : { 'from.id'      : req.query.id }},
        { $match : { created_time   : {$gt: new Date(req.query.min_date) }}},
        { $match : { created_time   : {$lt: new Date(req.query.max_date) }}},
        { $limit : parseInt( req.query.count ) } 
    ];

    /**
    *  async description
    *  1. get Post from mongo by param
    *  2. injection query and callback for render json to screen
    *       **Closure with res
    */
    async.waterfall([
        async.apply( facebookQuery, [ query ,  function(data){ res.json(data); } , 'post'] )
    ], function (err, result) {
        console.log( 'Show Post' );
    });  
}

/**
*  Function get Page data and provide JSON
* 
*   Input   : page_id ( string )
*   Output  : post data ( JSON )
*
*/
exports.getPage = function ( req , res ) {

    /**
    * Get 1 Parameters
    *  1. page_id ( 'string' ) => Get post of this page.
    */  

    var query = [
        { $match : { 'id' : req.query.page_name }}
    ];
    /**
    *  async description
    *  1. get Page from mongo by param
    *  2. injection query and callback for render json to screen
    *       **Closure with res
    */

    async.waterfall([
        async.apply( facebookQuery, [ query ,  function(data){ res.json(data); } , 'page' ] )
    ], function (err, result) {
        console.log( result );
    });  
}


/**
*  Function call facebook api endpoint for get post data and recursive paging
* 
* @param {*} param         =>  Inject from async.waterfall  ( field , count , limit )
* @param {*} error         =>  Get from before funciton
* @param {*} callback      =>  Callback for something
*/
function pullPostfromAPI( param_array , error , callback ) {
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
*  Function call facebook api endpoint for get Page data
* 
* @param {*} param         =>  Inject from async.waterfall  ( field , count , limit )
* @param {*} error         =>  Get from before funciton
* @param {*} callback      =>  Callback for something
*/
function pullPagefromAPI( param_array , error , callback ) {
    var page    = param_array[0];
    var param   = param_array[1];
    FB.api( page , param , function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        model.insertPageFacebook( res );
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


/**
*   Function connect with model
*
*   1. Check request type => ( post , page )
*   2. Call model funciton
*
* @param {*} query  { query , callback , type }
* @param {*} callback 
*/
function facebookQuery( data , callback ){

    // Assign variable for developer can read
    var query       = data[0];
    var renderCB    = data[1];
    var type        = data[2];
    
    if( type=='post' ){
        var result = model.getPostFacebook( query , renderCB )
    }
    if( type=='page' ){
        var result = model.getPageFacebook( query , renderCB )
    }
    callback( null , result );
}
