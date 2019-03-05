const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS
    }
});

module.exports = (passport)=>{
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `/auth/facebook/callback`,
        profileFields: ["id", "email", "displayName", "picture.type(large)"]
    },
    async (accessToken, refreshToken, profile, done) => {
        let userResult = await knex("login").where({ facebook_id: profile.id });
        if (userResult.length == 0) {
            let user = {
            facebook_id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            profilepicture: `https://graph.facebook.com/${profile.id}/picture?width=200&height=200`,
            password: "nothing",
            accesstoken: accessToken
        };
        let query = await knex("login").insert(user).returning("id");
        user.id = query[0];
        done(null, user);
        } else {
        done(null, userResult[0]); // if userResult exists, return the user
      }
    }))

    // passport.use('facebook', new FacebookStrategy({
    //     clientID: process.env.FACEBOOK_ID,
    //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    //     callbackURL: `/auth/facebook/callback`
    // },(accessToken, refreshToken, profile, cb)=>{
    //         return cb(null,{profile:profile,accessToken:accessToken});
    //     }
    // )); 
}