const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppGuide = require("../models/appguides");
const Emailtemplates = require("../models/emailtemplates");
const checkJWT = require("../middlewares/check-jwt");
const urlSlug = require("url-slug");
const crypto = require("crypto");
const multer = require("multer");
const formidable = require("formidable");
const gm = require('gm');
//const MulterResizer = require('multer-resizer');
const termsConditions = require("../models/termsconditions");
const LearningLanguage = require("../models/learninglanguages");
const Languages = require("../models/languages");
const Setting = require("../models/settings");
const terms = require("../models/terms");
const mongoose = require("mongoose");
const moment = require("moment");
const ObjectId = mongoose.Types.ObjectId;
const path = require('path');
const fs = require('fs');
const passport = require('passport');
const config = require('../config/configdb');
const appfunctions = require("./AppFunctions/app_functions");
const bcrypt = require("bcryptjs");


router.post('/login', function(req, res, next) {
  passport.authenticate('front', {session: false}, function(err, user, info) {
    //console.log('Juli'); 
    if (err) { res.json(appfunctions.failResponse("msg_something_wrong", err)); }
    if (!user) {        
      res.json(appfunctions.failResponse(info.message, err)); 
    }else{   

      if(user && user.token != '')
      {        
        user.token = '';
      } 

      if (user.status == 1) 
      {     
                    
          const jwttoken = jwt.sign(JSON.stringify(user), config.secret);

            User.updateOne(
            {
              _id:ObjectId(user._id)
            },
            {
              $set:{
                //device_token:req.body.device_token?req.body.device_token:'',
                //device_type:req.body.device_type?req.body.device_type:'',                
                //language_id:req.body.language_id,
                login_with_social:2,
                version : req.body.version?req.body.version:'1.0',
                token : jwttoken,
                
              }
            },
              (errs, resultnew) => {
              if (errs) 
              {
                res.json(appfunctions.failResponse("msg_something_wrong", errs));
              } 
              else 
              {                
                  //user.password = "";
                  user = JSON.stringify(user);
                  user = JSON.parse(user); 
                  user.token = jwttoken;
                  user.login_with_social=2;
                  res.json(appfunctions.successResponse("msg_login_successfully", user));
              }
            });        
      } 
      else 
      {               
        var otp = Math.floor(1000 + Math.random() * 9000);      
        user.otp = otp;
        user.version = req.body.version?req.body.version:'1.0';
        login_with_social=2;
        user.save((errs, user) => {        
          Emailtemplates.findOne(
            {
              slug: "verification_otp",
              language_id:ObjectId(user.language_id)
            },
            (err, template) => {

              if(err)
              {
                 res.json(appfunctions.failResponse("msg_something_wrong"));
              }
              else
              {
                if(template){
                    var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                    var issEmailSent = appfunctions.sendEmail(
                      template.subject,
                      user.email,
                      res.locals.app_title+' <'+config.emailFrom+'>',
                      templatereplace
                    );
                    if (issEmailSent == false) {
                      res.json(appfunctions.failResponse("msg_email_not_send"));
                    } else {
                      res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                    }
                }
                else
                {
                    Emailtemplates.findOne(
                    {
                      slug: "verification_otp",
                      language_id:ObjectId(config.defaultLanguageId)
                    },
                    (err, template) => {

                      if(err)
                      {
                          res.json(appfunctions.failResponse("msg_something_wrong"));
                      }
                      else
                      {
                        console.log(res.locals.app_title+'res.locals.app_title')
                        var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                        var issEmailSent = appfunctions.sendEmail(
                          template.subject,
                          user.email,
                          res.locals.app_title+' <'+config.emailFrom+'>',
                          templatereplace
                        );
                        if (issEmailSent == false) {
                          res.json(appfunctions.failResponse("msg_email_not_send"));
                        } else {
                          res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user,));
                        }
                      }
                    })
                }                    
              }
            });

        });
      }
    }
  })(req, res, next);
});

//For login with facebook
router.post("/loginwithfacebook", (req, res, next) => {
  name = req.body.name;
  facebook_id = req.body.facebook_id;
  User.findOne(
    {
      facebook_id: req.body.facebook_id,
      role_id: 2
    },
    (err, existingUser) => {
      if (existingUser) 
      {
        if(existingUser.token !='')
        {
          existingUser.token = '';
        }
        const jwttoken = jwt.sign(JSON.stringify(existingUser), config.secret);        
        existingUser.token = jwttoken;
        existingUser.login_with_social= 1;
        existingUser.device_type = req.body.device_type
          ? req.body.device_type
          : "";
        existingUser.language_id = req.body.language_id;
        existingUser.save((errs, existingUser) => {
          if (errs) {
            res.json(appfunctions.failResponse("msg_something_wrong", errs));
          } else {
            if (              
              existingUser.surname == "" ||
              existingUser.name == "" ||
              existingUser.email == "" 
            ) {                     
              var data = JSON.stringify(existingUser);
              data = JSON.parse(data);
              data.isCompleted = 0;
              res.status(200).json({
                success: true,
                data: data,
                message: "msg_login"
              });
            } 

            else {
              if (existingUser.status == 1) {
                var data = JSON.stringify(existingUser);
                data = JSON.parse(data);
                data.login_with_social=1;
                data.isCompleted = 1;
                res.status(200).json({
                  success: true,
                  data: data,
                  message: "msg_login_successfully"
                });                
              } else {                           
                var otp = Math.floor(1000 + Math.random() * 9000);
                existingUser.otp = otp;
                existingUser.login_with_social= 1;               
                existingUser.save((errs, user) => {
                  Emailtemplates.findOne(
                  {
                    slug: "verification_otp",
                    language_id:ObjectId(user.language_id)
                  },
                  (err, template) => {

                    if(err)
                    {
                       res.json(appfunctions.failResponse("msg_something_wrong"));
                    }
                    else
                    {
                        if(template)
                        {
                            
                            var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                            var issEmailSent = appfunctions.sendEmail(
                              template.subject,
                              user.email,
                              //config.emailFrom,
                              res.locals.app_title+' <'+config.emailFrom+'>',
                              templatereplace
                            );
                            if (issEmailSent == false) {
                              res.json(appfunctions.failResponse("msg_email_not_send"));
                            } else {
                              user.isCompleted = 1;
                              res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                            }
                        }
                        else
                        {                              
                            Emailtemplates.findOne(
                            {
                              slug: "verification_otp",
                              language_id:ObjectId(config.defaultLanguageId)
                            },
                            (err, template) => {

                              if(err)
                              {
                                 res.json(appfunctions.failResponse("msg_something_wrong"));
                              }
                              else
                              {

                                var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                var issEmailSent = appfunctions.sendEmail(
                                  template.subject,
                                  user.email,
                                  //config.emailFrom,
                                  res.locals.app_title+' <'+config.emailFrom+'>',
                                  templatereplace
                                );
                                if (issEmailSent == false) {
                                  res.json(appfunctions.failResponse("msg_email_not_send"));
                                } else {
                                   user.isCompleted = 1;
                                  res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                }
                              }
                            })
                        }
                          
                    }
                  });

                });
              }
            }
          }
        });
        } else { 
        let data = new Object();
        data['name']        = req.body.name;
        data['facebook_id'] = req.body.facebook_id;
        data['isCompleted'] = 0;        
        res.json(appfunctions.successResponse("msg_complete_profile", data));
      }
    }
  );
});


