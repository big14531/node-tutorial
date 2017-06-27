module.exports = function (app) {
    var fb = require( '../controllers/fb.controller' );
    var tt = require( '../controllers/tt.controller' );
    app.get( '/getFbPost' , fb.getFbPost );
    app.get( '/extendToken' , fb.extendToken );
    app.get( '/getTweet' , tt.getTweet );
}