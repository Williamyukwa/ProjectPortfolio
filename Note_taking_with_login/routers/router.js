const passport = require('passport');


module.exports = (express) => {
    const router = express.Router();

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }

    router.get('/', function(req, res){
        res.render('homepage', {isAuthenticated:req.isAuthenticated()});
    });
    
    router.get('/login', function(req, res){
        res.render('login' , {title:'hi',isAuthenticated:req.isAuthenticated()});
    });
    
    router.get('/signup', function(req, res){
        res.render('signup', {isAuthenticated:req.isAuthenticated()});
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/error'
    }));

    router.post('/signup', passport.authenticate('local-signup',{
        successRedirect: '/',
        failureRedirect: '/error'
    }));

    router.get('/error', (req, res) => {
        res.send('Some error happen', {isAuthenticated:req.isAuthenticated()});
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.get("/profile", isLoggedIn, (req, res) => {
        res.render('profile', {
            isAuthenticated:req.isAuthenticated(),
            id: req.user.id,
            email: req.user.email
        });
    });

    router.get("/auth/facebook",passport.authenticate('facebook',{
        scope: ['public_profile', 'email'] 
    }));

    router.get("/auth/facebook/callback",passport.authenticate('facebook',{
        failureRedirect: "/error"
    }),(req,res)=>res.redirect('/'));

    router.get('/chatroom', function(req, res){
        res.render('chatroom', {isAuthenticated:req.isAuthenticated()});
    });

    router.get('/comment', function(req, res){
        res.render('comment', {isAuthenticated:req.isAuthenticated()});
    });


    return router;
};