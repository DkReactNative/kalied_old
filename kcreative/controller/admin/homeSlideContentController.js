
var CreativePro = require('./../../model/creativeFrofessionalsModel');
var TopTier = require('./../../model/topTierClientModel');
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

const creative_index =(req,res)=>{
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
              CreativePro.find(json)    
                .limit(perPage)
                .skip(perPage * page - perPage)
                .exec(function(err, result) {
                  CreativePro.find()
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
                        result = result.map(ele=>{
                            ele.image=ele.image ?appConfig.uploadUrl+'creatice-professions/'+ele.image:"";
                            return ele
                        })
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
const creative_create =(req,res)=>{
  var form = new formidable.IncomingForm();
  form.uploadDir=__dirname + '/../../public/uploads/creatice-professions/';
  form.parse(req, async function(err, fields, files) {
    console.log(fields,files);
              if(err){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
                 } 
                const { name, about,comment,profession } = fields;
                let imageName = "";
              if(files.image && files.image.name){
                   imageName = new Date().getTime() + files.image.name.replace(" ","-");
                    var oldpath = files.image.path;
                    var newpath = __dirname + '/../../public/uploads/creatice-professions/' + imageName;
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
               let updateObject = new CreativePro();
               updateObject.image = imageName;
               updateObject.name = name;
               updateObject.about = about;
               updateObject.comment = comment
               updateObject.profession = profession
               updateObject.save().then(result => {
                  res.json({
                        status: 1,
                        message: 'created successfully',
                        statuscode:200,
                        response: result
                      });
                  return;
                }).catch(err=>{
                   res.json({
                        status: 0,
                        message: 'not created',
                        statuscode:400,
                        response: err
                      });
                  return;
                });
              
           
  })
}
const creative_update =(req,res)=>{
   var form = new formidable.IncomingForm();
   form.uploadDir=__dirname + '/../../public/uploads/creatice-professions/';
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
                 const { name, about,comment,profession } = fields;
                let imageName = "";
              if(files.image && files.image.name){
                   imageName = new Date().getTime() + files.image.name.replace(" ","-");
                    var oldpath = files.image.path;
                    var newpath = __dirname + '/../../public/uploads/creatice-professions/' + imageName;
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
          
             CreativePro.findOne({_id:ObjectId(fields.id)}, async function(err1, result) {
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
                res.json({
                    status: 0,
                    message: 'record does not exist',
                    statuscode:400,
                    response: ''
                  });
                  return;
              } else{

                let updateObject = {};
                 if(imageName.length != 0 && result.image)
                {
                  updateObject.image = imageName;
                  var old_image = __dirname + '/../../public/uploads/creatice-professions/' +result.image;
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
               updateObject.image = imageName.length != 0?imageName:result.image;
               updateObject.name = name;
               updateObject.about = about;
               updateObject.comment = comment
               updateObject.profession = profession
                CreativePro.findOneAndUpdate({_id:ObjectId(fields.id)},updateObject, function(err2, about) {
                    if (err2){
                      res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode:400,
                        response: err2
                      });
                      return;
                    }
                    //console.log(user);
                    if(about){
                      about.image = (imageName.length != 0)? appConfig.uploadUrl+'creatice-professions/'+imageName:appConfig.uploadUrl+'creatice-professions/'+about.image;
                      res.json({
                          status: 1,
                          message: 'updated successfully.',
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
    }
  })
}
const creative_delete =(req,res)=>{
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
                      CreativePro.remove(
                        {
                          _id: ObjectId(id)
                        },
                        function(err, result) {
                          if (err) {
                           res.json({
                              status: 0,
                              message: 'Record not deleted successfully',
                              statuscode:400,
                              response: err
                            });
                            
                          } else {
                             res.json({
                              status: 1,
                              message: 'Record deleted successfully',
                              statuscode:200,
                              response: result
                            });

                          }
                        }
                      );
             }
        })
}

const creative_view =(req,res)=>{
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
                       CreativePro.findOne({ _id: ObjectId(id) }).exec(function(err, result) {    
                              if (err) {
                                 res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode:400,
                                        response: err
                                      });
                                 return;
                               } else if(result){
                                 result.image = result.image ?appConfig.uploadUrl+'creatice-professions/'+result.image:"";
                                  res.json({
                                        status: 1,
                                        message: 'successfully',
                                        statuscode:200,
                                        response: result
                                  });
                               }else{
                                  res.json({
                                        status: 0,
                                        message: 'no record found',
                                        statuscode:400,
                                        response: result
                                  });
                               }
                              
                            });
               }
          })
}

