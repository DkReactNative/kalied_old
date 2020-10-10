var GlobalSettings = require('./../../model/globalSettings');
var formidable = require('formidable');

const list = function(req, res){

  GlobalSettings.find({}, function(error, result) {
    if (error){

      res.json({
        status: 0,
        message: 'Something went wrong',
        statuscode:400,
        response: error
      });
    }else{

      let global_settings = {}
      result.map( (value) => {
        global_settings[value.slug] = value.value
      })
      global_settings["today_date"] = new Date().toLocaleDateString("en");
      res.json({
        status: 1,
        message: 'Success',
        statuscode:200,
        response: global_settings
      });
    }
  });
}

const update = function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, (err,fields, files)=> {

    if(err){

      res.json({
        status: 0,
        message: 'Something went wrong',
        statuscode:400,
        response: error
      });
      return;
    }
    if(!fields){

      res.json({
        status: 0,
        message: 'Bad request.',
        statuscode:400,
        response: error
      });
      return;
    }
    else{
       Object.entries(fields).map( (value,index) => {

          let slug    =   value[0];
          let title   =   slug.replace("_"," ").replace(/\b\w/g, l => l.toUpperCase());
          let valuee  =   value[1];
          GlobalSettings.findOne({slug:slug},(err,result)=> {
            console.log(result);
            if(result){
              result.title = title;
              result.value = (valuee) ? valuee : ""
              result.save((err1) => {

                if(err1){

                  res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode:400,
                    response: ''
                  });
                }
              });
            }
          });
          
       });

       res.json({
          status: 1,
          message: 'Success',
          statuscode:200,
          response: 'Global Settings updated successfully.'
        });
    }
  })
}

const create = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, (err,fields, files)=> {

    if(err){

      res.json({
        status: 0,
        message: 'Something went wrong',
        statuscode:400,
        response: error
      });
      return;
    }
    if(!fields){

      res.json({
        status: 0,
        message: 'Bad request.',
        statuscode:400,
        response: error
      });
      return;
    }
    else{

      var record = new GlobalSettings();
               let slug    =   fields.slug;
               let title   =   slug.replace(/_/g," ").replace(/\b\w/g, l => l.toUpperCase());
               let valuee  =    fields.value;
               record.slug =slug;
               record.title =title;
                record.value = valuee;
                    
                 record.save(function(err1) {
                        if (err1) {

                            res.json({
                                status: 0,
                                message: 'Something went wrong',
                                statuscode: 400,
                                response: err1
                            });
                        } else {
                           res.json({
                                       status: 1,
                                        message: 'Record inserted',
                                        statuscode: 400,
                                        response: record
                                        });
                                    }
                                  })
                            }
      });
}


module.exports = {	
  list,
  update,
  create
 }