//For login with Google
router.post("/loginwithgoogle", (req, res, next) => {  
 
  name = req.body.name;
  google_id = req.body.google_id;
  email = req.body.email;
  User.findOne(
    {
      google_id: req.body.google_id,
      role_id: 2,
      
    },
    (err, existingUser) => {
      if (existingUser) 
      {       
        if(existingUser.token !='')
        {
          existingUser.token = '';
        }
        const jwttoken = jwt.sign(JSON.stringify(existingUser), config.secret);        
        existingUser.token = jwttoken; 
        existingUser.device_type = req.body.device_type
          ? req.body.device_type
          : "";
        existingUser.language_id = req.body.language_id;        
        existingUser.save((errs, existingUser) => {
          console.log(existingUser.email)
          if (errs) {
            res.json(appfunctions.failResponse("msg_something_wrong", errs));
          } else {
            if (existingUser.email == "" || !existingUser.email) {                                
              var data = JSON.stringify(existingUser);
              data = JSON.parse(data);
              data.isCompleted = 0;
              res.status(200).json({
                success: true,
                data: data,
                message: "msg_success"
              });
            } else {
              if (existingUser.status == 1) {
                var data = JSON.stringify(existingUser);
                data = JSON.parse(data);
                data.isCompleted = 1;
                data.login_with_social=1;
                res.status(200).json({
                  success: true,
                  data: data,
                  message: "msg_login_successfully"
                });                
              } else {                
                var otp = Math.floor(1000 + Math.random() * 9000);
                existingUser.otp = otp;
                existingUser.version = req.body.version?req.body.version:'1.0';
                existingUser.save((errs, user) => {
                  var user=user;
                  Emailtemplates.findOne(
                  {
                    slug: "verification_otp",
                    language_id:ObjectId(user.language_id)
                  },
                  (err, template) => {
                    if(err)
                    {
                       res.json(appfunctions.failResponse("msg_something_wrong"));
                    }
                    else
                    {
                        
                        if(template)
                        {
                            var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                            var issEmailSent = appfunctions.sendEmail(
                              template.subject,
                              user.email,
                              //config.emailFrom,
                              res.locals.app_title+' <'+config.emailFrom+'>',
                              templatereplace
                            );
                            if (issEmailSent == false) {
                              res.json(appfunctions.failResponse("msg_email_not_send"));
                            } else {
                              
                              res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                            }
                        }
                        else
                        {
                            Emailtemplates.findOne(
                            {
                              slug: "verification_otp",
                              language_id:ObjectId(config.defaultLanguageId)
                            },
                            (err, template) => {

                              if(err)
                              {
                                 res.json(appfunctions.failResponse("msg_something_wrong"));
                              }
                              else
                              {
                                var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                var issEmailSent = appfunctions.sendEmail(
                                  template.subject,
                                  user.email,
                                  //config.emailFrom,
                                  res.locals.app_title+' <'+config.emailFrom+'>',
                                  templatereplace
                                );
                                if (issEmailSent == false) {
                                  res.json(appfunctions.failResponse("msg_email_not_send"));
                                } else {
                                  let usernew  = JSON.stringify(user);
                                  //console.log(user.__proto__)
                                  usernew  = JSON.parse(usernew);
                                  usernew.isCompleted = 1;                                  
                                  res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", usernew));
                                }
                              }
                            })
                        }
                          
                    }
                  });

                });
              }
            }
          }
        });
        } else {
        
        // let user = new User();
        // if (req.body.surname) user.surname = req.body.surname;
        // if (req.body.name) user.name = req.body.name;
        // if (req.body.email) user.email = req.body.email;        
        // if (req.body.google_id) user.google_id = req.body.google_id;
        // if (req.body.language_id) user.language_id = req.body.language_id;
        // //if (req.body.learning_language_id) user.learning_language_id = req.body.learning_language_id;
        // //user.last_confirm_terms = "";
        // user.unit = "1";
        // user.role_id = 2;
        // user.status = 0;
        // user.version = req.body.version?req.body.version:'1.0';
        // user.save((errs, user) => {
        //   if (errs) {
        //     res.json(appfunctions.failResponse("msg_something_wrong", errs));
        //   } else {
        //     var data = JSON.stringify(user);
        //     console.log(data)
        //     data = JSON.parse(data);
        //     data.isCompleted = 0;
        //     res.json(appfunctions.successResponse("msg_success", data, req.user));
        //   }
        // });
        var data = new Object();
        data.google_id   = req.body.google_id
        data.email       = req.body.email
        data.name        = req.body.name?req.body.name:"";
        data.isCompleted = 0;
        res.json(appfunctions.successResponse("msg_complete_profile", data, req.user));
      }
    }
  );
});



