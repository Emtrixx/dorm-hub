
const User = require('../models/user')
const passport = require('passport');
const JWT = require('jsonwebtoken')
const PassportJwt = require('passport-jwt')

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not set. Copy server/.env.example to server/.env and set a secret.')
}
const jwtAlgorithm = 'HS256'
const jwtExpiresIn = 1000 * 60 * 60 * 24 * 7

passport.use(User.createStrategy())

function register(req, res, next) {
  console.log(req.body)
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  })
  // Create the user with the specified password
  User.register(user, req.body.password, (error, user) => {
    if (error) {
      next(error)
      console.log(error)
      return
    }
    // Store user so we can access it in our handler
    req.user = user
    next()
  })
}

passport.use(
    new PassportJwt.Strategy(
      // Options
      {
        // Where will the JWT be passed in the HTTP request?
        // e.g. Authorization: Bearer xxxxxxxxxx
        jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        // What is the secret
        secretOrKey: jwtSecret,
        // What algorithm(s) were used to sign it?
        algorithms: [jwtAlgorithm]
      },
      // When we have a verified token
      (payload, done) => {
        // Find the real user from our database using the `id` in the JWT
        User.findById(payload.sub)
          .then(user => {
            // If user was found with this id
            if (user) {
              done(null, user)
            } else {
              // If not user was found
              done(null, false)
            }
          })
          .catch(error => {
            // If there was failure
            done(error, false)
          })
      }
    )
  )
  
  function signJWTForUser(req, res) {
    // Get the user (either just signed in or signed up)
    const user = req.user
    // Create a signed token
    const token = JWT.sign(
      // payload
      {
        email: user.email
      },
      // secret
      jwtSecret,
      {
        algorithm: jwtAlgorithm,
        expiresIn: jwtExpiresIn.toString(),
        subject: user._id.toString()
      }
    )
    // Send the token
    res.json({
      token,
      userId: user._id.toString(),
      roles: user.roles || [],
      expiresIn: jwtExpiresIn.toString()
    })
  }

  // Role check for use after requireJWT. Roles are read from the user document
  // requireJWT just loaded, so role changes apply immediately without re-login.
  function requireRole(role) {
    return (req, res, next) => {
      const roles = (req.user && req.user.roles) || []
      if (roles.includes(role) || roles.includes('admin')) {
        return next()
      }
      res.status(403).json({ message: `Missing permission: ${role}` })
    }
  }

  module.exports = {
    initialize: passport.initialize(),
    register,
    signIn: passport.authenticate('local', { session: false }),
    requireJWT: passport.authenticate('jwt', { session: false }),
    requireRole,
    signJWTForUser
  }