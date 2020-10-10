var express = require('express');
let router = express.Router();
const workController = require('../../controller/user/jobWorkController');

router.route('/')
    .post(workController.index); // find-work list

router.route('/project-info/:id')
    .get(workController.projectInfo); // find-work list

router.route('/submit-quote')
    .post(workController.submitQuote); // submitQuote  apply for work


module.exports = router; 