exports.login = function ( req , res) {
    if( req.body.remember ==='remember' ){
        req.session.remember = true;
        req.session.email = req.body.email;
        req.sessionOptions.maxAge = 10000;
    }

    req.checkBody( 'email' , 'Invalid email' ).notEmpty().isEmail();
    req.checkBody( 'password' , 'Invalid password' ).notEmpty().isAlpha();
    var email = req.sanitizeBody( 'email' ).normalizeEmail();
    console.log( email );
    console.log( req.body.password );
    var error = req.validationErrors();
    if( error ){
        res.render( 'index',{
            title: ' Valide Error!! :' + JSON.stringify( error ),
            isLogedIn:false
        });
        return;
    }


    res.render( 'index' , {
        title:'logged in as "'+req.body.email+'"',
        isLoggedIn: true
    });
}

exports.logout = function ( req , res) {
    req.session = null;

    res.render( 'index' , {
        title:'already logout',
        isLoggedIn: false
    });
}