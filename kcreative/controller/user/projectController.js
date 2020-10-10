const User = require('./../../model/usersModel');
const Skills = require('./../../model/skills&AwardModel');
const Project = require('./../../model/projectDetailModel');
const ProjectCandidate = require('./../../model/projectCandidateModel');
const FavourateUser = require("./../../model/favourateUserModel");
const Emailtemplates = require("./../../model/emailTempleteModel");
const bcrypt = require('bcryptjs');
const adminHelper = require("./../../helper/adminHelper");
const isValidId = require("./../../helper/validObjectId");
const jwt = require("jsonwebtoken");
const appConfig = require('./../../config/app');
const mongoose = require('mongoose');
const formidable = require('formidable');
const mailSend = require('./../../helper/mailer');
const { base64encode, base64decode } = require('nodejs-base64');
const ObjectId = mongoose.Types.ObjectId;
const niv = require('node-input-validator');
const { Validator } = niv;
const fs = require('fs');
//const ISODate = mongoose.Types.ISODate;
const moment = require("moment");
const _ = require('lodash');
const { concatSeries, reject } = require('async');
const { resolve } = require('path');
const projectCandidateModel = require('./../../model/projectCandidateModel');

const index = function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong',
                statuscode: 400,
                response: ''
            });
            return;
        }
        else {
            let isValidid = isValidId(req.params.id)
            if (!isValidid) {
                res.json({
                    status: 0,
                    message: 'Wrong project detail provided',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            Project.aggregate([
                { $match: { _id: ObjectId(req.params.id), status: { $ne: 0 } } },
                {
                    $lookup: {
                        from: "primaryskills",
                        let: { skills: "$skills" },
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        { $expr: { $in: ["$_id", "$$skills"] } }]
                                },
                            },
                        ],
                        as: "skills",
                    }
                },
                {
                    $lookup: {
                        from: "projecttypes",
                        let: { project_type: "$project_type" },
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        { $expr: { $eq: ["$_id", "$$project_type"] } }]
                                },
                            },
                        ],
                        as: "project_type",
                    }
                },
                {
                    $lookup: {
                        from: "generetypes",
                        let: { project_type: "$project_type", genere: "$genere" },
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        { $expr: { $in: ["$_id", "$$genere"] } },
                                    ]
                                },
                            },
                        ],
                        as: "genere",
                    }
                },
                {
                    $lookup: {
                        from: "industrytypes",
                        let: { project_type: "$project_type", industry: "$industry" },
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        { $expr: { $in: ["$_id", "$$industry"] } },
                                    ]
                                },
                            },
                        ],
                        as: "industry",
                    }
                },
            ], (err, data) => {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode: 400,
                        response: ''
                    });
                } else if (data) {
                    data = JSON.parse(JSON.stringify(data))
                    data = data[0] ? data[0] : {}
                    if (data.location) {
                        data.latitude = data.location.coordinates.latitude;
                        data.longitude = data.location.coordinates.longitude;
                    }
                    data.image_pdf_path = appConfig.uploadUrl + "project/"
                    data.project_type = data.project_type && data.project_type[0] ? data.project_type[0] : {}
                    res.json(
                        {
                            status: 1,
                            message: 'Success',
                            statuscode: 200,
                            response: data
                        }
                    );
                } else {
                    res.json({
                        status: 0,
                        message: 'Project data not found',
                        statuscode: 400,
                        response: ''
                    });
                }
            }
            );
        }
    })
};

