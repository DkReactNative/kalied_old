const CmsModel = require("./../../model/cmsModel");
const formidable = require("formidable");
const niv = require("node-input-validator");
const adminHelper = require("./../../helper/adminHelper");
const { Validator } = niv;

console.log("controller");

const index = function (req, res) {
  console.log("req.user", req.user);
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    // console.log('fields');
    console.log(fields);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
      return;
    }
    var slug = fields.slug;
    CmsModel.find({ $and: [{ status: 1 }, { slug: slug }] }, (err, data) => {
      if (err) {
        res.json({
          status: 0,
          message: "data not found",
          statuscode: 400,
          response: "",
        });
      } else {
        res.json({
          status: 1,
          message: "Sucess",
          statuscode: 200,
          response: data,
        });
      }
    });
  });
};
module.exports = {
  index,
};
