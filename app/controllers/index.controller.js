exports.render = function ( req , res ) {
    var isLoggedIn = false;

    if( typeof req.session.remember !== 'undefinded' ){
        isLoggedIn = req.session.remember;
    }
    
    res.render( 'index', {
        title     : 'hello world',
        message   : 'hi bitch!!',
        isLoggedIn: isLoggedIn
    } );
}