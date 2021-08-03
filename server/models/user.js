const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    firstName: String,
    lastName: String
},{ timestamps: true })

//Passport handles password and email
//Also adds funtions like register to User Model
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true,
    session: false
});

module.exports = mongoose.model('User', UserSchema);