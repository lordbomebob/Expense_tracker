const express = require('express')
const Router = express.Router()
const userController = require(`../controllers/User`)
//signup
Router.post('/register',userController.RegisterUser )
//get users
Router.get('/',userController.getUser)
//login api
Router.post('/login',userController.loginUser)
module.exports=Router