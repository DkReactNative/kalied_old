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

      console.log(result);
     /* console.log(result);
      let global_settings = {}
      result.map( (value) => {
        global_settings[value.slug] = value.value
      })
      global_settings["today_date"] = new Date().toLocaleDateString("en");*/
      res.json({
        status: 1,
        message: 'Success',
        statuscode:200,
        response: result
      });
    }
  });
}


const update = function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, (err,fields,files)=> {

    if(err){

      res.json({
        status: 0,
        message: 'Something went wrong',
        statuscode:400,
        response: ''
      });
    }
    if(fields){

      console.log(fields);
      res.json({
        status: 1,
        message: 'Success',
        statuscode:200,
        response: fields
      });
    }
  })
}

/*router.post("/update_global_settings",function(req,res){
  var form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    if(fields){
      Object.entries(fields).map( (value,index) => {
        let slug    =   value[0];
        let title   =   slug.replace("_"," ").replace(/\b\w/g, l => l.toUpperCase());
        let valuee  =   value[1];
        GlobalSettings.findOne({ slug: slug }, function(error, result) {
          if (!error) {
            if (!result) { result = new GlobalSettings(); }
            result.title  =  title;
            result.slug   =  slug;
            result.value  =  (valuee) ? valuee : "";
            result.save(function(error) { if (error) throw error; });
          }
        });
      })
    }
    var response = { status: 1, message: 'Global Settings updated successfully', response: {} }
    res.send(response);
  });
})*/

module.exports = {	
  list,
  update
 }