const toptier_index =(req,res)=>{
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
              TopTier.find(json)    
                .limit(perPage)
                .skip(perPage * page - perPage)
                .exec(function(err, result) {
                  TopTier.find()
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
                        result = result.map(ele=>{
                            ele.image=ele.image ?appConfig.uploadUrl+'top-tier-client/'+ele.image:"";
                            return ele
                        })
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
const toptier_create =(req,res)=>{
  var form = new formidable.IncomingForm();
  form.uploadDir=__dirname + '/../../public/uploads/top-tier-client/';
  form.parse(req, async function(err, fields, files) {
    console.log(fields,files);
              if(err){
                  res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode:400,
                    response: ''
                  });
                  return;
                 } 
                const { name, company,profession,about } = fields;
                let imageName = "";
              if(files.image && files.image.name){
                   imageName = new Date().getTime() + files.image.name.replace(" ","-");
                    var oldpath = files.image.path;
                    var newpath = __dirname + '/../../public/uploads/top-tier-client/' + imageName;
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
               let updateObject = new TopTier();
               updateObject.image = imageName;
               updateObject.name = name;
               updateObject.company = company;
               updateObject.about = about
               updateObject.profession = profession
               updateObject.save().then(result => {
                  res.json({
                        status: 1,
                        message: 'created successfully',
                        statuscode:200,
                        response: result
                      });
                  return;
                }).catch(err=>{
                   res.json({
                        status: 0,
                        message: 'not created',
                        statuscode:400,
                        response: err
                      });
                  return;
                });
              
           
  })
}
const  toptier_update =(req,res)=>{
   var form = new formidable.IncomingForm();
   form.uploadDir=__dirname + '/../../public/uploads/top-tier-client/';
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
                 const { name, company,profession,about } = fields;
                let imageName = "";
              if(files.image && files.image.name){
                   imageName = new Date().getTime() + files.image.name.replace(" ","-");
                    var oldpath = files.image.path;
                    var newpath = __dirname + '/../../public/uploads/top-tier-client/' + imageName;
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
          
             TopTier.findOne({_id:ObjectId(fields.id)}, async function(err1, result) {
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
                res.json({
                    status: 0,
                    message: 'record does not exist',
                    statuscode:400,
                    response: ''
                  });
                  return;
              } else{

                let updateObject = {};
                 if(imageName.length != 0 && result.image)
                {
                  updateObject.image = imageName;
                  var old_image = __dirname + '/../../public/uploads/creatice-professions/' +result.image;
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
               updateObject.image = imageName.length != 0?imageName:result.image;
               updateObject.name = name;
               updateObject.company = company;
               updateObject.about = about
               updateObject.profession = profession
                TopTier.findOneAndUpdate({_id:ObjectId(fields.id)},updateObject, function(err2, about) {
                    if (err2){
                      res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode:400,
                        response: err2
                      });
                      return;
                    }
                    //console.log(user);
                    if(about){
                      about.image = (imageName.length != 0)? appConfig.uploadUrl+'/top-tier-client/'+imageName:appConfig.uploadUrl+'creatice-professions/'+about.image;
                      res.json({
                          status: 1,
                          message: 'updated successfully.',
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
    }
  })
}
const toptier_delete =(req,res)=>{
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
                      TopTier.remove(
                        {
                          _id: ObjectId(id)
                        },
                        function(err, result) {
                          if (err) {
                           res.json({
                              status: 0,
                              message: 'Record not deleted successfully',
                              statuscode:400,
                              response: err
                            });
                            
                          } else {
                             res.json({
                              status: 1,
                              message: 'Record deleted successfully',
                              statuscode:200,
                              response: result
                            });

                          }
                        }
                      );
             }
        })
}

const toptier_view =(req,res)=>{
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
                       TopTier.findOne({ _id: ObjectId(id) }).exec(function(err, result) {    
                              if (err) {
                                 res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode:400,
                                        response: err
                                      });
                                 return;
                               } else if(result){
                                 result.image = result.image ?appConfig.uploadUrl+'top-tier-client/'+result.image:"";
                                  res.json({
                                        status: 1,
                                        message: 'successfully',
                                        statuscode:200,
                                        response: result
                                  });
                               }else{
                                  res.json({
                                        status: 0,
                                        message: 'no record found',
                                        statuscode:400,
                                        response: result
                                  });
                               }
                              
                            });
               }
          })
}

module.exports = {  
  creative_index,
  creative_create,
  creative_update,
  creative_delete,
  creative_view,
  toptier_index,
  toptier_create,
  toptier_update,
  toptier_delete,
  toptier_view
 }