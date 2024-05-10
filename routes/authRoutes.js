import passport from 'passport'

export function authRoutes(app) {  //
    app.get(
        '/',
        (req,res) => {
            res.send(`Hello ${req.user?.name ?? 'Unknown!'}`)
        }
    )

    app.get(
        '/auth/google',
        // authenticate using google strategy and request access to profile and email
        passport.authenticate('google',{ scope: ['profile', 'email'] } )
    )


    app.get(
        '/auth/google/callback',
        // authenticate using google strategy
        //passport.authenticate('google', {session: false, failureRedirect: '/'})
        passport.authenticate('google', { successRedirect: '/', failureRedirect: '/fail' })
    )

    app.get(
        '/api/current_user',
        (req, res) => {
            res.send(req.user)
        }
    )
}