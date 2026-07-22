const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const { VALID_ROLES } = require('../../utils/roles')

// Mounted behind requireJWT + requireRole('admin') in app.js

const USER_FIELDS = 'email firstName lastName roles createdAt'

//List users with their roles
router.get('/users', async (req, res) => {
    const users = await User.find().select(USER_FIELDS).sort({ email: 1 })
    res.json(users)
})

//Set a user's roles (replaces the whole list)
router.post('/users/:userId/roles', async (req, res) => {
    const roles = req.body.roles
    if (!Array.isArray(roles) || roles.some(r => !VALID_ROLES.includes(r))) {
        return res.status(400).json({ message: 'roles must be an array of: ' + VALID_ROLES.join(', ') })
    }
    const user = await User.findById(req.params.userId)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    // lockout guard: an admin cannot revoke their own admin role
    if (user._id.equals(req.user._id) && !roles.includes('admin')) {
        return res.status(400).json({ message: 'You cannot remove your own admin role' })
    }
    user.roles = [...new Set(roles)]
    await user.save()
    res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles
    })
})

module.exports = router;