//For getting list of all terms according to language
router.post("/terms", (req, res, next) => {
  //console.log(req.body);
  var language_id     = req.body.language_id;
  var eng_language_id = config.defaultLanguageId;
  //console.log(language_id)
  var query = terms
    .find({ language_id: eng_language_id })
    .select(["term", "text"]);
    query.exec(function(err, result) {
    if (err)
      res.status(500).json({
        success: false,
        message: "msg_something_wrong"
      });
    var query1 = terms
      .find({ language_id: language_id })
      .select(["term", "text"]);
    query1.exec(function(err1, result1) {
      if (err1)
      {
        res.json(failResponse("msg_something_wrong"));
      }      
      var trm = {}; 
      for (var i = 0; i < result.length; i++) {
        trm[result[i].term] = result[i].text;
      }

      for (var i = 0; i < result1.length; i++) {
        if(result1[i].text != null && result1[i].text != '')
        {
          trm[result1[i].term] = result1[i].text;
        }
        
      }    
      
      if (language_id) {
        res.json(appfunctions.successResponse("msg_provide_language", trm ,req.user,200,language_id));
      } else {
        res.json(appfunctions.successResponse("msg_provide_language", "" ,req.user,'',language_id));
      }
    });
  });
});

//For getting last inserted term date for updating currently running terms in the app
router.post("/getLastInsertedTermDate", (req, res, next) => {
  var language_id = ObjectId(req.body.language_id);
  Languages.findOne({ _id: language_id }).exec(function(err, result) {    
      if (err)
        res.json(appfunctions.failResponse("msg_something_wrong", err));
      
      let d1 = result.last_updated_date;     
      let dattime = d1;
      Setting.findOne({}, (err1, sett) => {
        
        let userInfo = {}; 
        userInfo.earliest_permitted_version = sett.earliest_permitted_version;
        userInfo.earliest_permitted_warning_version = sett.earliest_permitted_warning_version;
        userInfo.is_system_suspended = sett.is_system_suspended;
        res.json(appfunctions.successResponse("msg_success", {date:dattime,system_info:userInfo},req.user));
      });       
    });
});



//For checking user's last approve terms and conditions
router.post("/checkTermsConditions", (req, res, next) => {
  User.findOne(
    {
      _id: ObjectId(req.body.user_id)
    },
    (err, uInst) => {
      if (err) {
        res.json(failResponse("msg_something_wrong"));
      } else {
        if (uInst) {
          termsConditions.findOne({}, (err, result) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: "msg_something_wrong"
              });
            } else {
              var d1 = new Date(
                moment(uInst.last_confirm_terms).format("MM-DD-YYYY")
              );
              var d2 = new Date(moment(result.terms_date).format("MM-DD-YYYY"));
              if (
                uInst.last_confirm_terms != null &&
                d1.getTime() >= d2.getTime()
              ) {
               /* res.status(200).json({
                  success: true,
                  data: 1,
                  message: "msg_success"
                });*/
                res.json(appfunctions.successResponse("msg_success", 1,req.user));
              } else {
                res.json(appfunctions.successResponse("msg_success", 0,req.user));
               /* res.status(200).json({
                  success: true,
                  data: 0,
                  message: "msg_success"
                });*/
              }
            }
          });
        }
      }
    }
  );
});

//For getting list of languages
router.get("/languages", (req, res, next) => {
    let language_id = config.defaultLanguageId;
    Languages
        .aggregate([{
                $lookup: {
                    from: "terms",
                    let: {
                        slug: "$term"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                        $eq: [{
                                            $arrayElemAt: ["$language_id", 0]
                                        }, ObjectId(language_id)]
                                    },
                                    {
                                        $eq: ["$term", '$$slug']
                                    },
                                ]
                            }
                        }
                    }],
                    as: "terms"
                }
            },
            {
                $unwind: {
                    path: "$terms",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$_id",
                    term: "$term",
                    label: { $cond: { if: { $eq: [ { $ifNull: ["$terms.text", ""] }, '' ] }, then: "$language", else: "$terms.text" } }, 
                    "casesensitivetext": { "$toLower": { $cond: { if: { $eq: [ { $ifNull: ["$terms.text", ""] }, '' ] }, then: "$language", else: "$terms.text" } } },        
                    value: "$_id",

                }
            },
            {
                $sort: {
                    "casesensitivetext": 1
                }
            },
        ])
        .exec(function(err, result) {
           //console.log(JSON.stringify(result)+'languages');
            if (err) {
                res.json(appfunctions.failResponse("msg_something_wrong", err));
            } else {
                res.json(appfunctions.successResponse("msg_success", result));
            }
        });
});

//GET ALL LEARNING LANGUAGES
router.get("/learningLanguages/:lang_id", async(req, res, next) => {
    //let language_id = (req.user && req.user.language_id._id) ? req.user.language_id._id : config.defaultLanguageId; //ObjectId("5bebcde54974e2dc675a39f1");
    let language_id = ObjectId(req.params.lang_id);    
    let languages = await appfunctions.getLanguageDetailsById(language_id);    
    LearningLanguage.aggregate([{
                $lookup: {
                    from: "terms",
                    let: {
                        slug: "$term"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                        $eq: [{
                                            $arrayElemAt: ["$language_id", 0]
                                        }, ObjectId(language_id)]
                                    },
                                    {
                                        $eq: ["$term", '$$slug']
                                    },
                                ]
                            }
                        }
                    }],
                    as: "terms"
                }
            },
            {$match: {term_english:{$ne:languages.language}}},
            {
                $unwind: {
                    path: "$terms",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$_id",
                    term: "$term",
                    termtext: { $cond: { if: { $eq: [ { $ifNull: ["$terms.text", ""] }, '' ] }, then: "$term_english", else: "$terms.text" } }, 
                    "casesensitivetext": { "$toLower": { $cond: { if: { $eq: [ { $ifNull: ["$terms.text", ""] }, '' ] }, then: "$term_english", else: "$terms.text" } } },       
                    language_id: {
                        $arrayElemAt: ["$terms.language_id", 0]
                    },

                }
            },
            {
                $sort: {
                    "casesensitivetext": 1
                }
            },
        ])
        .exec(function(err, result) {
            if (err) {
                res.json(appfunctions.failResponse("msg_something_wrong", err));
            } else {
                res.json(appfunctions.successResponse("msg_success", result));
            }
        });
});

