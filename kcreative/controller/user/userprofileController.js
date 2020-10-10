const User = require('./../../model/usersModel');
const Skills = require('./../../model/skills&AwardModel');
const PreviousClient = require('./../../model/previousClientModel');
const Expertise = require('./../../model/expertise&priceModel');
const Recommendation = require('./../../model/recommendationsModel');
const PortFolios = require('./../../model/portFoliosModel');
const Emailtemplates = require("./../../model/emailTempleteModel");
const bcrypt = require('bcryptjs');
const adminHelper = require("./../../helper/adminHelper");
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
const fileExists = require('file-exists');


//const ISODate = mongoose.Types.ISODate;
const moment = require("moment");

const index = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        User.findOne({ _id: ObjectId(req.params.id), status: 1 }, function (err, result) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            if (!result) {

                res.json({
                    status: 0,
                    message: 'User not found.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                result = JSON.parse(JSON.stringify(result))
                result.latitude = result.location.coordinates.latitude;
                result.longitude = result.location.coordinates.longitude;
                result.image = result.image ? appConfig.uploadUrl + 'user/' + result.image : "";
                res.json({
                    status: 1,
                    message: '',
                    statuscode: 200,
                    response: result
                });
                return;
            }
        });
    });
}

const changePassword = function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (!fields.id || !fields.password || !fields.old_password) {

            res.json({
                status: 0,
                message: 'Bad request.',
                statuscode: 400,
                response: ""
            });
            return;
        }

        User.findOne({ _id: ObjectId(fields.id), status: 1 }, (err1, user) => {

            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: err
                });
                return;
            }
            if (!user) {

                res.json({
                    status: 0,
                    message: 'Invalid user.',
                    statuscode: 400,
                    response: ""
                });
                return;
            } else {

                bcrypt.compare(fields.old_password, user.password, (err, isMatch) => {
                    if (isMatch) {
                        user.password = '';
                        var new_pass = '';
                        bcrypt.hash(fields.password, 10, function (err2, hash) {
                            if (err) {

                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: err
                                });
                                return;
                            }
                            new_pass = hash;
                            User.updateOne({ _id: ObjectId(user._id) }, { $set: { password: new_pass } }, (err3, result) => {
                                if (err) {

                                    res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode: 400,
                                        response: err
                                    });
                                    return;
                                }

                                res.json({
                                    status: 1,
                                    message: 'Password changed successfully.',
                                    statuscode: 200,
                                    response: user
                                });
                                return;

                            });
                        });

                    } else {
                        res.json({
                            status: 0,
                            message: 'old password not matched!',
                            statuscode: 400,
                            response: ""
                        });
                        return
                    }
                })
            }
        })
    });
}

const updateProfileClient = function (req, res) {

    //console.log(req);
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/user/';
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        var v = new Validator();
        v = new Validator(fields, {
            first_name: 'required',
            last_name: 'required',
            companyname: 'required',
            phoneno: 'required',
            business_summary: 'required',
            address: 'required',
            city: 'required',
            state: 'required',
            zipcode: 'required',
            country: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("first_name" in v.errors) {
                    errors.push({ "first_name": v.errors.first_name.message });
                }
                if ("last_name" in v.errors) {
                    errors.push({ "last_name": v.errors.last_name.message });
                }

                if ("companyname" in v.errors) {
                    errors.push({ "companyname": v.errors.companyname.message });
                }
                if ("phoneno" in v.errors) {
                    errors.push({ "phoneno": v.errors.phoneno.message });
                }

                if ("business_summary" in v.errors) {
                    errors.push({ "business_summary": v.errors.business_summary.message });
                }

                if ("address" in v.errors) {
                    errors.push({ "address": v.errors.address.message });
                }
                if ("state" in v.errors) {
                    errors.push({ "state": v.errors.state.message });
                }
                if ("city" in v.errors) {
                    errors.push({ "city": v.errors.city.message });
                }
                if ("zipcode" in v.errors) {
                    errors.push({ "zipcode": v.errors.zipcode.message });
                }

                if ("country" in v.errors) {
                    errors.push({ "country": v.errors.country.message });
                }

                // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                // res.send(response);
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                let fileName = ''
                if (files.profile_image && files.profile_image.name) {
                    fileName = new Date().getTime() + files.profile_image.name.replace(" ", "-");
                    var oldpath = files.profile_image.path;
                    var newpath = __dirname + '/../../public/uploads/user/' + fileName;
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

                User.findOne({ _id: ObjectId(fields.id), status: 1 }, function (err1, result) {
                    if (err1) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!result) {

                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {
                        console.log(fields.longitude, fields.latitude)
                        result.first_name = fields.first_name;
                        result.last_name = fields.last_name;
                        //result.email_confirmed = 0;
                        result.companyname = fields.companyname;
                        result.phoneno = fields.phoneno;
                        result.business_summary = fields.business_summary;
                        result.address = fields.address;
                        result.state = fields.state;
                        result.city = fields.city;
                        result.zipcode = fields.zipcode;
                        result.location = {
                            type: "Point",
                            coordinates: [fields.longitude ? parseFloat(fields.longitude) : 32, fields.latitude ? parseFloat(fields.latitude) : 32]
                        }
                        result.country = fields.country;
                        result.website = fields.website;

                        if (fileName.length != 0) {
                            if (result.image) {
                                var old_image = __dirname + '/../../public/uploads/user/' + result.image;
                                fs.unlink(old_image, (err) => {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong.',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    }
                                })
                            }
                            result.image = fileName;
                        }
                        console.log(result);
                        result.save(function (err2, user) {

                            //console.log(err2);
                            if (err2) {

                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                            //console.log(user);
                            if (user) {
                                user = JSON.parse(JSON.stringify(user))
                                user.latitude = user.location.coordinates.latitude;
                                user.longitude = user.location.coordinates.longitude;
                                user.image = user.image ? appConfig.uploadUrl + 'user/' + user.image : "";
                                res.json({
                                    status: 1,
                                    message: 'Profile updated successfully.',
                                    statuscode: 200,
                                    response: user
                                });
                                return;
                            } else {
                                user = JSON.parse(JSON.stringify(user))
                                user.latitude = user.location.coordinates.latitude;
                                user.longitude = user.location.coordinates.longitude;
                                user.image = user.image ? appConfig.uploadUrl + 'user/' + user.image : "";
                                res.json({
                                    status: 0,
                                    message: 'Profile not updated successfully.',
                                    statuscode: 400,
                                    response: user
                                });
                                return;
                            }
                        });
                    }
                });
            }
        })
    });
}

