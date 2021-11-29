const User = require('../models/user')

module.exports.checkConfirmation = async function (req, res, next) {
    const email = req.body.user.email
    const user = await User.findOne({email: email})

    if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

    next()
}