//set the directory for the uploads to the uploaded to
const DIR = "./public/uploads";
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function(req, file, cb) {
    
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({ storage: storage }).single("photo");

//For uploading image to server
router.post("/uploadPic", (req, res, next) => {

  upload(req, res, function(err) {
    var path = "";
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "msg_profile_not_updated_server_issue"
      });
    }
    
    if (req.file) path = req.file.path;
    if (path) {      
      path = path.replace("public/", "");      
      res.json({
        success: true,
        message: "msg_success",
        data: path
      });
    }
  });
});

//For user registration
router.post("/registration", (req, res, next) => {  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).json({
      success: false,
      message: errors.mapped()
    });
  } else 
  { 
    if(req.body.isFacebook == 1)
    {
      User.findOne({ facebook_id: req.body.facebook_id }, (err, user) => {
          if (err) 
          {
            res.json(appfunctions.failResponse("msg_not_valid_user"));
          }
          else
          { 
            if(user != null  && user.status == 1){
              user.facebook_id = req.body.facebook_id;
              user.login_with_social = 1;
              user.save((errs, loginuser)=>{
                if(errs){
                  res.json(appfunctions.failResponse("msg_something_wrong", errs));
                }else{
                  var data = JSON.stringify(user);
                  data = JSON.parse(data);
                  data.isCompleted = 1;
                  res.status(200).json({
                    success: true,
                    data: data,
                    message: "msg_login_successfully"
                  });     
                }
              })
            }else if(user != null  && user.status == 0){ 
              if (req.body.surname) user.surname = req.body.surname;
              if (req.body.gender) user.gender = req.body.gender;
              if (req.body.name) user.name = req.body.name;
              if (req.body.email) user.email = req.body.email;
              if (req.body.language_id) user.language_id = req.body.language_id;      
              user.role_id = 2;
              user.version = req.body.version?req.body.version:'1.0';
              user.status = 0; //req.body.status;
              user.learning_language_id = req.body.learning_language_id?req.body.learning_language_id:req.body.language_id;
              User.findOne({ email: req.body.email }, (err, existingUser) => {
                    if (existingUser) {
                      res.json(appfunctions.failResponse("msg_email_already_exist"));
                    } else {                      
                      var otp = Math.floor(1000 + Math.random() * 9000);
                      user.otp = otp;
                      user.login_with_social = 1;
                      user.save((errs, user) => {
                      if (errs) {
                        res.json(appfunctions.failResponse("msg_something_wrong", errs));
                      } else {
                        Emailtemplates.findOne(
                            {
                              slug: "verification_otp",
                              language_id:ObjectId(user.language_id)
                            },
                            (err, template) => {
                              if(err)
                              {
                                res.json(appfunctions.failResponse("msg_something_wrong"));
                              }
                              else
                              {
                                  if(template)
                                  {
                                      var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                      var issEmailSent = appfunctions.sendEmail(
                                        template.subject,
                                        user.email,
                                        //config.emailFrom,
                                        res.locals.app_title+' <'+config.emailFrom+'>',
                                        templatereplace
                                      );
                                      if (issEmailSent == false) {
                                        res.json(appfunctions.failResponse("msg_email_not_send"));
                                      } else {
                                        res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                      }
                                  }
                                  else
                                  {
                                      Emailtemplates.findOne(
                                      {
                                        slug: "verification_otp",
                                        language_id:ObjectId(config.defaultLanguageId)
                                      },
                                      (err, template) => {

                                        if(err)
                                        {
                                          res.json(appfunctions.failResponse("msg_something_wrong"));
                                        }
                                        else
                                        {
                                          var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                          var issEmailSent = appfunctions.sendEmail(
                                            template.subject,
                                            user.email,
                                            //config.emailFrom,
                                            res.locals.app_title+' <'+config.emailFrom+'>',
                                            templatereplace
                                          );
                                          if (issEmailSent == false) {
                                            res.json(appfunctions.failResponse("msg_email_not_send"));
                                          } else {
                                            res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                          }
                                        }
                                      })
                                  }                          
                              }
                            });
                          }
                        });
                      }
              });
            }else{                       
              User.findOne({ email: req.body.email }, (err, existingUser) => {
                if (existingUser) {
                  if(existingUser.status == 1){
                    existingUser.facebook_id = req.body.facebook_id;
                    existingUser.login_with_social = 1;
                    existingUser.save((errs, loginuser)=>{
                      if(errs){
                        res.json(appfunctions.failResponse("msg_something_wrong", errs));
                      }else{
                        var data = JSON.stringify(existingUser);
                        data = JSON.parse(data);
                        data.isCompleted = 1;
                        res.status(200).json({
                          success: true,
                          data: data,
                          message: "msg_login_successfully"
                        });     
                      }
                    })
                  }else if(existingUser.status == 0){
                    var otp = Math.floor(1000 + Math.random() * 9000);
                    existingUser.otp = otp;
                    existingUser.save((error, user)=>{
                      if(error){
                        json(appfunctions.failResponse("msg_something_wrong", errs));
                      }else{
                        Emailtemplates.findOne({slug:"verification_otp",language_id:ObjectId(user.language_id)},(err, template)=>{
                            if(err){
                              res.json(appfunctions.failResponse("msg_something_wrong"));
                            }else{
                              if(template){
                                var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                var issEmailSent = appfunctions.sendEmail(
                                  template.subject,
                                  user.email,
                                  //config.emailFrom,
                                  res.locals.app_title+' <'+config.emailFrom+'>',
                                  templatereplace
                                );
                                if (issEmailSent == false) {
                                  res.json(appfunctions.failResponse("msg_email_not_send"));
                                } else {
                                  res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                }
                              }else{
                                Emailtemplates.findOne({slug:'verification_otp',language_id:ObjectId(config.defaultLanguageId)},(err,template)=>{
                                    if(err)
                                    {
                                      res.json(appfunctions.failResponse("msg_something_wrong"));
                                    }
                                    else
                                    {
                                      var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                      var issEmailSent = appfunctions.sendEmail(
                                        template.subject,
                                        user.email,
                                        //config.emailFrom,
                                        res.locals.app_title+' <'+config.emailFrom+'>',
                                        templatereplace
                                      );
                                      if (issEmailSent == false) {
                                        res.json(appfunctions.failResponse("msg_email_not_send"));
                                      } else {
                                        res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                      }
                                    }
                                })
                              }
                            }
                        })
                      }
                    })
                  }else{
                    res.json(appfunctions.failResponse("msg_email_already_exist"));
                  }
                }else{
                  let user = new User();
                  if (req.body.gender) user.gender = req.body.gender;
                  if (req.body.name) user.name = req.body.name;
                  if (req.body.email) user.email = req.body.email;
                  if (req.body.surname) user.surname = req.body.surname;
                  if (req.body.language_id) user.language_id = req.body.language_id;  
                  if (req.body.facebook_id) user.facebook_id = req.body.facebook_id;      
                  user.role_id = 2;
                  user.version = req.body.version?req.body.version:'1.0';
                  user.status = 0; //req.body.status;
                  user.learning_language_id = req.body.learning_language_id?req.body.learning_language_id:req.body.language_id;                     
                  var otp = Math.floor(1000 + Math.random() * 9000);
                  user.otp = otp;
                  user.login_with_social = 1;
                  user.save((errs, user) => {
                  if (errs) {
                    res.json(appfunctions.failResponse("msg_something_wrong", errs));
                  } else {
                    Emailtemplates.findOne(
                        {
                          slug: "verification_otp",
                          language_id:ObjectId(user.language_id)
                        },
                        (err, template) => {
                          if(err)
                          {
                            res.json(appfunctions.failResponse("msg_something_wrong"));
                          }
                          else
                          {
                              if(template)
                              {
                                  var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                  var issEmailSent = appfunctions.sendEmail(
                                    template.subject,
                                    user.email,
                                    //config.emailFrom,
                                    res.locals.app_title+' <'+config.emailFrom+'>',
                                    templatereplace
                                  );
                                  if (issEmailSent == false) {
                                    res.json(appfunctions.failResponse("msg_email_not_send"));
                                  } else {
                                    res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                  }
                              }
                              else
                              {
                                  Emailtemplates.findOne(
                                  {
                                    slug: "verification_otp",
                                    language_id:ObjectId(config.defaultLanguageId)
                                  },
                                  (err, template) => {

                                    if(err)
                                    {
                                      res.json(appfunctions.failResponse("msg_something_wrong"));
                                    }
                                    else
                                    {
                                      var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                      var issEmailSent = appfunctions.sendEmail(
                                        template.subject,
                                        user.email,
                                        //config.emailFrom,
                                        res.locals.app_title+' <'+config.emailFrom+'>',
                                        templatereplace
                                      );
                                      if (issEmailSent == false) {
                                        res.json(appfunctions.failResponse("msg_email_not_send"));
                                      } else {
                                        res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                      }
                                    }
                                  })
                                }                          
                            }
                        });
                      }
                    });
                }
              });
            }
          }
      });
    }else if(req.body.isGoogle == 1){        
        User.findOne({ google_id: req.body.google_id }, (err, user) => {
          if (err){
            res.json(appfunctions.failResponse("msg_not_valid_user"));
          }else{              
              if(user != null && user.status == 1){                
                user.google_id = req.body.google_id;
                user.login_with_social = 1; 
                user.save((errs, loginuser)=>{
                  if(errs){
                    res.json(appfunctions.failResponse("msg_something_wrong", errs));
                  }else{
                    var data = JSON.stringify(user);
                    data = JSON.parse(data);
                    data.isCompleted = 1;
                    res.status(200).json({
                      success: true,
                      data: data,
                      message: "msg_success"
                    });     
                  }
                })
              }else if(user != null && user.status == 0 && user.email == null){
                              
                if (req.body.surname) user.surname = req.body.surname;
                if (req.body.gender) user.gender = req.body.gender;
                if (req.body.name) user.name = req.body.name;
                if (req.body.email) user.email = req.body.email;
                if (req.body.language_id) user.language_id = req.body.language_id;      
                user.role_id = 2;
                user.version = req.body.version?req.body.version:'1.0';
                user.status = 0; 
                user.learning_language_id = req.body.learning_language_id?req.body.learning_language_id:req.body.language_id;
                user.login_with_social = 1; 
                User.findOne({ email: req.body.email }, (err, existingUser) => {
                      if (existingUser) {
                        res.json(appfunctions.failResponse("msg_email_already_exist"));
                      } else {                      
                        var otp = Math.floor(1000 + Math.random() * 9000);
                        user.otp = otp;
                        user.save((errs, user) => {
                        if (errs) {
                          res.json(appfunctions.failResponse("msg_something_wrong", errs));
                        } else {
                          Emailtemplates.findOne(
                              {
                                slug: "verification_otp",
                                language_id:ObjectId(user.language_id)
                              },
                              (err, template) => {
                                if(err)
                                {
                                  res.json(appfunctions.failResponse("msg_something_wrong"));
                                }
                                else
                                {
                                    if(template)
                                    {
                                        var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                        var issEmailSent = appfunctions.sendEmail(
                                          template.subject,
                                          user.email,
                                          //config.emailFrom,
                                          res.locals.app_title+' <'+config.emailFrom+'>',
                                          templatereplace
                                        );
                                        if (issEmailSent == false) {
                                          res.json(appfunctions.failResponse("msg_email_not_send"));
                                        } else {
                                          res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                        }
                                    }
                                    else
                                    {
                                        Emailtemplates.findOne(
                                        {
                                          slug: "verification_otp",
                                          language_id:ObjectId(config.defaultLanguageId)
                                        },
                                        (err, template) => {

                                          if(err)
                                          {
                                            res.json(appfunctions.failResponse("msg_something_wrong"));
                                          }
                                          else
                                          {
                                            var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                            var issEmailSent = appfunctions.sendEmail(
                                              template.subject,
                                              user.email,
                                              //config.emailFrom,
                                              res.locals.app_title+' <'+config.emailFrom+'>',
                                              templatereplace
                                            );
                                            if (issEmailSent == false) {
                                              res.json(appfunctions.failResponse("msg_email_not_send"));
                                            } else {
                                              res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                            }
                                          }
                                        })
                                    }                          
                                }
                              });
                            }
                          });
                      }
                });
              }else if(user != null && user.status == 0 && user.email != null){
                
                var otp = Math.floor(1000 + Math.random() * 9000);
                user.otp = otp;
                user.login_with_social = 1; 
                user.save((errs, user) => {
                if (errs) {
                  res.json(appfunctions.failResponse("msg_something_wrong", errs));
                } else {
                  Emailtemplates.findOne(
                      {
                        slug: "verification_otp",
                        language_id:ObjectId(user.language_id)
                      },
                      (err, template) => {
                        if(err)
                        {
                          res.json(appfunctions.failResponse("msg_something_wrong"));
                        }
                        else
                        {
                            if(template)
                            {
                                var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                var issEmailSent = appfunctions.sendEmail(
                                  template.subject,
                                  user.email,
                                  //config.emailFrom,
                                  res.locals.app_title+' <'+config.emailFrom+'>',
                                  templatereplace
                                );
                                if (issEmailSent == false) {
                                  res.json(appfunctions.failResponse("msg_email_not_send"));
                                } else {
                                  res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                }
                            }
                            else
                            {
                                Emailtemplates.findOne(
                                {
                                  slug: "verification_otp",
                                  language_id:ObjectId(config.defaultLanguageId)
                                },
                                (err, template) => {

                                  if(err)
                                  {
                                    res.json(appfunctions.failResponse("msg_something_wrong"));
                                  }
                                  else
                                  {
                                    var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                    var issEmailSent = appfunctions.sendEmail(
                                      template.subject,
                                      user.email,
                                      //config.emailFrom,
                                      res.locals.app_title+' <'+config.emailFrom+'>',
                                      templatereplace
                                    );
                                    if (issEmailSent == false) {
                                      res.json(appfunctions.failResponse("msg_email_not_send"));
                                    } else {
                                      res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                    }
                                  }
                                })
                            }                          
                        }
                      });
                    }
                  });
              } else{
                
                User.findOne({ email: req.body.email }, (err, existingUser) => {
                  if (existingUser) {
                    if(existingUser.status == 1){
                      existingUser.google_id = req.body.google_id;
                      existingUser.login_with_social = 1; 
                      existingUser.save((errs, loginuser)=>{
                        if(errs){
                          res.json(appfunctions.failResponse("msg_something_wrong", errs));
                        }else{
                          var data = JSON.stringify(existingUser);
                          data = JSON.parse(data);
                          data.isCompleted = 1;
                          res.status(200).json({
                            success: true,
                            data: data,
                            message: "msg_success"
                          });     
                        }
                      })
                    }else if(existingUser.status == 0){
                      existingUser.google_id = req.body.google_id;
                      var otp = Math.floor(1000 + Math.random() * 9000);
                      existingUser.otp = otp;
                      existingUser.login_with_social = 1; 
                      existingUser.save((error, user)=>{
                        if(error){
                          json(appfunctions.failResponse("msg_something_wrong", errs));
                        }else{
                          Emailtemplates.findOne({slug:"verification_otp",language_id:ObjectId(user.language_id)},(err, template)=>{
                              if(err){
                                res.json(appfunctions.failResponse("msg_something_wrong"));
                              }else{
                                if(template){
                                  var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                  var issEmailSent = appfunctions.sendEmail(
                                    template.subject,
                                    user.email,
                                    //config.emailFrom,
                                    res.locals.app_title+' <'+config.emailFrom+'>',
                                    templatereplace
                                  );
                                  if (issEmailSent == false) {
                                    res.json(appfunctions.failResponse("msg_email_not_send"));
                                  } else {
                                    res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                  }
                                }else{
                                  Emailtemplates.findOne({slug:'verification_otp',language_id:ObjectId(config.defaultLanguageId)},(err,template)=>{
                                      if(err)
                                      {
                                        res.json(appfunctions.failResponse("msg_something_wrong"));
                                      }
                                      else
                                      {
                                        var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                        var issEmailSent = appfunctions.sendEmail(
                                          template.subject,
                                          user.email,
                                          //config.emailFrom,
                                          res.locals.app_title+' <'+config.emailFrom+'>',
                                          templatereplace
                                        );
                                        if (issEmailSent == false) {
                                          res.json(appfunctions.failResponse("msg_email_not_send"));
                                        } else {
                                          res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                        }
                                      }
                                  })
                                }
                              }
                          })
                        }
                      })
                    }else{
                      res.json(appfunctions.failResponse("msg_email_already_exist"));
                    }
                  }else{
                    let user = new User();
                    if (req.body.gender) user.gender = req.body.gender;
                    if (req.body.name) user.name = req.body.name;
                    if (req.body.email) user.email = req.body.email;
                    if (req.body.language_id) user.language_id = req.body.language_id;  
                    if (req.body.google_id) user.google_id = req.body.google_id;      
                    user.role_id = 2;
                    user.version = req.body.version?req.body.version:'1.0';
                    user.status = 0; //req.body.status;
                    user.login_with_social = 1; 
                    user.learning_language_id = req.body.learning_language_id?req.body.learning_language_id:req.body.language_id;                     
                    var otp = Math.floor(1000 + Math.random() * 9000);
                    user.otp = otp;
                    user.save((errs, user) => {
                    if (errs) {
                      res.json(appfunctions.failResponse("msg_something_wrong", errs));
                    } else {
                      Emailtemplates.findOne(
                          {
                            slug: "verification_otp",
                            language_id:ObjectId(user.language_id)
                          },
                          (err, template) => {
                            if(err)
                            {
                              res.json(appfunctions.failResponse("msg_something_wrong"));
                            }
                            else
                            {
                                if(template)
                                {
                                    var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                    var issEmailSent = appfunctions.sendEmail(
                                      template.subject,
                                      user.email,
                                      //config.emailFrom,
                                      res.locals.app_title+' <'+config.emailFrom+'>',
                                      templatereplace
                                    );
                                    if (issEmailSent == false) {
                                      res.json(appfunctions.failResponse("msg_email_not_send"));
                                    } else {
                                      res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                    }
                                }
                                else
                                {
                                    Emailtemplates.findOne(
                                    {
                                      slug: "verification_otp",
                                      language_id:ObjectId(config.defaultLanguageId)
                                    },
                                    (err, template) => {
  
                                      if(err)
                                      {
                                        res.json(appfunctions.failResponse("msg_something_wrong"));
                                      }
                                      else
                                      {
                                        var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                        var issEmailSent = appfunctions.sendEmail(
                                          template.subject,
                                          user.email,
                                          //config.emailFrom,
                                          res.locals.app_title+' <'+config.emailFrom+'>',
                                          templatereplace
                                        );
                                        if (issEmailSent == false) {
                                          res.json(appfunctions.failResponse("msg_email_not_send"));
                                        } else {
                                          res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                        }
                                      }
                                    })
                                  }                          
                              }
                          });
                        }
                      });
                  }
                });
              }
          }
      });
    }else {      
      User.findOne({email:req.body.email}, (err, existingUser)=>{
          if(err){
            res.json(appfunctions.failResponse("msg_email_already_exist"));
          }else{            
            if(existingUser){ 
              res.json(appfunctions.failResponse("msg_email_already_exist"));
            }else{              
              let user = new User();
              if (req.body.surname) user.surname = req.body.surname;
              if (req.body.gender) user.gender = req.body.gender;
              if (req.body.name) user.name = req.body.name;
              if (req.body.email) user.email = req.body.email;
              if (req.body.password) user.password = req.body.password;    
              if (req.body.language_id) user.language_id = req.body.language_id;      
              user.role_id = 2;
              user.version = req.body.version?req.body.version:'1.0';
              user.status = 0; //req.body.status;
              user.learning_language_id = req.body.learning_language_id?req.body.learning_language_id:req.body.language_id;
              user.login_with_social = 1; 
              User.findOne({ email: req.body.email }, (err, existingUser) => {
                if (existingUser && existingUser.status ==1 ) {
                  console.log('hylllllllllllllllllll');
                  res.json(appfunctions.failResponse("msg_email_already_exist"));       
                } else {              
                  var otp = Math.floor(1000 + Math.random() * 9000);
                  user.otp = otp;
                  user.save((errs, user) => {
                    if (errs) {
                      res.json(appfunctions.failResponse("msg_something_wrong", errs));
                    } else {
                      Emailtemplates.findOne(
                          {
                            slug: "verification_otp",
                            language_id:ObjectId(user.language_id)
                          },
                          (err, template) => {
                            if(err)
                            {
                              res.json(appfunctions.failResponse("msg_something_wrong"));
                            }
                            else
                            {
                                if(template)
                                {
                                    var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                    var issEmailSent = appfunctions.sendEmail(
                                      template.subject,
                                      user.email,
                                      //config.emailFrom,
                                      res.locals.app_title+' <'+config.emailFrom+'>',
                                      templatereplace
                                    );
                                    if (issEmailSent == false) {
                                      res.json(appfunctions.failResponse("msg_email_not_send"));
                                    } else {
                                      res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                    }
                                }
                                else
                                {
                                    Emailtemplates.findOne(
                                    {
                                      slug: "verification_otp",
                                      language_id:ObjectId(config.defaultLanguageId)
                                    },
                                    (err, template) => {

                                      if(err)
                                      {
                                        res.json(appfunctions.failResponse("msg_something_wrong"));
                                      }
                                      else
                                      {
                                        var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                        var issEmailSent = appfunctions.sendEmail(
                                          template.subject,
                                          user.email,
                                          //config.emailFrom,
                                          res.locals.app_title+' <'+config.emailFrom+'>',
                                          templatereplace
                                        );
                                        if (issEmailSent == false) {
                                          res.json(appfunctions.failResponse("msg_email_not_send"));
                                        } else {
                                          res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                        }
                                      }
                                    })
                                }                          
                            }
                          });
                        }
                    });
                }
              });
            }
          }
      })
      
    }
  }
});


