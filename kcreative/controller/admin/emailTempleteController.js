const email_templete = require('./../../model/emailTempleteModel');
const formidable = require('formidable');
const adminHelper = require('./../../helper/adminHelper');
const niv = require('node-input-validator');
const { Validator } = niv;
const slugify = require('slugify');

const index = function(req, res){
  //adminHelper.slugify('njnfdnk ewjej&*___','dfdfds');
  
 
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        
        if(err){
            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode:400,
                response: ''
            });
        }

        //set filter conditions
        var search  = fields.searchForm;
        var filter = {};
        if(fields.searchForm && fields.searchForm != '' && fields.searchForm != undefined){
            filter = {
                $or:[

                       {'content': {$regex: search, $options: 'i'}},
                       {'title': {$regex: search, $options: 'i'}}
                    ]
                
            };
        }
        //set pagination logic
        var perPage = 5;
        var pageNumber = 1;
        if(fields.page){

            pageNumber = fields.page;
        }
        var skipRecords = (pageNumber - 1)* perPage;        
        email_templete.find(filter).countDocuments((err, count) => {
            if(err)
            {
                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode:400,
                    response: ''
                });
            }
            email_templete.find(filter).skip(skipRecords).limit(perPage).sort({_id:-1}).exec(function(err,result){
                if(err){

                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode:400,
                        response: ''
                    });
                }
                else{

                    response = {
                        totalCount :count,
                        perPage : perPage,
                        totalPages : Math.ceil(count / perPage),
                        currentPage: pageNumber

                    };

                    if(result.length != 0){

                       response.records = result; 
                    }

                    res.json({
                        status: 1,
                        message: 'All email templates retrieved successfully',
                        statuscode:200,
                        response: response
                    });

                }            
            });  
        })
    });
    
}

const add = function(req, res)
{
    var form = new formidable.IncomingForm();
    form.parse(req,async (err,fields,files)=>{      
        if(err){

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode:400,
                response: ''
              });
            return;
        }

        const v = new Validator(fields, {
          //title: 'required',
          title: 'required|unique:EmailTemplates,title',
          subject:'required',
          content: 'required'
        });

        //title: 'required|unique:EmailTemplates,title',

        await v.check().then(function (matched) {
          if (!matched) {        
            var errors = [];
            if ("title" in v.errors) { errors.push({ "title": v.errors.title.message }); }
            if ("subject" in v.errors) { errors.push({ "subject": v.errors.subject.message }); }
            if ("content" in v.errors) { errors.push({ "content": v.errors.content.message }); }
            var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
            res.send(response);
            // res.json({
            //     status: 0,
            //     message: 'Bad request.',
            //     statuscode:400,
            //     response: response
            //   });
          } 
          else {

            /*var slug = slugify(fields.title, {
              replacement: '-',  // replace spaces with replacement character, defaults to `-`
              remove: /[*+~.()'"!:@\{}%^$_/`#]/g, // remove characters that match regex, defaults to `undefined`
              lower: true,      // convert to lower case, defaults to `false`
              strict: true,     // strip special characters except replacement, defaults to `false`
            });*/

            var slug  = adminHelper.slugify(fields.title);           

            var record = new email_templete({
              title: fields.title,
              subject: fields.subject,
              content: fields.content,
              slug : slug
            });
            record.save(function (err1) {          
                if(err1){
                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode:400,
                        response: ''
                      });
                }
                else{
                   res.json({
                        status: 1,
                        message: 'Email template created successfully.',
                        statuscode:200,
                        response: ''
                      }); 
                }
            });
          }
        })
        .catch(function (e) {
          
          res.json({
            status: 0,
            message: 'Something went wrong',
            statuscode:400,
            response: ''
          });
        });
    });
}

const view = function(req, res){

   var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        email_templete.findOne({ _id: fields.id}, function (err, result) {
            if (err){

                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode:400,
                    response: ''
                  });
            }
            if (!result) {
                res.json({
                    status: 0,
                    message: 'Email template not found.',
                    statuscode:400,
                    response: ''
                  });
            }
            else 
            {
               res.json({
                    status: 1,
                    message: '',
                    statuscode:200,
                    response: result
                  });
            }
        });
    });
}


const deleteTemplate = function(req, res){
      var form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields) {
        if(err){

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode:400,
                response: ''
              });

        }
        email_templete.findOne({ _id: fields.id }, function (err, result) {
          if (err){

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode:400,
                response: ''
              });
          }
          if (!result) {
            res.json({
                status: 0,
                message: 'Email template not found.',
                statuscode:400,
                response: ''
              });
          }
          else 
          {
            email_templete.remove({_id:fields.id},(err) => {

                if(err){

                    res.json({
                        status: 0,
                        message: 'Email template not deleted.',
                        statuscode:400,
                        response: ''
                      });  
                }
                else{

                    res.json({
                        status: 1,
                        message: 'Email template deleted successfully.',
                        statuscode:200,
                        response: ''
                      }); 
                }
            });
            
          }
        });
      });
}

const update = function(req, res){

    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {      
       if(err){

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode:400,
                response: ''
              });
            //return;
        }

        const v = new Validator(fields, {
          //title: 'required',
          title: 'required|unique:EmailTemplates,title,' + fields.id,
          subject:'required',
          content: 'required'
        });

        //title: 'required|unique:EmailTemplates,title',

        await v.check().then(function (matched) {
          if (!matched) {        
            var errors = [];
            if ("title" in v.errors) { errors.push({ "title": v.errors.title.message }); }
            if ("subject" in v.errors) { errors.push({ "subject": v.errors.subject.message }); }
            if ("content" in v.errors) { errors.push({ "content": v.errors.content.message }); }
            var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
            res.send(response);
            // res.json({
            //     status: 0,
            //     message: 'Bad request.',
            //     statuscode:400,
            //     response: errors
            //   });
          } 
          else {
                email_templete.findOne({ _id: fields.id }, function (err, result) {
                  if (err){

                     res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode:400,
                        response: ''
                      });
                  }
                  if(result){
                      result.title = fields.title;
                      result.content = fields.content;
                      result.subject = fields.subject;
                      result.save(function (err, result) {

                        if (err){

                            res.json({
                                status: 0,
                                message: 'Something went wrong',
                                statuscode:400,
                                response: ''
                            });
                        }
                        else{

                            res.json({
                                status: 1,
                                message: 'Email templete updated successfully.',
                                statuscode:200,
                                response: ''
                            });
                        }
                      })
                  }
                });
            } 
        });
    });
}



const change_status = function(req, res){

    var form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields) {
        if (err){

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode:400,
                response: ''
              });
          }
        email_templete.findOne({ _id: fields.id }, function (err, result) {
            if (err){

                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode:400,
                    response: ''
                });
            }
          
          if (!result) 
          {
            res.json({
                status: 0,
                message: 'Email templete not found.',
                statuscode:400,
                response: ''
            });
          }
          else
          {
            result.status = fields.status;
            result.save(function (err, user) {
                if (err){

                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode:400,
                        response: ''
                    });
                }
                else
                {
                    res.json({
                        status: 1,
                        message: 'Email templete status updated successfully.',
                        statuscode:200,
                        response: ''
                    });
                }
            })
          }
        });
      });

}
module.exports={
    index,
    add,
    view,
    update,
    deleteTemplate,
    change_status
}