const updateNotification = function (req, res) {

    //console.log(req);
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        User.findOne({ _id: ObjectId(fields.id), status: 1 }, function (err1, result) {
            if (err1) {
                console.log(err1)
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            if (!result) {

                res.json({
                    status: 0,
                    message: 'User data not found.',
                    statuscode: 400,
                    response: ''
                });
                return;

            } else {
                result.notification = +fields.notification;

                console.log(result);
                result.save(function (err2, user) {

                    //console.log(err2);
                    if (err2) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    //console.log(user);
                    if (user) {
                        res.json({
                            status: 1,
                            message: 'Notification setting updated successfully.',
                            statuscode: 200,
                            response: user
                        });
                        return;
                    } else {
                        res.json({
                            status: 0,
                            message: 'Notification setting not updated successfully.',
                            statuscode: 400,
                            response: user
                        });
                        return;
                    }
                });
            }
        });
    });
}

const updateStep1 = function (req, res) {

    //console.log(req);
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/user/';
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }

        var v = new Validator();
        v = new Validator(fields, {
            first_name: 'required',
            last_name: 'required',
            freelancer_type: 'required',
            about_me: 'required',
            address: 'required',
            city: 'required',
            state: 'required',
            zipcode: 'required',
            country: 'required',
            travel_distance: 'required',
            english_proficiency: 'required',
            gender: 'required',
            ethnicity: 'required',
            orientation: 'required',
            disabilities: 'required',
            availability: 'required',
            birthdate: 'required',
            user_id: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("first_name" in v.errors) {
                    errors.push({ "first_name": v.errors.first_name.message });
                }
                if ("last_name" in v.errors) {
                    errors.push({ "last_name": v.errors.last_name.message });
                }

                if ("freelancer_type" in v.errors) {
                    errors.push({ "freelancer_type": v.errors.freelancer_type.message });
                }
                // if ("phoneno" in v.errors) {
                //     errors.push({ "phoneno": v.errors.phoneno.message });
                // }

                if ("about_me" in v.errors) {
                    errors.push({ "about_me": v.errors.about_me.message });
                }

                if ("address" in v.errors) {
                    errors.push({ "address": v.errors.address.message });
                }
                if ("state" in v.errors) {
                    errors.push({ "state": v.errors.state.message });
                }
                if ("city" in v.errors) {
                    errors.push({ "city": v.errors.city.message });
                }
                if ("zipcode" in v.errors) {
                    errors.push({ "zipcode": v.errors.zipcode.message });
                }

                if ("country" in v.errors) {
                    errors.push({ "country": v.errors.country.message });
                }

                if ("travel_distance" in v.errors) {
                    errors.push({ "travel_distance": v.errors.travel_distance.message });
                }
                if ("english_proficiency" in v.errors) {
                    errors.push({ "english_proficiency": v.errors.english_proficiency.message });
                }
                if ("gender" in v.errors) {
                    errors.push({ "gender": v.errors.gender.message });
                }
                if ("ethnicity" in v.errors) {
                    errors.push({ "ethnicity": v.errors.ethnicity.message });
                }
                if ("orientation" in v.errors) {
                    errors.push({ "orientation": v.errors.orientation.message });
                }

                if ("disabilities" in v.errors) {
                    errors.push({ "disabilities": v.errors.disabilities.message });
                }

                if ("availability" in v.errors) {
                    errors.push({ "availability": v.errors.availability.message });
                }
                if ("birthdate" in v.errors) {
                    errors.push({ "birthdate": v.errors.birthdate.message });
                }
                if ("user_id" in v.errors) {
                    errors.push({ "user_id": v.errors.user_id.message });
                }

                // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                // res.send(response);
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                let fileName = ''
                if (files.profile_image && files.profile_image.name) {
                    fileName = new Date().getTime() + files.profile_image.name.replace(" ", "-");
                    var oldpath = files.profile_image.path;
                    var newpath = __dirname + '/../../public/uploads/user/' + fileName;
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

                User.findOne({ _id: ObjectId(fields.user_id), status: 1 }, function (err1, result) {
                    if (err1) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!result) {

                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {
                        let updateObject = {};
                        result.first_name = fields.first_name;
                        result.last_name = fields.last_name;
                        // result.email_confirmed = 0;
                        result.companyname = fields.companyname;

                        if (fields.phoneno) {
                            result.phoneno = fields.phoneno;
                        }

                        result.website = fields.website;
                        result.linkedin_url = fields.linkedin_url;
                        result.aboutme = fields.about_me;
                        result.birthdate = fields.birthdate;
                        result.address = fields.address;
                        result.state = fields.state;
                        result.city = fields.city;
                        result.zipcode = fields.zipcode;
                        result.location = {
                            type: "Point",
                            coordinates: [fields.longitude ? parseFloat(fields.longitude) : 32, fields.latitude ? parseFloat(fields.latitude) : 32]
                        }
                        result.country = fields.country;

                        result.travel_distance = parseFloat(fields.travel_distance);
                        result.english_proficiency = fields.english_proficiency;
                        result.other_language = fields.other_language;
                        result.gender = +fields.gender;
                        result.ethnicity = fields.ethnicity ? JSON.parse(fields.ethnicity) : [];
                        result.orientation = +fields.orientation;
                        result.disabilities = +fields.disabilities;
                        result.availability = fields.availability ? JSON.parse(fields.availability) : [];
                        result.freelancer_type = +fields.freelancer_type;
                        if (result.current_step < 2) {
                            result.current_step = 2;
                        }

                        if (fileName.length != 0) {
                            if (result.image) {
                                var old_image = __dirname + '/../../public/uploads/user/' + result.image;
                                fs.unlink(old_image, (err) => {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong.',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    }
                                })
                            }
                            result.image = fileName;
                        }
                        console.log(result);
                        result.save(function (err2, user) {

                            console.log(err2);
                            if (err2) {

                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                            //console.log(user);
                            if (user) {
                                user = JSON.parse(JSON.stringify(user))
                                user.latitude = user.location.coordinates.latitude;
                                user.longitude = user.location.coordinates.longitude;
                                user.image = user.image ? appConfig.uploadUrl + 'user/' + user.image : "";
                                res.json({
                                    status: 1,
                                    message: 'Profile updated successfully.',
                                    statuscode: 200,
                                    response: user
                                });
                                return;
                            } else {
                                user.image = user.image ? appConfig.uploadUrl + 'user/' + user.image : "";
                                res.json({
                                    status: 0,
                                    message: 'Profile not updated successfully.',
                                    statuscode: 400,
                                    response: user
                                });
                                return;
                            }
                        });
                    }
                });
            }
        })
    });
}

