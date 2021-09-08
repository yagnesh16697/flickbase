const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.checkToken = async (req, res, next) => {
  try {
    if (req.headers['x-access-token']) {
      const accessToken = req.headers['x-access-token'];
      const { _id, email, exp } = jwt.verify(accessToken, process.env.DB_SECRET);
      res.locals.userData = await User.findById(_id);
      next()
    } else {
      next()
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token", errors: error })
  }
}

exports.checkLoggedIn = async (req, res, next) => {
  const user = res.locals.userData;
  if (!user) return res.status(401).json({ error: "No user" })
  req.user = user;
  next()
}
