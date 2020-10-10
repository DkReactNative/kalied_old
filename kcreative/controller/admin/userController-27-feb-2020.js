var User = require('./../../model/usersModel');
const bcrypt = require('bcryptjs');
const adminHelper = require("./../../helper/adminHelper");
const jwt = require("jsonwebtoken");
const appConfig = require('./../../config/app');
const mongoose = require('mongoose');
var formidable = require('formidable');
const ObjectId = mongoose.Types.ObjectId;

const login = function(req, res){

  var email = req.body.email;
  var password = req.body.password;
  if(!req.body.email || !req.body.password){

      res.json({
            success: false,
            message: 'Email and password is required.',
            statuscode:400,
            data: ''
          });
           return;
  }
  console.log(req.body);
   User.findOne({
        email:email
      }).then(user => {
        
        if (!user) {

           res.json({
            success: false,
            message: 'Email is not registered',
            statuscode:400,
            data: ''
          });
           return;
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {

            if(user && user.token != ''){

              user.token = '';
            }

            const jwttoken = jwt.sign(JSON.stringify(user), appConfig.secret);
            User.updateOne(
            {
              _id:ObjectId(user._id)
            },
            {
              $set:{
                token : jwttoken
              }
            },
              (errs, resultnew) => {
              if (errs) 
              {
                res.json({
                  success: false,
                  message: 'Something went wrong',
                  statuscode:400,
                  data: errs
                });

                return;
                
              } 
              else 
              {                
                  
                  user = JSON.stringify(user);
                  user = JSON.parse(user); 
                  user.token = jwttoken;
                  res.json({
                    success: 1,
                    message: 'Login successfully',
                    statuscode:200,
                    data: user
                  });

                  return;
              }
            });

          } else {

              res.json({
              success: false,
              message: 'Password incorrect',
              statuscode:400,
              data: ''
            });
            
          }
        });
      });
}


const forget_password = function(req, res){

  var email = req.body.email;
   User.findOne({
        email:email
      }).then(user => {
        
        if (!user) {

           res.json({
            success: false,
            message: 'Email is not registered',
            statuscode:400,
            data: ''
          });
           return;
        }

        var otp = Math.floor(100000 + Math.random() * 900000);
        // Match password
        

        user.otp = '';
        user.otp_status = '';
        User.updateOne(
        {
          _id:ObjectId(user._id)
        },
        {
          $set:{
            otp : otp,
            otp_status: 1
          }
        },
        (errs, resultnew) => {
        if (errs) 
        {
          res.json({
            success: false,
            message: 'Something went wrong',
            statuscode:400,
            data: errs
          });

          return;
          
        } 
        else 
        {                
            
            user = JSON.stringify(user);
            user = JSON.parse(user); 
            user.otp = otp;
            user.otp_status = 1;
            res.json({
              success: true,
              message: 'Forget password otp send successfully.',
              statuscode:200,
              data: user
            });

            return;
        }
      });
    });
}


const verify_otp = function(req, res){

  var email = req.body.email;
   User.findOne({
        email:email
      }).then(user => {
        
        if (!user) {

           res.json({
            success: false,
            message: 'Email is not registered',
            statuscode:400,
            data: ''
          });
           return;
        }

        var otp = Math.floor(100000 + Math.random() * 900000);
        // Match password
        

        user.otp = '';
        user.otp_status = '';
        User.updateOne(
        {
          _id:ObjectId(user._id)
        },
        {
          $set:{
            otp : otp,
            otp_status: 1
          }
        },
        (errs, resultnew) => {
        if (errs) 
        {
          res.json({
            success: false,
            message: 'Something went wrong',
            statuscode:400,
            data: errs
          });

          return;
          
        } 
        else 
        {                
            
            user = JSON.stringify(user);
            user = JSON.parse(user); 
            user.otp = otp;
            user.otp_status = 1;
            res.json({
              success: true,
              message: 'Forget password otp send successfully.',
              statuscode:200,
              data: user
            });

            return;
        }
      });
    });
}

module.exports = {	
  login,
  forget_password,
  verify_otp
 }