const Step1info = function (req, res) {
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
        User.findOne({
            _id: ObjectId(req.params.id),
            status: 1
        }, function (err, result) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            if (!result) {

                res.json({
                    status: 0,
                    message: 'User not found.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                result = JSON.parse(JSON.stringify(result))
                result.latitude = result.location && result.location.coordinates ? result.location.coordinates.latitude : 32;
                result.longitude = result.location && result.location.coordinates ? result.location.coordinates.longitude : 32;
                result.image = result.image ? appConfig.uploadUrl + 'user/' + result.image : "";
                res.json({
                    status: 1,
                    message: '',
                    statuscode: 200,
                    response: result
                });
                return;
            }
        });
    });
}

const updateStep2 = function (req, res) {

    //console.log(req);
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/user/';
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        var v = new Validator();
        v = new Validator(fields, {
            primary_skills: 'required',
            secondary_skills: 'required',
            user_id: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("primary_skills" in v.errors) {
                    errors.push({
                        "primary_skills": v.errors.primary_skills.message
                    });
                }
                if ("secondary_skills" in v.errors) {
                    errors.push({
                        "secondary_skills": v.errors.secondary_skills.message
                    });
                }
                if ("user_id" in v.errors) {
                    errors.push({
                        "user_id": v.errors.user_id.message
                    });
                }

                // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                // res.send(response);
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                User.findOne({
                    _id: ObjectId(fields.user_id),
                    status: 1,
                    role: 3
                }, function (err1, user) {
                    if (err1) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!user) {

                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {

                        Skills.findOne({
                            user_id: ObjectId(fields.user_id)
                        }, function (err1, result) {
                            if (err1) {

                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                            if (!result) {
                                console.log("skills insertion")
                                var record = new Skills();
                                record.primary_skills = fields.primary_skills ? JSON.parse(fields.primary_skills).map(ele => ObjectId(ele)) : [];
                                record.secondary_skills = fields.secondary_skills ? JSON.parse(fields.secondary_skills).map(ele => ObjectId(ele)) : [];
                                record.user_id = fields.user_id;

                                if (user.freelancer_type == 1) {
                                    record.graphic_specialities = fields.graphic_specialities ? JSON.parse(fields.graphic_specialities).map(ele => ObjectId(ele)) : [];
                                }

                                if (user.freelancer_type == 2) {
                                    record.editing_style = fields.editing_style ? JSON.parse(fields.editing_style).map(ele => ObjectId(ele)) : [];
                                }

                                record.awards = fields.awards ? JSON.parse(fields.awards).map(ele => ObjectId(ele)) : [];
                                record.save(function (err1, data) {
                                    if (err1) {

                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong',
                                            statuscode: 400,
                                            response: err1
                                        });
                                    } else {
                                        if (data) {
                                            if (!user.current_step || user.current_step <= 2) {
                                                user.current_step = 3;
                                                user.save(function (err1, user) {
                                                    if (err1) { }
                                                })
                                            }
                                            res.json({
                                                status: 1,
                                                message: 'Profile updated successfully.',
                                                statuscode: 200,
                                                response: user
                                            });
                                            return;

                                        } else {

                                            res.json({
                                                status: 0,
                                                message: 'Profile not updated successfully.',
                                                statuscode: 400,
                                                response: ""
                                            });

                                        }
                                    }

                                })


                            } else {
                                console.log("skills updation")
                                result.primary_skills = fields.primary_skills ? JSON.parse(fields.primary_skills).map(ele => ObjectId(ele)) : '';
                                result.secondary_skills = fields.secondary_skills ? JSON.parse(fields.secondary_skills).map(ele => ObjectId(ele)) : '';
                                result.user_id = fields.user_id;

                                if (user.freelancer_type == 1) {
                                    result.graphic_specialities = fields.graphic_specialities ? JSON.parse(fields.graphic_specialities).map(ele => ObjectId(ele)) : '';
                                }

                                if (user.freelancer_type == 2) {
                                    result.editing_style = fields.editing_style ? JSON.parse(fields.editing_style).map(ele => ObjectId(ele)) : '';
                                }

                                result.awards = fields.awards ? JSON.parse(fields.awards).map(ele => ObjectId(ele)) : '';
                                result.save(function (err1, data) {
                                    if (err1) {

                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong',
                                            statuscode: 400,
                                            response: err1
                                        });
                                    } else {
                                        if (data) {
                                            res.json({
                                                status: 1,
                                                message: 'Profile updated successfully.',
                                                statuscode: 200,
                                                response: data
                                            });
                                        } else {

                                            res.json({
                                                status: 0,
                                                message: 'Profile not updated successfully.',
                                                statuscode: 400,
                                                response: ""
                                            });

                                        }
                                    }

                                })

                            }
                        });
                    }
                });
            }
        })
    });
}