//For verify OTP
router.post("/verifyOtp", (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  let is_reg = req.body.is_register?req.body.is_register:false;
  if (!errors.isEmpty()) {
    res.status(500).json({
      success: false,
      message: errors.mapped()
    });
  } else {
    User.findOne(
      {
        email: req.body.email,
        otp: req.body.otp
      },
      (err, existingUser) => {
        if (existingUser) {
          existingUser.status = 1;
          existingUser.otp = null;
          if(is_reg == true )
          {
            existingUser.last_confirm_notification = Date.now();
          }
           
          existingUser.save((errs, user) => {
            if(errs)
            {
              res.json(appfunctions.failResponse("msg_something_wrong",errs));
            }
            else
            {
                termsConditions.findOne({}, (err, result) => {
                if (err) {
                  res.status(500).json({
                    success: false,
                    message: "msg_something_wrong"
                  });
                } else {
                  var d1 = new Date(
                    moment(existingUser.last_confirm_terms).format("MM-DD-YYYY")
                  );
                  var d2 = new Date(
                    moment(result.terms_date).format("MM-DD-YYYY")
                  );
                  var user = JSON.stringify(existingUser);
                  user = JSON.parse(user);
                  if (
                    user.last_confirm_terms != null &&
                    d1.getTime() >= d2.getTime()
                  ) {                  
                    const jwttoken = jwt.sign(JSON.stringify(user), config.secret); 
                    user.isTermChecked = 1;                 
                    user.token = jwttoken;                   
                    res.json(appfunctions.successResponse("msg_otp_verified", user, req.user));
                     
                  } else 
                  {                  
                    const jwttoken = jwt.sign(JSON.stringify(user), config.secret);
                    user.token = jwttoken;
                    user.isTermChecked = 0;                
                    res.json(appfunctions.successResponse("msg_otp_verified", user, req.user));
                  }
                }
              });
            }
          });
        } else {
          res.json(appfunctions.failResponse("msg_otp_not_matched"));
        }
      }
    );
  }
});


