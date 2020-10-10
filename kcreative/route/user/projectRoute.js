var express = require('express');
let router = express.Router();
const projectController = require('../../controller/user/projectController');

router.get('/:id', projectController.index)          // show the project detail by id 

router.route('/myProject-client')                // show the project of particular client by passong ID 
    .post(projectController.clientProject);

// router.route('/myProject-freelancer')            // show the project of particular client by passing ID 
//     .post(projectController.freelancerProject);

router.route('/create-step1')
    .post(projectController.Step1update);

router.route('/create-step2')
    .post(projectController.Step2update);

router.route('/create-step3')
    .post(projectController.Step3update);

router.route('/create-step4')
    .post(projectController.Step4update);

router.route('/post-project')
    .post(projectController.postProject);

router.route('/favourite-freelancer')
    .post(projectController.favouriteFreelancer);

router.route('/invited-freelancer')
    .post(projectController.getInvitedFreelancerList);

router.route('/update-invited-freelancer')
    .post(projectController.addinvitefreelancer);

module.exports = router;