const Step2info = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        User.findOne({
            _id: ObjectId(req.params.id),
            status: 1,
            role: 3
        }, function (err, result) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            if (!result) {

                res.json({
                    status: 0,
                    message: 'User not found.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                Skills.findOne({
                    user_id: ObjectId(req.params.id)
                }, function (err, skills) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!skills) {

                        res.json({
                            status: 0,
                            message: 'Data not Updated.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else {

                        res.json({
                            status: 1,
                            message: '',
                            statuscode: 200,
                            response: skills
                        });
                        return;
                    }
                });
            }
        });
    });
}

const updateStep3 = function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/user/';
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        var v = new Validator();
        v = new Validator(fields, {
            experience_level: 'required',
            experience_year: 'required',
            hourly_rate: 'required',
            minimum_fixed_price: 'required',
            user_id: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("experience_level" in v.errors) {
                    errors.push({
                        "experience_level": v.errors.experience_level.message
                    });
                }
                if ("experience_year" in v.errors) {
                    errors.push({
                        "experience_year": v.errors.experience_year.message
                    });
                }
                if ("hourly_rate" in v.errors) {
                    errors.push({
                        "hourly_rate": v.errors.hourly_rate.message
                    });
                }
                if ("minimum_fixed_price" in v.errors) {
                    errors.push({
                        "minimum_fixed_price": v.errors.minimum_fixed_price.message
                    });
                }

                if ("user_id" in v.errors) {
                    errors.push({
                        "user_id": v.errors.user_id.message
                    });
                }

                // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                // res.send(response);
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                User.findOne({
                    _id: ObjectId(fields.user_id),
                    status: 1,
                    role: 3
                }, async function (err1, user) {
                    if (err1) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!user) {

                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {
                        let lastClient = [];
                        if (1) {
                            let previous = fields.previous && fields.previous != "" ? JSON.parse(fields.previous) : [];
                            let ids = []
                            await previous.filter(ele => {
                                if (ele._id && ele._id != "") {
                                    ids.push(ObjectId(ele._id))
                                }
                            })
                            console.log("ids=>", ids)
                            await PreviousClient.deleteMany({
                                _id: {
                                    $nin: ids
                                },
                                user_id: fields.user_id
                            }, function (err, removal) {
                                if (err) {
                                    console.log(err)
                                    res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode: 400,
                                        response: err
                                    });
                                    return;
                                } else {
                                    console.log("res=>", removal)
                                }
                            })
                            await previous.reduce(async (promise, obj) => {
                                await promise;
                                await insertPreviousClient(obj, fields.user_id).then(data => {
                                    console.log("data=>", data)
                                    lastClient.push(data);
                                }).catch(err => {
                                    console.log("err=>", err)
                                    res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode: 400,
                                        response: err
                                    });
                                    return;
                                });
                            }, Promise.resolve())
                        }

                        Expertise.findOne({
                            user_id: ObjectId(fields.user_id)
                        }, function (err, expertise) {
                            if (err) {
                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            } else if (expertise) {

                                expertise.experience_level = fields.experience_level;
                                expertise.experience_year = fields.experience_year;
                                expertise.hourly_rate = fields.hourly_rate;
                                expertise.minimum_fixed_price = fields.minimum_fixed_price;
                                expertise.user_id = fields.user_id;
                                expertise.save(function (err, result) {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong.',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    } else if (result) {
                                        if (user.current_step <= 3) {
                                            user.current_step = 4;
                                            user.save(function (err, user) {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    console.log(user)
                                                }
                                            })
                                        }
                                        result = JSON.parse(JSON.stringify(user));
                                        result['previous'] = lastClient
                                        res.json({
                                            status: 1,
                                            message: 'Profile updated successfully.',
                                            statuscode: 200,
                                            response: result
                                        });
                                    } else {
                                        result = JSON.parse(JSON.stringify(result));
                                        result['previous'] = lastClient
                                        res.json({
                                            status: 1,
                                            message: 'Profile not updated successfully.',
                                            statuscode: 200,
                                            response: result
                                        });
                                    }
                                })
                            } else {
                                let record = new Expertise();
                                record.experience_level = fields.experience_level;
                                record.experience_year = fields.experience_year;
                                record.hourly_rate = fields.hourly_rate;
                                record.minimum_fixed_price = fields.minimum_fixed_price;
                                record.user_id = fields.user_id;
                                record.save(function (err, result) {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong.',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    } else if (result) {
                                        if (user.current_step <= 3) {
                                            user.current_step = 4;
                                            user.save(function (err, user) {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    console.log(user)
                                                }
                                            })
                                        }
                                        result = JSON.parse(JSON.stringify(result));
                                        result['previous'] = lastClient
                                        res.json({
                                            status: 1,
                                            message: 'Profile updated successfully.',
                                            statuscode: 200,
                                            response: result
                                        });
                                    } else {
                                        result = JSON.parse(JSON.stringify(result));
                                        result['previous'] = lastClient
                                        res.json({
                                            status: 1,
                                            message: 'Profile not updated successfully.',
                                            statuscode: 200,
                                            response: result
                                        });
                                    }
                                })

                            }

                        })
                    }
                });
            }
        })
    });
}

