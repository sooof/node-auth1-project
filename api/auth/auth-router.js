// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const {checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware')
const Users = require('../users/users-model')
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
 // http post  :9000/api/auth/register
router.post('/register',checkPasswordLength, checkUsernameFree, async(req, res, next)=>{
  res.json('[POST] /api/auth/register')
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
  // TEST ERR: http   :9000/api/auth/login username=bonnnxxx password=1234
  router.post('/login',checkUsernameExists, (req, res, next)=>{
    res.json('[POST] /api/auth/login')
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
    res.json('[GET] /api/auth/logout')
  })
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router