//For User Logout
router.post("/logout", (req, res, next) => {
  var userid = req.body.user_id;
  // On Logout clear the device token for a user 
  User.updateOne(
    { _id: ObjectId(userid) },
    {
      $set: {
        device_token: ""
      }
    },
    function(err, result) {
      if (err) {
        res.json(appfunctions.failResponse("msg_something_wrong"));
      } else {
        res.json(appfunctions.successResponse("msg_profile_updated", result));
      }
    }
  );
});


//For approve terms and conditions
router.post("/approveTermsConditions", (req, res, next) => {  
  User.findOne(
    {
      _id: ObjectId(req.body.user_id)
    },
    (err, uInst) => {
      
      if (err) {
        res.json(appfunctions.failResponse("msg_something_wrong"));
      } else {
        if (uInst) {          
          uInst.last_confirm_terms = new Date();
          uInst.save();
        //  req.user.isTermChecked = 1;
          res.json(appfunctions.successResponse("msg_terms_conditions_approved", uInst, req.user));
        }
      }
    }
  );
});

//For forgot password
router.post("/forgotpassword", (req, res, next) => {
  User.findOne(
    {
      email: req.body.email,
      //status: 1
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res.json(appfunctions.failResponse("msg_not_registred_user"));
      }else if (user) {
        //user.token =  crypto.randomBytes(20).toString('hex');
        var otp = Math.floor(1000 + Math.random() * 9000);
        user.otp = otp;
        user.save();

      Emailtemplates.findOne(
        {
          slug: "verification_otp",
          language_id:ObjectId(user.language_id)
        },
        (err, template) => {

          if(err)
          {
              res.json(appfunctions.failResponse("msg_something_wrong"));
          }
          else
          {
              if(template)
              {
                  var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                  var issEmailSent = appfunctions.sendEmail(
                    template.subject,
                    user.email,
                    //config.emailFrom,
                    res.locals.app_title+' <'+config.emailFrom+'>',

                    templatereplace
                  );
                  if (issEmailSent == false) {
                    res.json(appfunctions.failResponse("msg_email_not_send"));
                  } else {
                    res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                  }
              }
              else
              {
                  Emailtemplates.findOne(
                  {
                    slug: "verification_otp",
                    language_id:ObjectId(config.defaultLanguageId)
                  },
                  (err, template) => {

                    if(err)
                    {
                        res.json(appfunctions.failResponse("msg_something_wrong"));
                    }
                    else
                    {
                      var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                      var issEmailSent = appfunctions.sendEmail(
                        template.subject,
                        user.email,
                        //config.emailFrom,
                        res.locals.app_title+' <'+config.emailFrom+'>',
                        templatereplace
                      );
                      if (issEmailSent == false) {
                        res.json(appfunctions.failResponse("msg_email_not_send"));
                      } else {
                        res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                      }
                    }
                  })
              }
                
          }
        });
      }
    }
  );
});


