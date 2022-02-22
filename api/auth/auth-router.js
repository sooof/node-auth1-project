// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const {checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware')
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

 // http post :9000/api/auth/register username=aaa password=1234 -v
 // TEST ERR : http post  :9000/api/auth/register
 // TEST ERR http post :9000/api/auth/register username=aaa  -v
 // TEST ERR http post :9000/api/auth/register username=bob  password=1234 -v
router.post('/register',checkPasswordLength, checkUsernameFree, async(req, res, next)=>{
  // res.json('[POST] /api/auth/register')
  try{
    const {username, password} =req.body
    const hash = bcrypt.hashSync(password, 8)
    const user = await User.add({username, password: hash})
    res.status(201).json(user)
  }catch(err){
    next(err)
  }
})

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
  // http post  :9000/api/auth/login
   // http post :9000/api/auth/login username=aaa password=1234 -v
  // TEST ERR: http   :9000/api/auth/login username=bonnnxxx password=1234
  router.post('/login',checkUsernameExists, (req, res, next)=>{
    // res.json('[POST] /api/auth/login')
    try{
      const {password} = req.body
      const validPassword = bcrypt.compareSync(password, req.user.password)
      // console.log("data password =", req.user.password)
      // console.log("body password = ", password)
      // console.log(validPassword)
      if(!validPassword){
        return next({ status: 401, message: "Invalid credentials"})
      }else{
        req.session.user = req.user
        res.json({ message: `Welcome ${req.user.username}!`})
      }
    }catch(err){
      next(err)
    }
  })

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
 // http get  :9000/api/auth/logout 
  router.get('/logout', (req, res, next)=>{
    // res.json('[GET] /api/auth/logout')
    try{
      if(req.session.user==null){
        next({ status: 200, message: "no session"})
      }else{
        req.session.destroy(err=>{
          if(err){
            next({ message: 'error while logging out' });
          }else{
            next({ status: 200, message: "logged out"}) 
          }
        })
      }
    }catch(err){
      next(err)
    }
  })
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router