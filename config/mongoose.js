var config = require( './config' );
var mongoose = require( 'mongoose' );

module.exports = function(){

    mongoose.set('debug' , true);
    var db = mongoose.connect( 'mongodb://localhost/mean' );

    require('../app/models/data.model');

    return db;
};