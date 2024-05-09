// passport simplifies OAuth
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import {keys} from '../config/keys.js'
// mongoose is our MongoDB wrapper to simplify access
import mongoose from 'mongoose'

// "User" is a model class that contains all of the collection "users"
const User = mongoose.model('users')

passport.serializeUser( (user, done) => {
        // serialize user with our own id from Mongo. user.id is not google's profile.id.
        // user.id is the mongo record id.
        // we do this so if we authenticate with another method in the future
        // we maintain unique id's in our collection
        // after initial call from google with it's profile id, we no longer use profile id but use our own
        // unique id to send back to browser
/********/
console.log('serialize:',user.id)
/********/
        done(null, user.id)
    }
)

passport.deserializeUser( (id, done) => {
/********/
console.log('deSerialize:',id)
/********/
        User.findById(id)
        .then( user => {
            done(null, user)
        })   
    }
)

passport.use(
    new GoogleStrategy( {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL : '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {             // callback function that gets called (with user profile arg) 
                                                                // when we get back from the google flow.
  
/*******/
console.log('profile.id:', profile.id)
/*******/                                                               
            User.findOne({googleID: profile.id})
                .then( ( existingUser ) => {                    // promise returns
                    if ( existingUser ) {
                        // user exists
/*******/
console.log('User:', existingUser)
/*******/
                        // tell passport we are done
                        done(null, existingUser)
                    } else {
                        new User({
                            googleID: profile.id,
                            name:     profile.displayName,
                            emails:   profile.emails
                            })
                            .save()     //persist it
                            // save is asynchronous, tell passport we are done after the save completes
                            .then(user => done(null,user))
                    }
                })
            
            
         }
    )
)