const googleTrends = require('google-trends-api-es');

exports.getTrends = function ( req , res ){
    console.log( "getTrends" );
    googleTrends.trendData('OJ Simpson')
        .then(function(results){
            console.log(results);
        })
        .catch(function(err){
            console.error(err);
        });
}