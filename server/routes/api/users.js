const express = require('express');
let router = express.Router();
const { checkLoggedIn } = require('../../middleware/auth')
const { grantAccess } = require('../../middleware/roles')

require('dotenv').config();


const { User } = require('../../models/userModel');

router.route('/register').post(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await User.emailTaken(email)) {
      return res.status(400).json({ message: "Email is taken" })
    }
    const user = new User({
      user: email,
      password: password
    })
    const token = user.generateToken();
    const doc = await user.save();
    res.cookie('x-access-token', token).status(200).send(getUserProps(doc))
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error })
  }
})

router.route('/signin')
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email })
      if (!user) {
        return res.status(204).json({ message: 'Invalid Email' })
      }
      const compare = await user.comparePassword(password);
      if (!compare) {
        return res.status(204).json({ message: 'Invalid Credential' })
      }

      const token = user.generateToken();
      res.cookie('x-access-token', token).status(200).send(getUserProps(user))
    } catch (error) {
      res.status(400).json({ message: 'Error', error: error })
    }
  })

router.route('/profile')
  .get(checkLoggedIn, grantAccess('readOwn', 'profile'), async (req, res) => {
    try {
      const permission = res.locals.permission;
      const user = await User.findById(req.user._id);
      if (!user) return res.status(400).json({ message: 'USer not found' })

      res.status(200).json(permission.filter(user._doc));
    } catch (error) {
      res.status(400).send(error)
    }
  })
  .patch(checkLoggedIn, grantAccess('updateOwn', 'profile'), async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          "$set": {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age
          }
        },
        { new: true }
      )
      if (!user) return res.json({ message: 'User not found' })
      res.status(200).json(getUserProps(user))
    } catch (error) {
      res.status(400).json({ message: "Something went wrong", error: error })
    }
  })

router.route('/update_email')
  .patch(checkLoggedIn, grantAccess('updateOwn', 'profile'), async (req, res) => {
    try {

    } catch (error) {

    }
  })






const getUserProps = (props) => {
  return {
    _id: props._id
  }
}
module.exports = router;