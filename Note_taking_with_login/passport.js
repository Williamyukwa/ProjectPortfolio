const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS
    }
});
const bcrypt = require('./bcrypt')


module.exports = (app) => {
    require('./facebook-strategy')(passport);

    app.use(passport.initialize());
    app.use(passport.session());

    // Using local call for login/signup
    passport.use('local-login', new LocalStrategy(
        async (email, password, done) => {
            try{
                // call from database, will call all data like id, email, password
                let users = await knex('login').where({email:email});
                // check the user exist or not
                if (users.length == 0) {
                    return done(null, false, { message: 'Incorrect credentials.' });
                }

                let user = users[0];
                let result = await bcrypt.checkPassword(password, user.password);
                if (result) {
                    return done(null, user);
                }else{
                    return done(null, false, { message: 'Incorrect credentials.' });
                }

            }catch(err){
                return done(err);
            }
        }
    ));

    passport.use('local-signup', new LocalStrategy(
        async (email, password, done) => {
            try{
                let users = await knex('login').where({email:email});
                if (users.length > 0) {
                    return done(null, false, { message: 'Email already taken' });
                }
                let hash = await bcrypt.hashPassword(password)
                const newUser = {
                    email:email,
                    password: hash
                };
                let userId = await knex('login').insert(newUser).returning('id');
                newUser.id = userId.toString();
                done(null,newUser);
            }catch(err){
                done(err);
            }
    
        })
    );
    
    //Working for the session -> remember your login states
    //Serialize and deserialize user to and from session
    //encrypt and decrypt the user data, verify the information
    // During serialization, the ID stored in the session => 

    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });

    //verify the id in session = id in database
    
    // passport.deserializeUser(async (id, done) => {
    //     let users = await knex('login').where({id:id});
    //     if (users.length == 0) {
    //         return done(new Error(`Wrong user id ${id}`));
    //     }
    //     let user = users[0];
    //     return done(null, user);
    // });

    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });

}

