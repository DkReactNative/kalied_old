var AboutUs = require('./../../model/aboutUsModel');
var ContactUs =  require('./../../model/contactUsModel');
var Faq = require('./../../model/faqModel');
var HowItWorks = require('../../model/howItWorksModel');
const adminHelper = require("./../../helper/adminHelper");
const rename = require("./../../helper/renameFile");
const unlink = require("./../../helper/unlinkFile");
const jwt = require("jsonwebtoken");
const appConfig = require('./../../config/app');
const mongoose = require('mongoose');
var formidable = require('formidable');
const { base64encode, base64decode } = require('nodejs-base64');
const ObjectId = mongoose.Types.ObjectId;
const {validationResult} = require('express-validator');
const validation  = require('./../../validation/adminValidation');
var fs = require('fs');

const about_index = function(req, res){
  AboutUs.findOne({}, function(err1, result) {
      if(err1){
          res.json({
            status: 0,
            message: 'Something went wrong.',
            statuscode:400,
            response: ''
          });
          return;

      }
      if(!result){

        res.json({
            status: 0,
            message: 'data not found.',
            statuscode:400,
            response: ''
          });
        return;

      }else{
            result=JSON.stringify(result);
            result=JSON.parse(result);
            result.leftimage = appConfig.uploadUrl+'about-us/'+result.leftimage;
            result.rightimage = appConfig.uploadUrl+'about-us/'+result.rightimage;
            res.json({
                status: 1,
                message: 'successfully',
                statuscode:200,
                response: result
              });
            return;
          }
     })
}
   

const about_update = function(req, res){

  // console.log(req);
  var form = new formidable.IncomingForm();
  form.uploadDir=__dirname + '/../../public/uploads/about-us/';
  form.parse(req, async function(err, fields, files) {
    console.log(fields);
    if(err){
        res.json({
          status: 0,
          message: 'Something went wrong.',
          statuscode:400,
          response: ''
        });
        return;
       } 

       console.log(files)
        let leftimageName = "";
        if(files.leftimage && files.leftimage.name){
             leftimageName = new Date().getTime() + files.leftimage.name.replace(" ","-");
              var oldpath = files.leftimage.path;
              var newpath = __dirname + '/../../public/uploads/about-us/' + leftimageName;
              let data = await rename(oldpath,newpath);
                if(!data){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
                }
        }

        let  rightimageName =""
        if(files.rightimage && files.rightimage.name){
              rightimageName = new Date().getTime() + files.rightimage.name.replace(" ","-");
              var oldpath = files.rightimage.path;
              var newpath = __dirname + '/../../public/uploads/about-us/' + rightimageName;
              let data = await rename(oldpath,newpath);
                if(!data){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
                }
            }   

       AboutUs.findOne({_id:ObjectId(fields.id)}, async function(err1, result) {
              if(err1){

                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
              }
              console.log(result)
              if(!result){
               let updateObject = new AboutUs();
                if(leftimageName.length != 0)
                {
                  updateObject.leftimage = leftimageName;
            
                }
                if(rightimageName.length != 0)
                {
                  updateObject.rightimage = rightimageName;
                }

                updateObject.title=fields.title;
                updateObject.title_descrition=fields.title_descrition;
                updateObject.description1=fields.description1;
                updateObject.description2=fields.description2;
                updateObject.save().then( about => { 
                      about.leftimage = (leftimageName.length != 0)? appConfig.uploadUrl+'about-us/'+leftimageName:appConfig.uploadUrl+'about-us/'+about.leftimage;
                      about.rightimage = (rightimageName.length != 0)? appConfig.uploadUrl+'about-us/'+rightimageName:appConfig.uploadUrl+'about-us/'+about.rightimage;
                    res.json({
                        status: 1,
                        message: 'Page updated successfully.',
                        statuscode:200,
                        response: about

                      });
                    return;
                  }).catch(err=>{
                    res.json({
                        status: 0,
                        message: 'Page not updated successfully.',
                        statuscode:400,
                        response: err
                      });
                    return;
                  });
  
               } 
               else{
                   let updateObject = {};
                if(leftimageName.length != 0 && result.leftimage)
                {
                  updateObject.leftimage = leftimageName;
                  var old_image = __dirname + '/../../public/uploads/about-us/' + result.leftimage;
                    let err = await unlink(old_image);
                    if(!err){
                          res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode:400,
                            response: ''
                          });
                          return;
                    }
            
                }
                if(rightimageName.length != 0 && result.rightimage)
                {
                  updateObject.rightimage = rightimageName;
                  var old_image = __dirname + '/../../public/uploads/about-us/' + result.rightimage;
                    let err = await unlink(old_image);
                    if(!err){
                          res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode:400,
                            response: ''
                          });
                          return;
                    }
                }
                updateObject.rightimage =rightimageName.length != 0? rightimageName:result.rightimage;
                updateObject.leftimage =leftimageName.length != 0?leftimageName:result.leftimage;
                updateObject.title=fields.title;
                updateObject.title_descrition=fields.title_descrition;
                updateObject.description1=fields.description1;
                updateObject.description2=fields.description2;
                AboutUs.findOneAndUpdate({_id:ObjectId(fields.id)},updateObject, function(err2, about) {
                    if (err2){
                      res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode:400,
                        response: ''
                      });
                      return;
                    }
                    //console.log(user);
                    if(about){
                      about.leftimage = (leftimageName.length != 0)? appConfig.uploadUrl+'about-us/'+leftimageName:appConfig.uploadUrl+'about-us/'+about.leftimage;
                      about.rightimage = (rightimageName.length != 0)? appConfig.uploadUrl+'about-us/'+rightimageName:appConfig.uploadUrl+'about-us/'+about.rightimage;
                      res.json({
                          status: 1,
                          message: 'Page updated successfully.',
                          statuscode:200,
                          response: about
                        });
                      return;
                    }
                    else{

                      res.json({
                          status: 0,
                          message: 'Page not updated successfully.',
                          statuscode:400,
                          response: about
                        });
                    }
                  });
          }
        })
  })
}

