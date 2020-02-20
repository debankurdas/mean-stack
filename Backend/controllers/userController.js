const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../model/userSchema');

exports.createUser = (req,res,next) => {
  bcrypt.hash(req.body.password,10)
  .then((hash) => {
    const user = new userSchema({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then((result) => {
      res.status(201).json({
        message:'Post is added',
        result: result
      })
    })
    .catch(err => {
      res.status(500).json({
        message:'You have already registered!'
      })
    })
  });
}

exports.loginUser = (req,res,next) => {
  let user;
  userSchema.findOne({ email: req.body.email})
  .then((findingResult) => {
    if(!findingResult) {
      return res.status(400).json({
        message: 'Email is invalid'
      });
    };

    user = findingResult;
    return bcrypt.compare(req.body.password, findingResult.password);
  })
  .then((result) => {
    if(!result) {
      return res.status(401).json({
        message:'password is invalid'
      });
    }
    const token = jwt.sign(
      {email: user.email,uId:user._id},
      process.env.JWT_KEY,
      {expiresIn: "1h"}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        uId: user._id
      });
  })
  .catch(err => {
    res.status(500).json({
      message:'Authentication failed'
    })
  })
}
