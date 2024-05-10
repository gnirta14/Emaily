import express from 'express'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import passport from 'passport'
import '../models/user.js'           // basically an include statement.
import '../services/passport.js'     // basically an include statement.
import {authRoutes} from '../routes/authRoutes.js'
import {keys} from '../config/keys.js'

mongoose.connect(keys.mongoURI)

const app = express()

// enable cookies with 30 day life and encrypt with our "cookieKey"
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,        // 30 days in milliseconds
        keys: [keys.cookieKey]
    })
)

app.use(passport.initialize())
app.use(passport.session())

// endpoint routes need to come after cookie/passport initialization
authRoutes(app)

const PORT = process.env.PORT || 5000
console.log('Listening on ......',PORT)
app.listen(PORT)