const Step1update = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        var v = new Validator();
        v = new Validator(fields, {
            //user_id: 'required',
            title: 'required',
            description: 'required',
            skills: 'required',
            style: 'required',
            background: 'required',
        });
        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];
                // if ("user_id" in v.errors) {
                //     errors.push({
                //         "user_id": v.errors.user_id.message
                //     });
                // }
                if ("title" in v.errors) {
                    errors.push({
                        "title": v.errors.title.message
                    });
                }
                if ("description" in v.errors) {
                    errors.push({
                        "description": v.errors.description.message
                    });
                }
                if ("skills" in v.errors) {
                    errors.push({
                        "skills": v.errors.skills.message
                    });
                }
                if ("style" in v.errors) {
                    errors.push({
                        "style": v.errors.style.message
                    });
                }
                if ("background" in v.errors) {
                    errors.push({
                        "background": v.errors.background.message
                    });
                }
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
            } else {
                let isValidUser = isValidId(req.user._id)
                if (!isValidUser) {
                    res.json({
                        status: 0,
                        message: 'Wrong user detail provided',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                User.findOne({
                    _id: ObjectId(req.user._id),
                    status: 1,
                    role: 2
                }, async function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    else if (!result) {

                        res.json({
                            status: 0,
                            message: 'User not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else {
                        if (fields.project_id && fields.project_id != "null") {
                            let isValid = isValidId(fields.project_id)
                            if (!isValid && fields.project_id) {
                                res.json({
                                    status: 0,
                                    message: 'Wrong project detail provided',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                            Project.findOne({
                                _id: ObjectId(fields.project_id),
                                user_id: ObjectId(req.user._id)
                            }, function (err, detail) {
                                if (err) {
                                    res.json({
                                        status: 0,
                                        message: 'Something went wrong',
                                        statuscode: 400,
                                        response: ''
                                    });
                                    return;
                                } else if (detail) {
                                    detail.title = fields.title;
                                    detail.description = fields.description;
                                    let skills = fields.skills ? JSON.parse(fields.skills) : [];
                                    detail.skills = skills.map(ele => ObjectId(ele))
                                    detail.user_id = ObjectId(req.user._id);
                                    detail.style = fields.style;
                                    detail.background = fields.background;
                                    detail.current_step = detail.current_step == 1 ? 2 : detail.current_step;
                                    detail.save(function (err, data) {
                                        if (err) {
                                            res.json({
                                                status: 0,
                                                message: 'Something went wrong',
                                                statuscode: 400,
                                                response: ''
                                            });
                                            return;
                                        } else {
                                            res.json({
                                                status: 1,
                                                message: 'Project detail updated succesfully',
                                                statuscode: 200,
                                                response: data
                                            });
                                            return;
                                        }
                                    });
                                } else {
                                    res.json({
                                        status: 0,
                                        message: 'No data found',
                                        statuscode: 400,
                                        response: ''
                                    });
                                    return;

                                }
                            });
                        } else {
                            let detail = new Project()
                            detail.title = fields.title;
                            detail.description = fields.description;
                            let skills = fields.skills ? JSON.parse(fields.skills) : [];
                            detail.skills = skills.map(ele => ObjectId(ele))
                            detail.user_id = ObjectId(req.user._id);
                            detail.style = fields.style;
                            detail.background = fields.background;
                            detail.current_step = 2;
                            detail.save(function (err, data) {
                                if (err) {
                                    res.json({
                                        status: 0,
                                        message: 'Something went wrong',
                                        statuscode: 400,
                                        response: ''
                                    });
                                    return;
                                } else {
                                    res.json({
                                        status: 1,
                                        message: 'Project detail updated succesfully',
                                        statuscode: 200,
                                        response: data
                                    });
                                    return;
                                }
                            });
                        }
                    }
                });
            }
        })
    })
}

const Step2update = function (req, res) {
    var form = new formidable.IncomingForm({
        multiples: true
    });

    form.uploadDir = __dirname + '/../../public/uploads/project/';
    form.parse(req, async function (err, fields, files) {
        var v = new Validator();
        v = new Validator(fields, {
            // user_id: 'required',
            project_id: 'required',
        });
        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];
                // if ("user_id" in v.errors) {
                //     errors.push({
                //         "user_id": v.errors.user_id.message
                //     });
                // }
                if ("project_id" in v.errors) {
                    errors.push({
                        "project_id": v.errors.project_id.message
                    });
                }
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
            } else {
                let isValidUser = isValidId(req.user._id)
                if (!isValidUser) {
                    res.json({
                        status: 0,
                        message: 'Wrong user detail provided',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                User.findOne({
                    _id: ObjectId(req.user._id),
                    status: 1,
                    role: 2
                }, async function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    else if (!result) {

                        res.json({
                            status: 0,
                            message: 'User not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else {
                        let isValid = isValidId(fields.project_id)
                        if (!isValid) {
                            res.json({
                                status: 0,
                                message: 'Wrong project detail provided',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        }
                        Project.findOne({
                            _id: ObjectId(fields.project_id),
                            user_id: ObjectId(req.user._id)
                        }, function (err, detail) {
                            if (err) {
                                res.json({
                                    status: 0,
                                    message: 'Something went wrong',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            } else if (detail) {
                                let imagesNames = []
                                let inputImages = Array.isArray(files.image) ? files.image : [files.image]
                                if (inputImages && files.image) {
                                    inputImages.forEach(file => {
                                        if (file.name) {
                                            let fileName = new Date().getTime() + file.name.replace(" ", "-");
                                            var oldpath = file.path;
                                            var newpath = __dirname + '/../../public/uploads/project/' + fileName;
                                            if (!fs.existsSync(__dirname + '/../../public/uploads/project')) {
                                                fs.mkdirSync('../../public/uploads/project');
                                            }
                                            imagesNames.push(fileName);
                                            fs.rename(oldpath, newpath, function (err) {
                                                if (err) {
                                                    res.json({
                                                        status: 0,
                                                        message: 'Something went wrong.',
                                                        statuscode: 400,
                                                        response: ''
                                                    });
                                                    return;
                                                }
                                            });
                                        }
                                    })

                                }

                                let pdfsNames = []
                                let inputPdf = Array.isArray(files.pdf) ? files.pdf : [files.pdf]
                                if (inputPdf && files.pdf) {
                                    inputPdf.forEach(file => {
                                        if (file.name) {
                                            let fileName = new Date().getTime() + file.name.replace(" ", "-");
                                            var oldpath = file.path;
                                            var newpath = __dirname + '/../../public/uploads/project/' + fileName;
                                            if (!fs.existsSync(__dirname + '/../../public/uploads/project')) {
                                                fs.mkdirSync('../../public/uploads/project');
                                            }
                                            pdfsNames.push(fileName);
                                            fs.rename(oldpath, newpath, function (err) {
                                                if (err) {
                                                    res.json({
                                                        status: 0,
                                                        message: 'Something went wrong.',
                                                        statuscode: 400,
                                                        response: ''
                                                    });
                                                    return;
                                                }
                                            });
                                        }
                                    })
                                }

                                if (fields.removedImage && JSON.parse(fields.removedImage).length != 0) {
                                    JSON.parse(fields.removedImage).forEach(ele => {
                                        var old_image = __dirname + '/../../public/uploads/project/' + ele;
                                        try {
                                            if (fs.existsSync(old_image)) {
                                                fs.unlink(old_image, (err) => {
                                                    if (err) {}
                                                })
                                            }
                                        } catch{ }
                                    })
                                }

                                if (fields.removedPdf && JSON.parse(fields.removedPdf).length != 0) {
                                    JSON.parse(fields.removedPdf).forEach(ele => {
                                        var old_image = __dirname + '/../../public/uploads/project/' + ele;
                                        try {
                                            if (fs.existsSync(old_image)) {
                                                fs.unlink(old_image, (err) => {
                                                    if (err) {}
                                                })
                                            }
                                        } catch{ }
                                    })
                                }
                                let imagesAfterDeleted = Array.isArray(detail.images) ? detail.images.filter(ele => {
                                    if (fields.removedImage && JSON.parse(fields.removedImage).includes(ele)) {
                                    } else {
                                        return ele
                                    }
                                }) : []
                                let pdfsAfterDeleted = Array.isArray(detail.files) ? detail.files.filter(ele => {
                                    if (fields.removedPdf && JSON.parse(fields.removedPdf).includes(ele)) {
                                    } else {
                                        return ele
                                    }
                                }) : []
                                detail.images = [...imagesAfterDeleted, ...imagesNames];
                                detail.files = [...pdfsAfterDeleted, ...pdfsNames]
                                detail.user_id = ObjectId(req.user._id);
                                detail.video = fields.video ? JSON.parse(fields.video) : [];
                                detail.current_step = detail.current_step == 2 ? 3 : detail.current_step;
                                detail.save(function (err, data) {
                                    if (err) {
                                        reject(err)

                                    } else {
                                        data = JSON.parse(JSON.stringify(data))
                                        data.image_pdf_path = appConfig.uploadUrl + "project/",
                                            res.json({
                                                status: 1,
                                                message: 'Project detail updated succesfully',
                                                statuscode: 200,
                                                response: data
                                            });
                                        return;
                                    }
                                });
                            } else {
                                res.json({
                                    status: 0,
                                    message: 'No data found',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;

                            }
                        });
                    }

                });

            }
        })
    })
}

const Step3update = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        var v = new Validator();
        v = new Validator(fields, {
            freelancerType: 'required',
            projectType: 'required',
            project_id: 'required',
            // user_id: 'required',
            country: 'required',
            city: 'required',
            zipcode: 'required',
        });
        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("freelancerType" in v.errors) {
                    errors.push({
                        "freelancerType": v.errors.freelancerType.message
                    });
                }
                if ("projectType" in v.errors) {
                    errors.push({
                        "projectType": v.errors.projectType.message
                    });
                }

                if ("project_id" in v.errors) {
                    errors.push({
                        "project_id": v.errors.project_id.message
                    });
                }

                // if ("user_id" in v.errors) {
                //     errors.push({
                //         "user_id": v.errors.user_id.message
                //     });
                // }
                if ("country" in v.errors) {
                    errors.push({
                        "country": v.errors.country.message
                    });
                }
                if ("city" in v.errors) {
                    errors.push({
                        "city": v.errors.city.message
                    });
                }
                if ("zipcode" in v.errors) {
                    errors.push({
                        "zipcode": v.errors.zipcode.message
                    });
                }
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
            } else {
                let isValidUser = isValidId(req.user._id)
                if (!isValidUser) {
                    res.json({
                        status: 0,
                        message: 'Wrong user detail provided',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                User.findOne({
                    _id: ObjectId(req.user._id),
                    status: 1,
                    role: 2
                }, async function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    else if (!result) {

                        res.json({
                            status: 0,
                            message: 'User not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else {
                        let isValid = isValidId(fields.project_id)
                        if (!isValid) {
                            res.json({
                                status: 0,
                                message: 'Wrong project detail provided',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        }
                        Project.findOne({
                            _id: ObjectId(fields.project_id),
                            user_id: ObjectId(req.user._id)
                        }, function (err, detail) {
                            if (err) {
                                res.json({
                                    status: 0,
                                    message: 'Something went wrong',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            } else if (detail) {
                                detail.freelancer_type = +fields.freelancerType
                                detail.project_type = fields.projectType ? ObjectId(fields.projectType) : ObjectId;
                                detail.genere = fields.genere ? JSON.parse(fields.genere).map(ele => ObjectId(ele)) : [];
                                detail.user_id = ObjectId(req.user._id);
                                detail.industry = fields.industry ? JSON.parse(fields.industry).map(ele => ObjectId(ele)) : [];
                                result.location = {
                                    type: "Point",
                                    coordinates: [fields.longitude ? parseFloat(fields.longitude) : 32, fields.latitude ? parseFloat(fields.latitude) : 32]
                                }
                                detail.country = fields.country;
                                detail.state = fields.state;
                                detail.city = fields.city;
                                detail.address = fields.address;
                                detail.zipcode = fields.zipcode;
                                detail.current_step = detail.current_step == 3 ? 4 : detail.current_step;
                                detail.save(function (err, data) {
                                    if (err) {
                                        reject(err)

                                    } else {
                                        res.json({
                                            status: 1,
                                            message: 'Project detail updated succesfully',
                                            statuscode: 200,
                                            response: data
                                        });
                                        return;
                                    }
                                });
                            } else {
                                res.json({
                                    status: 0,
                                    message: 'No data found',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;

                            }
                        });
                    }

                });

            }
        })
    })
}

const Step4update = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        var v = new Validator();
        if (+fields.paymentType == 1) {
            v = new Validator(fields, {
                paymentType: 'required',
                project_id: 'required',
                startDate: 'required',
                endDate: 'required',
                fixedPrice: 'required'
            });
        }
        if (+fields.paymentType == 2) {
            v = new Validator(fields, {
                paymentType: 'required',
                project_id: 'required',
                startDate: 'required',
                hourly_rate: 'required'
            });
        }
        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("paymentType" in v.errors) {
                    errors.push({
                        "paymentType": v.errors.paymentType.message
                    });
                }
                if ("hourly_rate" in v.errors) {
                    errors.push({
                        "hourly_rate": v.errors.hourly_rate.message
                    });
                }
                if ("fixedPrice" in v.errors) {
                    errors.push({
                        "fixedPrice": v.errors.fixedPrice.message
                    });
                }

                if ("project_id" in v.errors) {
                    errors.push({
                        "project_id": v.errors.project_id.message
                    });
                }

                if ("startDate" in v.errors) {
                    errors.push({
                        "startDate": v.errors.startDate.message
                    });
                }
                if ("endDate" in v.errors) {
                    errors.push({
                        "endDate": v.errors.endDate.message
                    });
                }
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
            } else {
                let isValidUser = isValidId(req.user._id)
                if (!isValidUser) {
                    res.json({
                        status: 0,
                        message: 'Wrong user detail provided',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                User.findOne({
                    _id: ObjectId(req.user._id),
                    status: 1,
                    role: 2
                }, async function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    else if (!result) {

                        res.json({
                            status: 0,
                            message: 'User not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else {
                        let isValid = isValidId(fields.project_id)
                        if (!isValid) {
                            res.json({
                                status: 0,
                                message: 'Wrong project detail provided',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        }
                        Project.findOne({
                            _id: ObjectId(fields.project_id),
                            user_id: ObjectId(req.user._id)
                        }, function (err, detail) {
                            if (err) {
                                res.json({
                                    status: 0,
                                    message: 'Something went wrong',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            } else if (detail) {

                                detail.payment_type = +fields.paymentType
                                detail.hourly_rate = fields.hourly_rate ? parseFloat(fields.hourly_rate) : 0
                                detail.fixed_budget = fields.fixedPrice ? JSON.parse(fields.fixedPrice) : [];
                                detail.user_id = ObjectId(req.user._id);
                                detail.start_date = new Date(moment(new Date(fields.startDate), ['DD-MM-YYYY']).format("YYYY-MM-DD")).toISOString();
                                detail.end_date = new Date(moment(new Date(fields.endDate), ['DD-MM-YYYY']).format("YYYY-MM-DD")).toISOString()
                                detail.project_setup = 0;
                                detail.current_step = detail.current_step == 4 ? 5 : detail.current_step;;
                                detail.save(function (err, data) {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: 'something went wrong',
                                            statuscode: 400,
                                            response: err
                                        });
                                        return;

                                    } else {
                                        res.json({
                                            status: 1,
                                            message: 'Project detail updated succesfully',
                                            statuscode: 200,
                                            response: data
                                        });
                                        return;
                                    }
                                });
                            } else {
                                res.json({
                                    status: 0,
                                    message: 'No data found',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;

                            }
                        });
                    }

                });

            }
        })
    })
}

const favouriteFreelancer = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.json({
                status: 0,
                message: "Something went wrong",
                statuscode: 400,
                response: "",
            });
            return;
        } else {
            let isValidUser = isValidId(req.user._id)
            if (!isValidUser) {
                res.json({
                    status: 0,
                    message: 'Wrong user detail provided',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            User.findOne({
                _id: ObjectId(req.user._id),
                status: 1,
                role: 2
            }, async function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                else if (!result) {
                    res.json({
                        status: 0,
                        message: 'User not found.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {
                    FavourateUser.aggregate([
                        { $match: { user_id: ObjectId(req.user._id) } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "freelancer_id",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { $unwind: "$user" },
                        { $match: { "user.status": 1 } },
                        { $project: { _id: 0, "freelancer_id": "$user._id", "first_name": "$user.first_name", "last_name": "$user.last_name" } },
                        { $sort: { freelancer_id: 1, first_name: 1 } }
                    ], function (err, result) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: "Something went wrong",
                                statuscode: 400,
                                response: "",
                            });
                            return;
                        } else {
                            result = JSON.parse(JSON.stringify(result))
                            let arr = _.uniqBy(result, 'freelancer_id')
                            res.json({
                                status: 1,
                                message: "Data found",
                                statuscode: 200,
                                response: arr,
                            });
                        }
                    }
                    )
                }
            })
        }
    });
};

const postProject = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.json({
                status: 0,
                message: "Something went wrong",
                statuscode: 400,
                response: "",
            });
            return;
        } else {
            let isValidUser = isValidId(req.user._id)
            if (!isValidUser) {
                res.json({
                    status: 0,
                    message: 'Wrong user detail provided',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            User.findOne({
                _id: ObjectId(req.user._id),
                status: 1,
                role: 2
            }, async function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                else if (!result) {
                    res.json({
                        status: 0,
                        message: 'User not found.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {
                    let isValid = isValidId(fields.project_id)
                    if (!isValid) {
                        res.json({
                            status: 0,
                            message: 'Wrong project detail provided',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    Project.findOne({
                        _id: ObjectId(fields.project_id),
                        user_id: ObjectId(req.user._id)
                    }, async function (err, detail) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else if (detail) {
                            if (detail.current_step == 5 && detail.project_setup == 0) {
                                detail.current_step = 5;
                                detail.project_setup = 1;
                                detail.save(async function (err, data) {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: 'something went wrong',
                                            statuscode: 400,
                                            response: err
                                        });
                                        return;
                                    } else {
                                        try {
                                            let invitee = JSON.parse(fields.invited_freelancer);
                                            if (invitee.length > 0)
                                                await inviteFreelancer(invitee, fields.message ? fields.message : "", fields.project_id, req.user._id);
                                        } catch {
                                        }
                                        res.json({
                                            status: 1,
                                            message: 'Project post succesfully',
                                            statuscode: 200,
                                            response: data
                                        });
                                        return;
                                    }
                                });
                            } else if (detail.current_step < 5 || detail.project_setup == 0) {
                                res.json({
                                    status: 1,
                                    message: 'Please complete the project detail',
                                    statuscode: 200,
                                    response: { status: 2, current_step: detail.current_step }
                                });
                                return;
                            } else if (detail.project_setup == 1) {
                                res.json({
                                    status: 1,
                                    message: 'You have already posted this project',
                                    statuscode: 200,
                                    response: { status: 3 }
                                });
                                return;
                            } else {
                                res.json({
                                    status: 0,
                                    message: 'Invalid project detail',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                        } else {
                            res.json({
                                status: 0,
                                message: 'No data found',
                                statuscode: 400,
                                response: ''
                            });
                            return;

                        }
                    })
                }
            })
        }
    });
}

function inviteFreelancer(dataArray, message, project_id, user_id, insertMany = false) {
    var updateObject = [];
    return new Promise(async (resolve, reject) => {
        await dataArray.reduce(async (promise, ele, index) => {
            await promise;
            try {
                let res = await checkValidFreelancer(ele)
                if (res) {
                    let obj = {};
                    obj.freelancer_id = ObjectId(ele);
                    obj.project_id = ObjectId(project_id);
                    obj.user_id = ObjectId(user_id);
                    obj.message = message;
                    obj.candidate_type = 1 //invited freelancer
                    updateObject.push(obj)
                }
            } catch{
            }
        }, Promise.resolve());
        if (!insertMany) {
            if (updateObject.length > 0) {
                ProjectCandidate.insertMany(updateObject).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                });
            } else {
                reject(false)
            }
        } else {
            updateObject.reduce(async (promise, ele, index) => {
                ProjectCandidate.findOne({
                    freelancer_id: ele,
                    project_id: ObjectId(project_id),
                    user_id: ObjectId(user_id)
                }, function (err1, detail) {
                    if (err1) {
                    } else if (recommendation) {
                        detail.message = message;
                        invitee.save(function (err, data) {
                            if (err) {} else {}
                        })
                    } else {
                        let invitee = new ProjectCandidate();
                        invitee.message = message;
                        invitee.freelancer_id = ele;
                        invitee.user_id = ObjectId(user_id);
                        invitee.project_id = ObjectId(project_id)
                        invitee.save(function (err, data) {
                            if (err) {} else {}
                        })
                    }

                })
                if (index == updateObject.length - 1) {
                    resolve(true)
                }
            }, Promise.resolve())
            resolve(true)
        }
    })
}

const checkValidFreelancer = function (id) {
    return new Promise((resolve, reject) => {
        let isValidUser = isValidId(id)
        if (!isValidUser) {
            reject(false)
        } else {
            User.findOne({
                _id: ObjectId(id),
                status: 1,
                profile_setup: 1,
                email_confirmed: 1,
                role: 3
            }, async function (err, result) {
                if (err) {
                    reject(false)
                }
                else if (!result) {
                    reject(false)
                } else {
                    resolve(true)
                }
            });
        }
    })
}

const getInvitedFreelancerList = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.json({
                status: 0,
                message: "Something went wrong",
                statuscode: 400,
                response: "",
            });
            return;
        } else {
            let isValidUser = isValidId(req.user._id)
            if (!isValidUser) {
                res.json({
                    status: 0,
                    message: 'Wrong user detail provided',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            User.findOne({
                _id: ObjectId(req.user._id),
                status: 1,
                role: 2
            }, async function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                else if (!result) {
                    res.json({
                        status: 0,
                        message: 'User not found.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {
                    let isValid = isValidId(fields.project_id)
                    if (!isValid) {
                        res.json({
                            status: 0,
                            message: 'Wrong project detail provided',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    ProjectCandidate.aggregate([
                        { $match: { user_id: ObjectId(req.user._id), project_id: ObjectId(fields.project_id) } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "freelancer_id",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { $unwind: "$user" },
                        { $match: { "user.status": 1 } },
                        { $project: { _id: 0, "freelancer_id": "$user._id", "first_name": "$user.first_name", "last_name": "$user.last_name", "message": 1 } },
                        { $sort: { freelancer_id: 1, first_name: 1 } }
                    ], function (err, result) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: "Something went wrong",
                                statuscode: 400,
                                response: "",
                            });
                            return;
                        } else {
                            result = JSON.parse(JSON.stringify(result))
                            let arr = _.uniqBy(result, 'freelancer_id')
                            res.json({
                                status: 1,
                                message: "Data found",
                                statuscode: 200,
                                response: arr,
                            });
                        }
                    }
                    )
                }
            })
        }
    });
}

const addinvitefreelancer = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.json({
                status: 0,
                message: "Something went wrong",
                statuscode: 400,
                response: "",
            });
            return;
        } else {
            let isValidUser = isValidId(req.user._id)
            if (!isValidUser) {
                res.json({
                    status: 0,
                    message: 'Wrong user detail provided',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            User.findOne({
                _id: ObjectId(req.user._id),
                status: 1,
                role: 2
            }, async function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                else if (!result) {
                    res.json({
                        status: 0,
                        message: 'User not found.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {
                    let isValid = isValidId(fields.project_id)
                    if (!isValid) {
                        res.json({
                            status: 0,
                            message: 'Wrong project detail provided',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    Project.findOne({
                        _id: ObjectId(fields.project_id),
                        user_id: ObjectId(req.user._id)
                    }, async function (err, detail) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else if (detail) {
                            if (detail.current_step == 5 && detail.project_setup == 0) {
                                res.json({
                                    status: 1,
                                    message: 'Please your project to invite freelancer',
                                    statuscode: 200,
                                    response: { status: 2 }
                                });
                                return;
                            } else if (detail.current_step < 5 || detail.project_setup == 0) {
                                res.json({
                                    status: 1,
                                    message: 'Please complete the project detail',
                                    statuscode: 200,
                                    response: { status: 3, current_step: detail.current_step }
                                });
                                return;
                            } else if (detail.project_setup == 1) {
                                try {
                                    let invitee = JSON.parse(fields.invited_freelancer);
                                    let removeList = JSON.parse(fields.removed_freelancer)
                                    removeList = removeList.filter(ele => {
                                        ids.push(ObjectId(ele))
                                    })
                                    if (removeList.length > 0) {
                                        await ProjectCandidate.deleteMany({
                                            _id: {
                                                $in: removeList
                                            },
                                            user_id: ObjectId(req.user._id),
                                            project_id: ObjectId(fields.project_id)
                                        }, function (err, removal) {
                                            if (err) {
                                            } else {
                                            }
                                        })
                                    }
                                    if (invitee.length > 0)
                                        await inviteFreelancer(invitee, fields.message ? fields.message : "", fields.project_id, req.user._id, true);
                                } catch {
                                }
                            } else {
                                res.json({
                                    status: 0,
                                    message: 'Invalid project detail',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                        } else {
                            res.json({
                                status: 0,
                                message: 'No data found',
                                statuscode: 400,
                                response: ''
                            });
                            return;

                        }
                    })
                }
            })
        }
    });
}

const clientProject = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.json({
                status: 0,
                message: "Something went wrong",
                statuscode: 400,
                response: "",
            });
            return;
        } else {
            let isValidUser = isValidId(req.user._id)
            if (!isValidUser) {
                res.json({
                    status: 0,
                    message: 'Wrong user detail provided',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            User.findOne({
                _id: ObjectId(req.user._id),
                status: 1,
                role: 2
            }, async function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                else if (!result) {
                    res.json({
                        status: 0,
                        message: 'User not found.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {
                    let categories = fields.categories ? JSON.parse(fields.categories) : null
                    let perPage = 5;
                    let pageNumber = fields.page ? fields.page : 1;

                    let mongoQuery = [
                        {
                            $match: {
                                $and: [
                                    {
                                        "user_id": { $eq: ObjectId(req.user._id) }
                                    },
                                    { "status": categories.length > 0 ? { $in: categories } : { $nin: [0] } }

                                ]
                            }
                        },
                        { $skip: (+pageNumber - 1) * perPage },
                        { $limit: perPage },
                        { $sort: { created_at: -1 } }
                    ]

                    let countQuery = [{
                        $match: {
                            $and: [
                                {
                                    "user_id": { $eq: ObjectId(req.user._id) }
                                },
                                { "status": categories.length > 0 ? { $in: categories } : { $nin: [0] } }

                            ]
                        }
                    },
                    { $count: "total" }]

                    mongoQuery = [
                        {
                            $facet: {
                                count: countQuery,
                                data: mongoQuery
                            }
                        }]
                    Project.aggregate(mongoQuery, function (err, result) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: "Something went wrong",
                                statuscode: 400,
                                response: "",
                            });
                            return;
                        } else {
                            let total = result[0].count[0] ? result[0].count[0].total : 0;
                            let response = {
                                totalCount: total,
                                perPage: perPage,
                                totalPages: Math.ceil(total / perPage),
                                currentPage: +pageNumber,
                                file_image_path: appConfig.uploadUrl + "project/",
                                records: result[0] ? result[0].data : []
                            };
                            res.json({
                                status: 1,
                                message: "",
                                statuscode: 200,
                                response: response,
                            });
                            return;
                        }
                    }
                    );
                }
            })
        }
    });
}

module.exports = {
    index,
    Step1update,
    Step2update,
    Step3update,
    Step4update,
    postProject,
    favouriteFreelancer,
    getInvitedFreelancerList,
    addinvitefreelancer,
    clientProject
}