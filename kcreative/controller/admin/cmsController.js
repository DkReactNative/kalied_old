const CmsModel = require('./../../model/cmsModel');
const formidable = require('formidable');
const niv = require('node-input-validator');
const adminHelper = require('./../../helper/adminHelper');
const { Validator } = niv;

const index = function(req, res) {
    console.log("req.user", req.user);
    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields) {
        // console.log('fields');
        console.log(fields);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode: 400,
                response: ''
            });
        }

        //set filter conditions
        var search = fields.searchForm;
        var filter = {};
        if (fields.searchForm && fields.searchForm != '' && fields.searchForm != undefined) {
            filter = {
                $or: [

                    { 'content': { $regex: search, $options: 'i' } },
                    { 'title': { $regex: search, $options: 'i' } }
                ]

            };
        }

        //set pagination logic
        var perPage = 5;
        var pageNumber = 1;
        if (fields.page) {

            pageNumber = fields.page;
        }
        var skipRecords = (pageNumber - 1) * perPage;
        CmsModel.find(filter).countDocuments((err, count) => {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
            }
            CmsModel.find(filter).skip(skipRecords).limit(perPage).sort({ _id: -1 }).exec(function(err, result) {
                if (err) {

                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode: 400,
                        response: ''
                    });
                } else {

                    response = {
                        totalCount: count,
                        perPage: perPage,
                        totalPages: Math.ceil(count / perPage),
                        currentPage: pageNumber

                    };

                    if (result.length != 0) {

                        response.records = result;
                    }

                    res.json({
                        status: 1,
                        message: '',
                        statuscode: 200,
                        response: response
                    });

                }
            });
        })
    });

}

const add = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode: 400,
                response: ''
            });
            return;
        }

        const v = new Validator(fields, {
            title: 'required|unique:CmsPages,title',
            content: 'required'
        });

        //title: 'required|unique:EmailTemplates,title',

        await v.check().then(function(matched) {
                if (!matched) {
                    var errors = [];
                    if ("title" in v.errors) { errors.push({ "title": v.errors.title.message }); }
                    if ("content" in v.errors) { errors.push({ "content": v.errors.content.message }); }
                    var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                    res.send(response);
                    // res.json({
                    //     status: 0,
                    //     message: 'Bad request.',
                    //     statuscode:400,
                    //     response: errors
                    //   });
                } else {
                    var slug = adminHelper.slugify(fields.title);
                    var record = new CmsModel({
                        title: fields.title,
                        content: fields.content,
                        slug: slug
                    });
                    record.save(function(err1) {
                        if (err1) {

                            res.json({
                                status: 0,
                                message: 'Something went wrong',
                                statuscode: 400,
                                response: ''
                            });
                        } else {

                            res.json({
                                status: 1,
                                message: 'Cms page created successfully.',
                                statuscode: 200,
                                response: ''
                            });
                        }
                    });
                }
            })
            .catch(function(e) {
                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
            });
    });
}

const view = function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields) {
        CmsModel.findOne({ _id: fields.id }, function(err, result) {
            if (err) {

                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
            }
            if (!result) {
                res.json({
                    status: 0,
                    message: 'Cms page not found.',
                    statuscode: 400,
                    response: ''
                });
            } else {
                res.json({
                    status: 1,
                    message: '',
                    statuscode: 200,
                    response: result
                });
            }
        });
    });
}


const destroy = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields) {
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode: 400,
                response: ''
            });

        }
        CmsModel.findOne({ _id: fields.id }, function(err, result) {
            if (err) {

                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
            }
            if (!result) {
                res.json({
                    status: 0,
                    message: 'Cms page not found.',
                    statuscode: 400,
                    response: ''
                });
            } else {
                CmsModel.remove({ _id: fields.id }, (err) => {

                    if (err) {

                        res.json({
                            status: 0,
                            message: 'Cms page not deleted.',
                            statuscode: 400,
                            response: ''
                        });
                    } else {

                        res.json({
                            status: 1,
                            message: 'Cms page deleted successfully.',
                            statuscode: 200,
                            response: ''
                        });
                    }
                });

            }
        });
    });
}

const update = function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {

        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode: 400,
                response: ''
            });
            //return;
        }

        const v = new Validator(fields, {
            title: 'required|unique:CmsPages,title,' + fields.id,
            content: 'required'
        });

        //title: 'required|unique:EmailTemplates,title',

        await v.check().then(function(matched) {
            if (!matched) {
                var errors = [];
                if ("title" in v.errors) { errors.push({ "title": v.errors.title.message }); }
                if ("content" in v.errors) { errors.push({ "content": v.errors.content.message }); }
                var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                res.send(response);
                // res.json({
                //     status: 0,
                //     message: 'Bad request.',
                //     statuscode:400,
                //     response: errors
                //   });
            } else {

                CmsModel.findOne({ _id: fields.id }, function(err, result) {
                    if (err) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                    }
                    if (result) {
                        result.title = fields.title;
                        result.content = fields.content;
                        result.subject = fields.subject;
                        result.save(function(err, result) {

                            if (err) {

                                res.json({
                                    status: 0,
                                    message: 'Something went wrong',
                                    statuscode: 400,
                                    response: ''
                                });
                            } else {

                                res.json({
                                    status: 1,
                                    message: 'Cms page updated successfully.',
                                    statuscode: 200,
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



const change_status = function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields) {

        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode: 400,
                response: ''
            });
        }
        CmsModel.findOne({ _id: fields.id }, function(err, result) {
            if (err) {

                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
            }

            if (!result) {
                res.json({
                    status: 0,
                    message: 'Cms page not found.',
                    statuscode: 400,
                    response: ''
                });
            } else {
                result.status = fields.status;
                result.save(function(err, user) {
                    if (err) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                    } else {
                        res.json({
                            status: 1,
                            message: 'Cms page status updated successfully.',
                            statuscode: 200,
                            response: ''
                        });
                    }
                })
            }
        });
    });

}
module.exports = {
    index,
    add,
    view,
    update,
    destroy,
    change_status
}