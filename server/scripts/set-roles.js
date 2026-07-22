// Assign domain roles to a user.
// Usage: node scripts/set-roles.js <email> <role[,role...]|none>
// Roles: admin, news, wiki, hubs. "none" clears all roles.
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose')
const User = require('../models/user')
const { VALID_ROLES } = require('../utils/roles')

const [email, rolesArg] = process.argv.slice(2)
if (!email || !rolesArg) {
    console.error('Usage: node scripts/set-roles.js <email> <role[,role...]|none>')
    console.error('Roles: ' + VALID_ROLES.join(', '))
    process.exit(1)
}

const roles = rolesArg === 'none' ? [] : rolesArg.split(',').map(r => r.trim())
const invalid = roles.filter(r => !VALID_ROLES.includes(r))
if (invalid.length) {
    console.error('Unknown role(s): ' + invalid.join(', '))
    process.exit(1)
}

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/dorm-hub"

async function run() {
    await mongoose.connect(dbUrl)
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        console.error('No user with email ' + email)
        process.exitCode = 1
    } else {
        user.roles = roles
        await user.save()
        console.log(`${user.email} roles set to [${roles.join(', ')}]`)
    }
    await mongoose.connection.close()
}

run()