const contact_index = function(req, res){
  ContactUs.findOne({}, function(err1, result) {
      if(err1){
          res.json({
            status: 0,
            message: 'Something went wrong.',
            statuscode:400,
            response: ''
          });
          return;

      }
      if(!result){

        res.json({
            status: 0,
            message: 'data not found.',
            statuscode:400,
            response: ''
          });
        return;

      }else{
            res.json({
                status: 1,
                message: 'successfully',
                statuscode:200,
                response: result
              });
            return;
          }
     })
}
   

const contact_update = function(req, res){

  // console.log(req);
  var form = new formidable.IncomingForm();
  form.uploadDir=__dirname + '/../../public/uploads/about-us/';
  form.parse(req, async function(err, fields, files) {
    console.log(fields);
    if(err){
        res.json({
          status: 0,
          message: 'Something went wrong.',
          statuscode:400,
          response: ''
        });
        return;
       } 
       ContactUs.findOne({_id:ObjectId(fields.id)}, async function(err1, result) {
              if(err1){

                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
              }
              console.log(result)
              if(!result){
               let updateObject = new ContactUs();
               let support  = fields.support;
               let customer = fields.customer;
               let address  = fields.address;
               support  =  JSON.parse(support);
               console.log(support)
               customer = JSON.parse(customer)
               address  = JSON.parse(address)
               updateObject.title=fields.title;
               updateObject.title_descrition=fields.title_descrition;
               updateObject.support=support;
               updateObject.customer=customer
               updateObject.address=address
               updateObject.get_in_touch=fields.get_in_touch
               updateObject.save().then( about => { 
                    res.json({
                        status: 1,
                        message: 'Page updated successfully.',
                        statuscode:200,
                        response: about

                      });
                    return;
                  }).catch(err=>{
                    res.json({
                        status: 0,
                        message: 'Page not updated successfully.',
                        statuscode:400,
                        response: err
                      });
                    return;
                  });
  
               } 
               else{
                     let updateObject = {};
                     let support  = fields.support;
                     let customer = fields.customer;
                     let address  = fields.address;
                     support  =  JSON.parse(support);
                     console.log(support)
                     customer = JSON.parse(customer)
                     address  = JSON.parse(address)
                     updateObject.title=fields.title;
                     updateObject.title_descrition=fields.title_descrition;
                     updateObject.support=support;
                     updateObject.customer=customer
                     updateObject.address=address
                     updateObject.get_in_touch=fields.get_in_touch
                    ContactUs.findOneAndUpdate({_id:ObjectId(fields.id)},updateObject, function(err2, about) {
                    if (err2){
                      res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode:400,
                        response: ''
                      });
                      return;
                    }
                    //console.log(user);
                    if(about){
                      res.json({
                          status: 1,
                          message: 'Page updated successfully.',
                          statuscode:200,
                          response: about
                        });
                      return;
                    }
                    else{

                      res.json({
                          status: 0,
                          message: 'Page not updated successfully.',
                          statuscode:400,
                          response: about
                        });
                    }
                  });
          }
        })
  })
}

