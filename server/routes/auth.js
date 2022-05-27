const express = require('express');
const router = express.Router();
const auth = require('../utils/auth')

//Register
router.post(
    '/register',
    // middleware that handles the registration process
    auth.register,
    // json handler
    auth.signJWTForUser,
    (req,res) => {
        console.log(req.body)
    }
)
  
// Sign in
router.post(
    '/login',
    // handles the sign in process
    auth.signIn,
    // json handler
    auth.signJWTForUser
)

module.exports = router;