const express = require('express')
const router = express.Router();
const db = require('../models');
let User = db.User;

router.post('/signup', (req, res) =>{
 User.create({
  username: req.body.author, 
  password: req.body.password
 })
  .then((user) =>)
 })



