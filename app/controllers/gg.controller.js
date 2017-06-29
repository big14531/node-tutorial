const googleTrends = require('google-trends-api');


exports.getTrends = function ( req , res) {

    var params = {
        keyword :'game',
        startTime: new Date('2017-06-01'),
        endTime: new Date('2017-06-06')
    };

    googleTrends.interestOverTime(params)
    .then(function(results){
        results = JSON.parse(results); 
        console.log('These results are awesome'); 
        console.log( results.default.timelineData );
    })
    .catch(function(err){
        console.error('Oh no there was an error', err);
    });
}