//For resend otp
router.post("/resendotp", (req, res, next) => {
  User.findOne(
    {
      email: req.body.email,
      //status: 1
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res.json(appfunctions.failResponse("msg_not_registred_user"));
      } else if (user) {        
        var otp = Math.floor(1000 + Math.random() * 9000);
        user.otp = otp;
        user.save();
        Emailtemplates.findOne(
                  {
                    slug: "verification_otp",
                    language_id:ObjectId(user.language_id)
                  },
                  (err, template) => {

                    if(err)
                    {
                       res.json(appfunctions.failResponse("msg_something_wrong"));
                    }
                    else
                    {
                        if(template)
                        {
                            var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                            var issEmailSent = appfunctions.sendEmail(
                              template.subject,
                              user.email,
                              //config.emailFrom,
                              res.locals.app_title+' <'+config.emailFrom+'>',

                              templatereplace
                            );
                            if (issEmailSent == false) {
                              res.json(appfunctions.failResponse("msg_email_not_send"));
                            } else {
                              res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                            }
                        }
                        else
                        {
                            Emailtemplates.findOne(
                            {
                              slug: "verification_otp",
                              language_id:ObjectId(config.defaultLanguageId)
                            },
                            (err, template) => {

                              if(err)
                              {
                                 res.json(appfunctions.failResponse("msg_something_wrong"));
                              }
                              else
                              {
                                var templatereplace = template.description.replace( "{otp}",otp).replace("{name}",user.name);
                                var issEmailSent = appfunctions.sendEmail(
                                  template.subject,
                                  user.email,
                                  //config.emailFrom,
                                  res.locals.app_title+' <'+config.emailFrom+'>',

                                  templatereplace
                                );
                                if (issEmailSent == false) {
                                  res.json(appfunctions.failResponse("msg_email_not_send"));
                                } else {
                                  res.json(appfunctions.successResponse("msg_check_reg_email_for_otp", user));
                                }
                              }
                            })
                        }
                          
                    }
                  });
    
      }
    }
  );
});

