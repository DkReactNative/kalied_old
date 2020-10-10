var PrimarySkill = require('./../../model/primarySkillsModel.js');
var SecondarySkill = require('./../../model/secondarySkillsModel.js');
var EditingStyle = require('./../../model/editingStyleModel.js');
var GraphicSpecailities = require('./../../model/graphicSpecalitiesModel.js');
var Awards = require('./../../model/awardsModel.js');
var ProjectType = require('./../../model/projectTypeModel.js');
var GenereType = require('./../../model/genereTypeModel.js');
var IndustryType = require('./../../model/industryTypeModel.js');
var async = require('async');
const adminHelper = require("./../../helper/adminHelper");
const appConfig = require('./../../config/app');
const mongoose = require('mongoose');
var formidable = require('formidable');
const ObjectId = mongoose.Types.ObjectId;
const { validationResult } = require('express-validator');
const validation = require('./../../validation/adminValidation');

// Primary Skills
const PrimarySkillIndex = (req, res) => {
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
        var page = req.params.page || 1;
        var perPage = 10;
        var json = {};
        PrimarySkill.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                PrimarySkill.find()
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const primarySkillcreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        const { name } = fields;
        let updateObject = JSON.parse(fields.data);
        PrimarySkill.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const primarySkillUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            PrimarySkill.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    PrimarySkill.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const primaryDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            PrimarySkill.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const primarySkillView = (req, res) => {
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
        } else {
            var id = req.params.id;
            PrimarySkill.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const PrimarySkillAll = (req, res) => {
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

        PrimarySkill.aggregate([{ $match: { status: 1 } }, { $project: { "value": "$_id", _id: 0, name: 1, freelancer_type: 1 } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

// Secondary Skills

const secondarySkillIndex = (req, res) => {
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
        var page = req.params.page || 1;
        var perPage = 10;
        var json = {};
        SecondarySkill.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                SecondarySkill.find()
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const secondarySkillcreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        const { name } = fields;
        let updateObject = JSON.parse(fields.data);
        SecondarySkill.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const secondarySkillUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            SecondarySkill.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    SecondarySkill.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const secondaryDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            SecondarySkill.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const secondarySkillView = (req, res) => {
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
        } else {
            var id = req.params.id;
            SecondarySkill.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const secondarySkillAll = (req, res) => {
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

        SecondarySkill.aggregate([{ $match: { status: 1 } }, { $project: { "value": "$_id", _id: 0, name: 1, freelancer_type } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

// editing skills

const editingSkillIndex = (req, res) => {
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
        var page = req.params.page || 1;
        var perPage = 10;
        var json = {};
        EditingStyle.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                EditingStyle.find()
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const editingSkillcreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        const { name } = fields;
        let updateObject = JSON.parse(fields.data);
        EditingStyle.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const editingSkillUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            EditingStyle.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    EditingStyle.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const editingDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            EditingStyle.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const editingSkillView = (req, res) => {
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
        } else {
            var id = req.params.id;
            EditingStyle.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const editingSkillAll = (req, res) => {
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

        EditingStyle.aggregate([{ $match: { status: 1 } }, { $project: { "value": "$_id", _id: 0, name: 1, freelancer_type } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

// graphic skills

const graphicSkillIndex = (req, res) => {
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
        var page = req.params.page || 1;
        var perPage = 10;
        var json = {};
        GraphicSpecailities.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                GraphicSpecailities.find()
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const graphicSkillcreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        const { name } = fields;
        let updateObject = JSON.parse(fields.data);
        GraphicSpecailities.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const graphicSkillUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            GraphicSpecailities.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    GraphicSpecailities.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const graphicSkillDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            GraphicSpecailities.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const graphicSkillView = (req, res) => {
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
        } else {
            var id = req.params.id;
            GraphicSpecailities.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const graphicSkillAll = (req, res) => {
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

        GraphicSpecailities.aggregate([{ $match: { status: 1 } }, { $project: { "value": "$_id", _id: 0, name: 1, freelancer_type } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

// awards

const awardSkillIndex = (req, res) => {
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
        var page = req.params.page || 1;
        var perPage = 10;
        var json = {};
        Awards.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                Awards.find()
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const awardSkillcreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        const { name } = fields;
        let updateObject = JSON.parse(fields.data);
        Awards.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const awardSkillUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            Awards.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    Awards.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const awardSkillDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            Awards.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const awardSkillView = (req, res) => {
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
        } else {
            var id = req.params.id;
            Awards.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const awardSkillAll = (req, res) => {
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

        Awards.aggregate([{ $match: { status: 1 } }, { $project: { "value": "$_id", _id: 0, name: 1, freelancer_type } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

// project Type

const projectTypeIndex = (req, res) => {
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
        var page = req.params.page || 1;
        var perPage = 10;
        var json = {};
        ProjectType.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                ProjectType.find(json)
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const projectTypecreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        const { name } = fields;
        let updateObject = JSON.parse(fields.data);
        ProjectType.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const projectTypeUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            ProjectType.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    ProjectType.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const projectTypeDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            ProjectType.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const projectTypeView = (req, res) => {
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
        } else {
            var id = req.params.id;
            ProjectType.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const projectTypeAll = (req, res) => {
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

        ProjectType.aggregate([{ $match: { status: 1 } }, { $project: { "value": "$_id", _id: 0, name: 1 } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

// industry Type

const industryTypeIndex = (req, res) => {
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
        var page = fields.page;
        var perPage = 10;
        var json = {
            project_type: ObjectId(fields.project_type)
        };
        IndustryType.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                IndustryType.find()
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const industryTypecreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        let updateObject = JSON.parse(fields.data);

        updateObject = updateObject.map(ele => {
            ele.project_type = ObjectId(ele.project_type);
            return ele;
        })
        console.log("updateObject");

        IndustryType.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const industryTypeUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            IndustryType.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    IndustryType.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const industryTypeDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            IndustryType.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const industryTypeView = (req, res) => {
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
        } else {
            var id = req.params.id;
            IndustryType.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const industryTypeAll = (req, res) => {
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

        IndustryType.aggregate([{ $match: { status: 1, project_type: ObjectId(fields.project_type) } }, { $project: { "value": "$_id", _id: 0, name: 1, project_type: 1 } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

// genere Type

const genereTypeIndex = (req, res) => {
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
        var page = fields.page || 1;
        var perPage = 10;
        var json = { project_type: ObjectId(fields.project_type) };
        GenereType.find(json)
            .limit(perPage)
            .skip(perPage * page - perPage)
            .exec(function (err, result) {
                GenereType.find(json)
                    .count()
                    .exec(async function (err, count) {
                        if (err) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: ''
                            });
                            return;
                        } else {
                            res.json({
                                status: 1,
                                message: 'successfully',
                                statuscode: 200,
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

const genereTypecreate = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: ''
            });
            return;
        }
        const { name } = fields;
        let updateObject = JSON.parse(fields.data);
        updateObject = updateObject.map(ele => {
            ele.project_type = ObjectId(ele.project_type);
            return ele;
        })
        GenereType.insertMany(updateObject).then(result => {
            res.json({
                status: 1,
                message: 'created successfully',
                statuscode: 200,
                response: result
            });
            return;
        }).catch(err => {
            res.json({
                status: 0,
                message: 'not created',
                statuscode: 400,
                response: err
            });
            return;
        });


    })
}
const genereTypeUpdate = (req, res) => {
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
        } else {

            const { name } = fields;


            GenereType.findOne({ _id: ObjectId(req.params.id) }, async function (err1, result) {
                if (err1) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                }
                console.log(result)
                if (!result) {
                    res.json({
                        status: 0,
                        message: 'record does not exist',
                        statuscode: 400,
                        response: ''
                    });
                    return;
                } else {

                    GenereType.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { name: name }, function (err2, data) {
                        if (err2) {
                            res.json({
                                status: 0,
                                message: 'Something went wrong.',
                                statuscode: 400,
                                response: err2
                            });
                            return;
                        }
                        //console.log(user);
                        if (data) {

                            res.json({
                                status: 1,
                                message: 'updated successfully.',
                                statuscode: 200,
                                response: data
                            });
                            return;
                        } else {

                            res.json({
                                status: 0,
                                message: 'Record not updated successfully.',
                                statuscode: 400,
                                response: data
                            });
                        }
                    });
                }
            })
        }
    })
}
const genereTypeDelete = (req, res) => {
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
        } else {
            var id = req.params.id;
            GenereType.remove({
                _id: ObjectId(id)
            },
                function (err, result) {
                    if (err) {
                        res.json({
                            status: 0,
                            message: 'Record not deleted successfully',
                            statuscode: 400,
                            response: err
                        });

                    } else {
                        res.json({
                            status: 1,
                            message: 'Record deleted successfully',
                            statuscode: 200,
                            response: result
                        });

                    }
                }
            );
        }
    })
}

const genereTypeView = (req, res) => {
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
        } else {
            var id = req.params.id;
            GenereType.findOne({ _id: ObjectId(id) }).exec(function (err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: 'Something went wrong.',
                        statuscode: 400,
                        response: err
                    });
                    return;
                } else if (result) {

                    res.json({
                        status: 1,
                        message: 'successfully',
                        statuscode: 200,
                        response: result
                    });
                } else {
                    res.json({
                        status: 0,
                        message: 'no record found',
                        statuscode: 400,
                        response: result
                    });
                }

            });
        }
    })
}

const genereTypeAll = (req, res) => {
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

        GenereType.aggregate([{ $match: { status: 1, project_type: ObjectId(fields.project_type) } }, { $project: { "value": "$_id", _id: 0, name: 1, industry_type: 1, project_type: 1 } }], function (err, count) {
            if (err) {
                res.json({
                    status: 0,
                    message: 'Something went wrong.',
                    statuscode: 400,
                    response: ''
                });
                return;
            } else {
                res.json({
                    status: 1,
                    message: 'successfully',
                    statuscode: 200,
                    response: count
                });
                return;
            }
        });
    });
}

const allContent = (req, res) => {
    let response = {
        primarySkills: [],
        secondarySkills: [],
        editingStyle: [],
        graphicSpecalities: [],
        awards: [],
        projectType: [],
        genereType: [],
        industryType: []
    }

    async.parallel([
        function (callback) {
            promises(PrimarySkill).then(data => {
                response['primarySkills'] = data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                console.log(data);
                callback(null, data)
            }).catch(err => {
                console.log(err);
                callback(null, err)
            })
        },

        function (callback) {
            promises(SecondarySkill).then(data => {
                response['secondarySkills'] = data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                callback(null, data)
                console.log(data);
            }).catch(err => {
                callback(null, err)
            })
        },

        function (callback) {
            promises(EditingStyle).then(data => {
                response['editingStyle'] = data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                callback(null, data)
            }).catch(err => {
                callback(null, err)
            })
        },

        function (callback) {
            promises(GraphicSpecailities).then(data => {
                response['graphicSpecalities'] = data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                callback(null, data)
            }).catch(err => {
                callback(null, err)
            })
        },

        function (callback) {
            promises(Awards).then(data => {
                response['awards'] = data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                callback(null, data)
            }).catch(err => {
                callback(null, err)
            })
        },

        function (callback) {
            promises(ProjectType).then(data => {
                response['projectType'] = data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                callback(null, data)
            }).catch(err => {
                callback(null, err)
            })
        }

        // function(callback) {
        //     promises(GenereType).then(data => {
        //         response['genereType'] = data;
        //         callback(null, data)
        //     }).catch(err => {
        //         callback(null, err)
        //     })
        // },

        // function(callback) {
        //     promises(IndustryType).then(data => {
        //         response['industryType'] = data;
        //         callback(null, data)
        //     }).catch(err => {
        //         callback(null, err)
        //     })
        //}
    ], function (err, results) {

        if (err && err.length > 0) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: err
            });
            return;
        } else {
            console.log(results)
            res.json({
                status: 1,
                message: 'data found',
                statuscode: 200,
                response: response
            });
            return;
        }

    })

}

const IndustryGenreAll = (req, res) => {
    let response = {
        genereType: [],
        industryType: []
    }

    let project_type = req.params.id

    async.parallel([
        function (callback) {
            promises2(GenereType, project_type).then(data => {
                response['genereType'] = data;
                callback(null, data)
            }).catch(err => {
                callback(null, err)
            })
        },

        function (callback) {
            promises2(IndustryType, project_type).then(data => {
                response['industryType'] = data;
                callback(null, data)
            }).catch(err => {
                callback(null, err)
            })
        }
    ], function (err, results) {

        if (err && err.length > 0) {
            res.json({
                status: 0,
                message: 'Something went wrong.',
                statuscode: 400,
                response: err
            });
            return;
        } else {
            console.log(results)
            res.json({
                status: 1,
                message: 'data found',
                statuscode: 200,
                response: response
            });
            return;
        }

    })

}

var promises = function (Model) {

    return new Promise((resolve, reject) => {
        Model.aggregate([{ $match: { status: 1 } }, { $project: { "value": "$_id", _id: 0, name: 1, freelancer_type: 1 } }], function (err, data) {
            if (err) {
                console.log(err)
                reject(err)
            } else {

                resolve(data)
            }
        });
    })
}

var promises2 = function (Model, project_type) {

    return new Promise((resolve, reject) => {
        Model.aggregate([{ $match: { status: 1, project_type: ObjectId(project_type) } }, { $project: { "value": "$_id", _id: 0, name: 1, project_type: 1 } }], function (err, data) {
            if (err) {
                console.log(err)
                reject(err)
            } else {

                resolve(data)
            }
        });
    })
}

module.exports = {
    // primary
    PrimarySkillIndex,
    primarySkillcreate,
    primarySkillUpdate,
    primaryDelete,
    primarySkillView,
    PrimarySkillAll,

    // secondary
    secondarySkillAll,
    secondarySkillIndex,
    secondarySkillcreate,
    secondarySkillUpdate,
    secondaryDelete,
    secondarySkillView,

    // editing
    editingSkillAll,
    editingSkillIndex,
    editingSkillcreate,
    editingSkillUpdate,
    editingDelete,
    editingSkillView,

    // graphic
    graphicSkillAll,
    graphicSkillIndex,
    graphicSkillcreate,
    graphicSkillUpdate,
    graphicSkillDelete,
    graphicSkillView,

    // award
    awardSkillAll,
    awardSkillIndex,
    awardSkillcreate,
    awardSkillUpdate,
    awardSkillDelete,
    awardSkillView,

    // project type
    projectTypeAll,
    projectTypeIndex,
    projectTypecreate,
    projectTypeUpdate,
    projectTypeDelete,
    projectTypeView,

    // industry type
    industryTypeAll,
    industryTypeIndex,
    industryTypecreate,
    industryTypeUpdate,
    industryTypeDelete,
    industryTypeView,

    // genere type
    genereTypeAll,
    genereTypeIndex,
    genereTypecreate,
    genereTypeUpdate,
    genereTypeDelete,
    genereTypeView,

    // get All Profile Content
    allContent,
    IndustryGenreAll
}