const insertPreviousClient = function (data, user_id) {

    //console.log(data);
    return new Promise(async (resolve, reject) => {
        var v = new Validator();
        v = new Validator(data, {
            clientName: 'required',
            role: 'required',
            workedAs: 'required',
            startDate: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("clientName" in v.errors) {
                    errors.push({
                        "clientName": v.errors.clientName.message
                    });
                }
                if ("role" in v.errors) {
                    errors.push({
                        "role": v.errors.role.message
                    });
                }

                if ("start_date" in v.errors) {
                    errors.push({
                        "startDate": v.errors.start_date.message
                    });
                }

                if ("workLength" in v.errors) {
                    errors.push({
                        "workLength": v.errors.workLength.message
                    });
                }
                reject(errors);
            } else {
                if (data._id && data._id != "") {
                    PreviousClient.findOne({
                        _id: ObjectId(data._id),
                        user_id: ObjectId(user_id)
                    }, function (err1, client) {

                        if (err1) {
                            reject(err1)
                        } else if (client) {
                            client.client_name = data.clientName;
                            client.role = data.role;
                            client.workedAs = data.workedAs;
                            client.start_date = data.startDate;
                            client.end_date = data.endDate;
                            client.user_id = user_id;
                            client.save(function (err, data) {
                                if (err) {
                                    reject(err)
                                } else {
                                    console.log("previous client updated")
                                    resolve(data)
                                }
                            })
                        } else {
                            let previous = new PreviousClient();
                            previous.client_name = data.clientName;
                            previous.role = data.role;
                            previous.workedAs = data.workedAs;
                            previous.end_date = data.endDate;
                            previous.start_date = data.startDate;
                            previous.user_id = user_id;
                            previous.save(function (err, data) {
                                if (err) {
                                    reject(err)
                                } else {
                                    console.log("previous client inserted")
                                    resolve(data)
                                }


                            })
                        }

                    })

                } else {
                    let previous = new PreviousClient();
                    previous.client_name = data.clientName;
                    previous.role = data.role;
                    previous.workedAs = data.workedAs;
                    previous.end_date = data.endDate;
                    previous.start_date = data.startDate;
                    previous.user_id = user_id;
                    previous.save(function (err, data) {
                        if (err) {
                            reject(err)
                        } else {
                            console.log("new inserted")
                            resolve(data)
                        }
                    })
                }
            }
        })
    })
}

const Step3info = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        User.findOne({
            _id: ObjectId(req.params.id),
            status: 1,
            role: 3
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
            if (!result) {

                res.json({
                    status: 0,
                    message: 'User not found.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                PreviousClient.find({
                    user_id: ObjectId(req.params.id)
                }, function (err, client) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else {

                        let lastClient = client;
                        Expertise.findOne({
                            user_id: ObjectId(req.params.id)
                        }, function (err, expertise) {
                            if (err) {
                                res.json({
                                    status: 0,
                                    message: 'Something went wrong',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            } else if (expertise) {
                                let lastClient = client;
                                expertise = JSON.parse(JSON.stringify(expertise));

                                if (client) {
                                    expertise['previous'] = lastClient;
                                }

                                res.json({
                                    status: 1,
                                    message: 'data found',
                                    statuscode: 200,
                                    response: expertise
                                });

                            } else {
                                res.json({
                                    status: 0,
                                    message: 'No data found',
                                    statuscode: 400,
                                    response: lastClient ? {
                                        previous: lastClient
                                    } : ""
                                });
                                return;
                            }
                        });

                    }
                });
            }
        });
    });
}