//For reset password
router.post("/resetpassword", (req, res, next) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err) {
        res.json(appfunctions.failResponse("msg_not_valid_user"));
      } else {
        if (req.body.password != req.body.confirm_password) {
          res.json(appfunctions.failResponse("msg_confirm_pass_not_matched"));
        } else {
          
          user.password = req.body.password;
          user.save();
          res.json(appfunctions.successResponse("msg_password_changed"));
        }
      }
    }
  );
});


//For change password
router.post('/changepassword', (req, res, next) => {
    //let oldpassword = bcrypt.hashSync(req.body.old_password, 10);
    User.findOne({
        _id: ObjectId(req.body.user_id)
    }, (err, user) => {
        if (err) {
            res.json(appfunctions.failResponse("msg_not_valid_user"));
        } else {         

           bcrypt.compare(req.body.old_password, user.password, (err, isMatch) => {
            if (isMatch) {                
                    user.password = req.body.new_password;
                    user.save();
                    res.json(appfunctions.successResponse("msg_password_changed"));
                
            } else {
                res.json(appfunctions.failResponse("msg_old_password_wrong"));
            }
          });


        } 
    })
})

//App Guide Data
router.post('/app-guide',(req,res,next) => {
  language_id = req.body.language_id;
  AppGuide.find({language_id:language_id},{_id:0})
  .select(["title",'heading','description'])  
  .sort({'created':1})
  .limit(8)
  .exec(function(err,result){
    if(err) {
      res.json(appfunctions.failResponse("erro", err));
    }else{
      if(result.length > 0){        
        res.json(appfunctions.successResponse("msg_app_guides", result ,language_id));
      }else{ 
        //Default Langauge App Guides
        AppGuide.find({language_id:ObjectId(config.defaultLanguageId)},{_id:0})
        .select(["title",'heading','description'])
        .sort({'created':1})
        .limit(8)
        .exec(function(errs,results){
          if(errs){
            res.json(appfunctions.failResponse("erro", err));
          }else{
            res.json(appfunctions.successResponse("msg_app_guides", results ,language_id));
          }
        })

      }      
    }
  })
})
module.exports = router;