const faq_index =(req,res)=>{
  var form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    console.log(fields);
    if(err){
        res.json({
          status: 0,
          message: 'Something went wrong.',
          statuscode:400,
          response: ''
        });
        return;
       } 
  var page = req.params.page || 1;
  var perPage = 10;
  var json = {};
  Faq.find(json)    
    .limit(perPage)
    .skip(perPage * page - perPage)
    .exec(function(err, result) {
      Faq.find()
        .count()
        .exec(async function(err, count) {
          if (err){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
          } else{ 
             res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode:200,
                    response: {
                      terms: result,
                      current: page,
                      perPage: perPage,
                      pages: Math.ceil(count / perPage),
                      pagelimit: perPage, 
                    }
                  });
                  return;
        }
        });
    });
  })
}
const faq_create =(req,res)=>{
  var form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    console.log(fields);
              if(err){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
                 } 
                const { answer, question } = fields;
            
            const newFaq = new Faq({
              question,
              answer,
            });

            Faq.findOne({
              slug:'dk'
            }).exec(function(err, result) {
              if (result == null) {
                newFaq.save().then(result => {
                  res.json({
                        status: 1,
                        message: 'Faq created successfully',
                        statuscode:200,
                        response: result
                      });
                  return;
                });
              } else {
                
                res.json({
                        status: 0,
                        message: 'Faq already exists with this slug',
                        statuscode:400,
                        response: ""
                      });
                return;
              }
            });
  })
}
const faq_update =(req,res)=>{
   var form = new formidable.IncomingForm();
   form.parse(req, async function(err, fields, files) {
    console.log(fields);
              if(err){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
                 }  else{
                var id = req.params.id;
                const {  question, answer } = fields
          
              Faq.findOneAndUpdate(
              {
                _id: id
              },
              {
                $set: {
                  question: question,
                  answer: answer,
                }
              },
              (err, docs) => {
                if (err) {
                  
                   res.json({
                        status: 0,
                        message: 'Faq update failed',
                        statuscode:400,
                        response: ""
                      });

                } else {

                  res.json({
                        status: 1,
                        message: 'Faq updated successfully',
                        statuscode:200,
                        response: docs
                      });

                }
              }
            );
       }
  })

}
const faq_delete =(req,res)=>{
        var form = new formidable.IncomingForm();
   form.parse(req, async function(err, fields, files) {
    console.log(fields);
              if(err){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
                 }  else{
                var id = req.params.id;
                Faq.remove(
                  {
                    _id: ObjectId(id)
                  },
                  function(err, result) {
                    if (err) {
                     res.json({
                        status: 0,
                        message: 'Faq Page not deleted successfully',
                        statuscode:400,
                        response: err
                      });
                      
                    } else {
                       res.json({
                        status: 1,
                        message: 'Faq Page deleted successfully',
                        statuscode:200,
                        response: result
                      });

                    }
                  }
                );
       }
  })
}

const faq_view =(req,res)=>{
                   var form = new formidable.IncomingForm();
           form.parse(req, async function(err, fields, files) {
            console.log(fields);
                      if(err){
                          res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode:400,
                            response: ''
                          });
                          return;
                         }  else{
                        var id = req.params.id;
                       Faq.findOne({ _id: ObjectId(id) }).exec(function(err, result) {    
                              if (err) {
                                 res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode:400,
                                        response: err
                                      });
                                 return;
                               } else{
                                  
                                  res.json({
                                        status: 1,
                                        message: 'successfully',
                                        statuscode:200,
                                        response: result
                                  });
                               }
                              
                            });
               }
          })
 
}
//HowItWorks 
const how_it_works = (req,res)=>{  
  HowItWorks.findOne({}, function(err, result) {
    if(err){
      res.json({
        status: 0,
        message: 'Something went wrong.',
        statuscode:400,
        response: ''
      });
      return;
    }
    if(!result){
      res.json({
        status: 0,
        message: 'data not found.',
        statuscode:400,
        response: ''
      });
      return;
    }else{
      result=JSON.stringify(result);
      result=JSON.parse(result);         
      res.json({
          status: 1,
          message: 'successfully',
          statuscode:200,
          response: result
        });
      return;
    }
  })
}


// Update How it works
const how_it_works_update = function(req,res){  
  var form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {  
  HowItWorks.findOne({_id:ObjectId(fields.id)}, async function(err, result) {
              if(err){

                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
              }             
              if(!result){
               let updateObject = new HowItWorks();                
                updateObject.title=fields.title;
                updateObject.title_description=fields.title_description;
                updateObject.description1=fields.description1;
                updateObject.description2=fields.description2;
                updateObject.save().then( about => {                       
                    res.json({
                        status: 1,
                        message: 'Page updated successfully.',
                        statuscode:200,
                        response: about

                      });
                    return;
                  }).catch(err=>{
                    res.json({
                        status: 0,
                        message: 'Page not updated successfully.',
                        statuscode:400,
                        response: err
                      });
                    return;
                  });
  
               } 
               else{
                let updateObject = {}; 
                updateObject.title=fields.title;
                updateObject.title_description=fields.title_description;
                updateObject.description1=fields.description1;
                updateObject.description2=fields.description2;
                HowItWorks.findOneAndUpdate({_id:ObjectId(fields.id)},updateObject, function(err2, about) {
                    if (err2){
                      res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode:400,
                        response: ''
                      });
                      return;
                    }
                    //console.log(user);
                    if(about){
                     res.json({
                          status: 1,
                          message: 'Page updated successfully.',
                          statuscode:200,
                          response: about
                        });
                      return;
                    }
                    else{
                      res.json({
                          status: 0,
                          message: 'Page not updated successfully.',
                          statuscode:400,
                          response: about
                        });
                    }
                  });
          }
        //})
  })
})
}

module.exports = {  
  about_update,
  about_index,
  contact_index,
  contact_update,
  faq_index,
  faq_create,
  faq_update,
  faq_delete,
  faq_view,
  how_it_works,
  how_it_works_update
 }