const updateStep4 = function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/user/';
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        var v = new Validator();
        v = new Validator(fields, {
            recommendation: 'required',
            user_id: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("recommendation" in v.errors) {
                    errors.push({
                        "recommendation": v.errors.recommendation.message
                    });
                }

                if ("user_id" in v.errors) {
                    errors.push({
                        "user_id": v.errors.user_id.message
                    });
                }

                // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                // res.send(response);
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                User.findOne({
                    _id: ObjectId(fields.user_id),
                    status: 1,
                    role: 3
                }, async function (err1, user) {
                    if (err1) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!user) {

                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {
                        let recommendationList = [];
                        if (1) {
                            let recommendation = fields.recommendation && fields.recommendation != "" ? JSON.parse(fields.recommendation) : [];
                            let ids = []
                            await recommendation.filter(ele => {
                                if (ele._id && ele._id != "") {
                                    ids.push(ObjectId(ele._id))
                                }
                            })
                            console.log("ids=>", ids)
                            await Recommendation.deleteMany({
                                _id: {
                                    $nin: ids
                                },
                                user_id: fields.user_id
                            }, function (err, removal) {
                                if (err) {
                                    console.log(err)
                                    res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode: 400,
                                        response: err
                                    });
                                    return;
                                } else {
                                    console.log("res=>", removal)
                                }
                            })
                            await recommendation.reduce(async (promise, obj) => {
                                await promise;
                                await insertRecommendation(obj, fields.user_id).then(data => {
                                    console.log("data=>", data)
                                    recommendationList.push(data);
                                }).catch(err => {
                                    console.log("err=>", err)
                                    res.json({
                                        status: 0,
                                        message: 'Something went wrong.',
                                        statuscode: 400,
                                        response: err
                                    });
                                    return;
                                });
                            }, Promise.resolve())
                            if (user.current_step <= 4) {
                                user.current_step = 5;
                                user.save(function (err, user) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log(user)
                                    }
                                })
                            }
                            res.json({
                                status: 1,
                                message: 'Profile updated successfully.',
                                statuscode: 200,
                                response: recommendationList
                            });
                            return;
                        }

                    }
                });
            }
        })
    });
}

const insertRecommendation = function (data, user_id) {

    //console.log(data);
    return new Promise(async (resolve, reject) => {
        var v = new Validator();
        v = new Validator(data, {
            type: 'required',
            referenceName: 'required',
            position: 'required',
            company: 'required',
            recommendationText: 'required',
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];

                if ("type" in v.errors) {
                    errors.push({
                        "type": v.errors.type.message
                    });
                }
                if ("referenceName" in v.errors) {
                    errors.push({
                        "referenceName": v.errors.referenceName.message
                    });
                }

                if ("position" in v.errors) {
                    errors.push({
                        "position": v.errors.position.message
                    });
                }

                if ("company" in v.errors) {
                    errors.push({
                        "company": v.errors.company.message
                    });
                }
                if ("recommendationText" in v.errors) {
                    errors.push({
                        "recommendationText": v.errors.recommendationText.message
                    });
                }

                if ("company" in v.errors) {
                    errors.push({
                        "company": v.errors.company.message
                    });
                }
                reject(errors);
            } else {
                if (data._id && data._id != "") {
                    Recommendation.findOne({
                        _id: ObjectId(data._id),
                        user_id: ObjectId(user_id)
                    }, function (err1, recommendation) {

                        if (err1) {
                            reject(err1)
                        } else if (recommendation) {
                            recommendation.type = +data.type;
                            recommendation.reference_name = data.referenceName;
                            recommendation.positions = data.position;
                            recommendation.recommendation_text = data.recommendationText;
                            recommendation.email = data.email;
                            //recommendation.url = data.url ? data.url : "";
                            recommendation.company = data.company;
                            recommendation.user_id = user_id;
                            recommendation.save(function (err, data) {
                                if (err) {
                                    reject(err)
                                } else {
                                    console.log("recommendation updated")
                                    resolve(data)
                                }
                            })
                        } else {
                            let recommendationNew = new Recommendation();
                            recommendationNew.type = +data.type;
                            recommendationNew.reference_name = data.referenceName;
                            recommendationNew.positions = data.position;
                            recommendationNew.recommendation_text = data.recommendationText;
                            recommendationNew.email = data.email;
                            recommendationNew.url = data.url ? data.url : "";
                            recommendationNew.company = data.company;
                            recommendationNew.user_id = user_id;
                            recommendationNew.save(function (err, data) {
                                if (err) {
                                    reject(err)
                                } else {
                                    console.log("recommendationNew inserted")
                                    resolve(data)
                                }


                            })
                        }

                    })

                } else {
                    let recommendationNew = new Recommendation();
                    recommendationNew.type = +data.type;
                    recommendationNew.reference_name = data.referenceName;
                    recommendationNew.positions = data.position;
                    recommendationNew.recommendation_text = data.recommendationText;
                    recommendationNew.email = data.email;
                    recommendationNew.url = data.url ? data.url : "";
                    recommendationNew.company = data.company;
                    recommendationNew.user_id = user_id;
                    recommendationNew.save(function (err, data) {
                        if (err) {
                            reject(err)
                        } else {
                            console.log("new inserted")
                            resolve(data)
                        }
                    })
                }
            }
        })
    })
}

const Step4info = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        User.findOne({
            _id: ObjectId(req.params.id),
            status: 1,
            role: 3
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
            if (!result) {

                res.json({
                    status: 0,
                    message: 'User not found.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                Recommendation.find({
                    user_id: ObjectId(req.params.id)
                }, function (err, recommendation) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else if (recommendation) {

                        res.json({
                            status: 1,
                            message: 'data found',
                            statuscode: 200,
                            response: recommendation
                        });
                        return;

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
    });
}

const updateStep5 = function (req, res) {

    var form = new formidable.IncomingForm();

    form.uploadDir = __dirname + '/../../public/uploads/portfolios/';
    form.parse(req, async function (err, fields, files) {
        console.log("files=>", files);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }

        User.findOne({
            _id: ObjectId(fields.user_id),
            status: 1,
            role: 3
        }, async function (err1, user) {
            if (err1) {

                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            }
            if (!user) {

                res.json({
                    status: 0,
                    message: 'User data not found.',
                    statuscode: 400,
                    response: ''
                });
                return;

            } else {
                PortFolios.findOne({
                    user_id: req.user._id ? ObjectId(req.user._id) : ObjectId(fields.user_id)
                }, function (err1, result) {
                    if (err1) {
                        console.log(err1)
                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!result) {
                        res.json({
                            status: 0,
                            message: 'Please add a portfolio.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {


                        if (user.current_step <= 5) {
                            user.current_step = 5;
                            user.profile_setup = 1;
                            user.save(function (err, user) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    res.json({
                                        status: 1,
                                        message: 'Profile updated successfully.',
                                        statuscode: 200,
                                        response: result
                                    });
                                    return;
                                }
                            })
                        }
                    }


                })
            }
        })

    })

}

const Step5info = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields) {
        User.findOne({
            _id: ObjectId(req.params.id),
            status: 1,
            role: 3
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
            if (!result) {

                res.json({
                    status: 0,
                    message: 'User not found.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                PortFolios.find({
                    user_id: ObjectId(req.params.id)
                }, function (err, portfolio) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Something went wrong',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    } else if (portfolio) {
                        res.json({
                            status: 1,
                            message: 'data found',
                            statuscode: 200,
                            response: portfolio
                        });
                        return;

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
    });
}

const updatePortfolio = function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/portfolios/';
    form.parse(req, async function (err, fields, files) {
        console.log("files=>", files);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        var v = new Validator();
        v = new Validator(fields, {
            videoUrl: 'required',
            thumb_image: 'required',
            tags: 'required',
            projectType: 'required',
            //genere: 'required',
            user_id: 'required',
            //industry: 'required',
            project_name: 'required',
            client_name: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];
                if ("videoUrl" in v.errors) {
                    errors.push({
                        "videoUrl": v.errors.videoUrl.message
                    });
                }

                if ("tags" in v.errors) {
                    errors.push({
                        "tags": v.errors.tags.message
                    });
                }
                if ("projectType" in v.errors) {
                    errors.push({
                        "projectType": v.errors.projectType.message
                    });
                }
                if ("genere" in v.errors) {
                    errors.push({
                        "genere": v.errors.genere.message
                    });
                }
                if ("project_name" in v.errors) {
                    errors.push({
                        "project_name": v.errors.project_name.message
                    });
                }
                if ("industry" in v.errors) {
                    errors.push({
                        "industry": v.errors.industry.message
                    });
                }
                if ("client_name" in v.errors) {
                    errors.push({
                        "client_name": v.errors.client_name.message
                    });
                }
                if ("thumb_image" in v.errors) {
                    errors.push({
                        "thumb_image": v.errors.thumb_image.message
                    });
                }
                if ("user_id" in v.errors) {
                    errors.push({
                        "user_id": v.errors.user_id.message
                    });
                }

                // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
                // res.send(response);
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                User.findOne({
                    _id: req.user._id ? ObjectId(req.user._id) : ObjectId(fields.user_id),
                    status: 1,
                    role: 3
                }, async function (err1, user) {
                    if (err1) {
                        console.log(err1)
                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!user) {

                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {
                        let fileNames = "";
                        let inputFiles = Array.isArray(files.image) ? files.image : [files.image]
                        if (inputFiles && files.image) {
                            inputFiles.forEach(file => {
                                if (file.name) {
                                    let fileName = new Date().getTime() + file.name.replace(" ", "-");
                                    var oldpath = file.path;
                                    var newpath = __dirname + '/../../public/uploads/portfolios/' + fileName;
                                    fileNames = fileName;
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
                        let id = fields.portfolio_id && fields.portfolio_id != "" ? ObjectId(fields.portfolio_id) : ObjectId();
                        PortFolios.findOne({
                            _id: id,
                            user_id: req.user._id ? ObjectId(req.user._id) : ObjectId(fields.user_id)
                        }, function (err1, result) {
                            if (err1) {
                                console.log(err1)
                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                            if (!result) {

                                let portfolio = new PortFolios();
                                portfolio.video_url = fields.videoUrl;
                                portfolio.tags = fields.tags ? JSON.parse(fields.tags) : "";
                                portfolio.project_type = fields.projectType ? ObjectId(fields.projectType) : ObjectId;
                                portfolio.genre = fields.genere ? JSON.parse(fields.genere).map(ele => ObjectId(ele)) : [];
                                portfolio.industry = fields.industry ? JSON.parse(fields.industry).map(ele => ObjectId(ele)) : [];
                                portfolio.user_id = fields.user_id;
                                portfolio.client_name = fields.client_name;
                                portfolio.project_name = fields.project_name;
                                portfolio.thumb_image = fields.thumb_image;

                                portfolio.save(function (err, update) {
                                    if (err) {
                                        console.log(err)
                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    } else if (update) {
                                        res.json({
                                            status: 1,
                                            message: 'Portfolio updated successfully.',
                                            statuscode: 200,
                                            response: update
                                        });
                                        return;
                                    } else {
                                        res.json({
                                            status: 0,
                                            message: 'Portfolio not updated successfully.',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    }
                                })


                            } else {
                                result.video_url = fields.videoUrl;
                                result.tags = fields.tags ? JSON.parse(fields.tags) : "";
                                result.project_type = fields.projectType ? ObjectId(fields.projectType) : ObjectId;
                                result.genre = fields.genere ? JSON.parse(fields.genere).map(ele => ObjectId(ele)) : [];
                                result.industry = fields.industry ? JSON.parse(fields.industry).map(ele => ObjectId(ele)) : [];
                                result.user_id = fields.user_id;
                                result.client_name = fields.client_name;
                                result.project_name = fields.project_name;
                                result.thumb_image = fields.thumb_image;

                                result.save(function (err, update) {
                                    if (err) {
                                        console.log(err)
                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    } else if (update) {
                                        if (user.current_step <= 5) {
                                            res.json({
                                                status: 1,
                                                message: 'Portfolio updated successfully.',
                                                statuscode: 200,
                                                response: update
                                            });
                                            return;
                                        } else {
                                            res.json({
                                                status: 0,
                                                message: 'Portfolio not updated successfully.',
                                                statuscode: 400,
                                                response: ''
                                            });
                                            return;
                                        }
                                    }
                                })


                            }
                        })
                    }
                });
            }
        })
    });
}

const updateProfileImage = function (req, res) {

    //console.log(req);
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/user/';
    form.parse(req, async function (err, fields, files) {
        console.log(err);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        var v = new Validator();
        v = new Validator(fields, {
            user_id: 'required',
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];
                if ("user_id" in v.errors) {
                    errors.push({ "user_id": v.errors.user_id.message });
                }
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                let fileName = ''
                if (files.profile_image && files.profile_image.name) {
                    fileName = new Date().getTime() + files.profile_image.name.replace(" ", "-");
                    var oldpath = files.profile_image.path;
                    var newpath = __dirname + '/../../public/uploads/user/' + fileName;
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) {
                            console.log(err);
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

                User.findOne({ _id: ObjectId(fields.user_id), status: 1 }, function (err1, result) {
                    if (err1) {
                        console.log(err1);
                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    else if (!result) {
                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {
                        let updateObject = {};
                        if (fileName.length != 0) {
                            var lastURLSegment = result.image;
                            console.log(fileExists.sync(__dirname + '/../../public/uploads/user/' + lastURLSegment))
                            if (result.image && fileExists.sync(__dirname + '/../../public/uploads/user/' + lastURLSegment)) {
                                var old_image = __dirname + '/../../public/uploads/user/' + lastURLSegment;
                                try {
                                    fs.unlink(old_image, (err) => {
                                        if (err) {
                                            console.log(err);
                                            res.json({
                                                status: 0,
                                                message: 'Something went wrong.',
                                                statuscode: 400,
                                                response: ''
                                            });
                                            return;
                                        }
                                    })
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                            result.image = fileName;
                        }
                        console.log(result);
                        result.save(function (err2, user) {

                            console.log(err2);
                            if (err2) {
                                console.log(err2);
                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                            //console.log(user);
                            else if (user) {
                                user.image = user.image ? appConfig.uploadUrl + 'user/' + user.image : "";
                                res.json({
                                    status: 1,
                                    message: 'Profile image updated successfully.',
                                    statuscode: 200,
                                    response: user
                                });
                                return;
                            } else {
                                user.image = user.image ? appConfig.uploadUrl + 'user/' + user.image : "";
                                res.json({
                                    status: 0,
                                    message: 'Profile image not updated successfully.',
                                    statuscode: 400,
                                    response: user
                                });
                                return;
                            }
                        });
                    }
                });
            }
        })
    });
}

const removePortfolio = function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../../public/uploads/portfolios/';
    form.parse(req, async function (err, fields, files) {
        console.log("files=>", files);
        if (err) {

            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        var v = new Validator();
        v = new Validator(fields, {
            portfolio_id: 'required',
            user_id: 'required'
        });

        await v.check().then(function (matched) {
            if (!matched) {
                var errors = [];
                if ("portfolio_id" in v.errors) {
                    errors.push({
                        "portfolio_id": v.errors.portfolio_id.message
                    });
                }
                if ("user_id" in v.errors) {
                    errors.push({
                        "user_id": v.errors.user_id.message
                    });
                }
                res.json({
                    status: 0,
                    message: 'Bad request.',
                    statuscode: 400,
                    response: errors
                });
                return;
            } else {
                User.findOne({
                    _id: ObjectId(fields.user_id),
                    status: 1,
                    role: 3
                }, async function (err1, user) {
                    if (err1) {

                        res.json({
                            status: 0,
                            message: 'Something went wrong.',
                            statuscode: 400,
                            response: ''
                        });
                        return;
                    }
                    if (!user) {

                        res.json({
                            status: 0,
                            message: 'User data not found.',
                            statuscode: 400,
                            response: ''
                        });
                        return;

                    } else {
                        PortFolios.findOne({
                            _id: ObjectId(fields.portfolio_id),
                            user_id: ObjectId(fields.user_id)
                        }, function (err1, result) {
                            if (err1) {

                                res.json({
                                    status: 0,
                                    message: 'Something went wrong.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;
                            }
                            if (!result) {
                                res.json({
                                    status: 0,
                                    message: 'Portfolio not found.',
                                    statuscode: 400,
                                    response: ''
                                });
                                return;

                            } else {
                                PortFolios.remove({
                                    _id: ObjectId(fields.portfolio_id),
                                    user_id: ObjectId(fields.user_id)
                                }, function (err, update) {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: 'Something went wrong',
                                            statuscode: 400,
                                            response: ''
                                        });
                                        return;
                                    } else if (update) {

                                        res.json({
                                            status: 1,
                                            message: 'Portfolio remove successfully.',
                                            statuscode: 200,
                                            response: update
                                        });
                                        return;
                                    } else {
                                        res.json({
                                            status: 0,
                                            message: 'Portfolio not remove successfully.',
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
        })
    });
}

module.exports = {
    index,
    changePassword,
    updateProfileClient,
    updateNotification,
    updateStep1,
    Step1info,
    updateStep2,
    Step2info,
    updateStep3,
    Step3info,
    updateStep4,
    Step4info,
    updateStep5,
    Step5info,
    updateProfileImage,
    updatePortfolio,
    removePortfolio,
}