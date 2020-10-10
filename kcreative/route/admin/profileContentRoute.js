var express = require('express');
let router = express.Router();
var homeSlideContent = require('./../../controller/admin/profileContentController');

// primary skills route
router.route('/primary')
    .get(homeSlideContent.PrimarySkillAll);

router.route('/primary/:page')
    .get(homeSlideContent.PrimarySkillIndex);

router.route('/primary/')
    .post(homeSlideContent.primarySkillcreate);

router.route('/primary/:id')
    .put(homeSlideContent.primarySkillUpdate);

router.route('/primary/:id')
    .delete(homeSlideContent.primaryDelete);

router.route('/primary/view/:id')
    .get(homeSlideContent.primarySkillView);

// secondasr skills route
router.route('/secondary')
    .get(homeSlideContent.secondarySkillAll);

router.route('/secondary/:page')
    .get(homeSlideContent.secondarySkillIndex);

router.route('/secondary/')
    .post(homeSlideContent.secondarySkillcreate);

router.route('/secondary/:id')
    .put(homeSlideContent.secondarySkillUpdate);

router.route('/secondary/:id')
    .delete(homeSlideContent.secondaryDelete);

router.route('/secondary/view/:id')
    .get(homeSlideContent.secondarySkillView);

// editing style route
router.route('/editing')
    .get(homeSlideContent.editingSkillAll);

router.route('/editing/:page')
    .get(homeSlideContent.editingSkillIndex);

router.route('/editing/')
    .post(homeSlideContent.editingSkillcreate);

router.route('/editing/:id')
    .put(homeSlideContent.editingSkillUpdate);

router.route('/editing/:id')
    .delete(homeSlideContent.editingDelete);

router.route('/editing/view/:id')
    .get(homeSlideContent.editingSkillView);

// graphic style route
router.route('/graphic')
    .get(homeSlideContent.graphicSkillAll);

router.route('/graphic/:page')
    .get(homeSlideContent.graphicSkillIndex);

router.route('/graphic/')
    .post(homeSlideContent.graphicSkillcreate);

router.route('/graphic/:id')
    .put(homeSlideContent.graphicSkillUpdate);

router.route('/graphic/:id')
    .delete(homeSlideContent.graphicSkillDelete);

router.route('/graphic/view/:id')
    .get(homeSlideContent.graphicSkillView);

// award style route
router.route('/award')
    .get(homeSlideContent.awardSkillAll);

router.route('/award/:page')
    .get(homeSlideContent.awardSkillIndex);

router.route('/award/')
    .post(homeSlideContent.awardSkillcreate);

router.route('/award/:id')
    .put(homeSlideContent.awardSkillUpdate);

router.route('/award/:id')
    .delete(homeSlideContent.awardSkillDelete);

router.route('/award/view/:id')
    .get(homeSlideContent.awardSkillView);

// Project type route
router.route('/projectType')
    .get(homeSlideContent.projectTypeAll);

router.route('/projectType/:page')
    .get(homeSlideContent.projectTypeIndex);

router.route('/projectType/')
    .post(homeSlideContent.projectTypecreate);

router.route('/projectType/:id')
    .put(homeSlideContent.projectTypeUpdate);

router.route('/projectType/:id')
    .delete(homeSlideContent.projectTypeDelete);

router.route('/projectType/view/:id')
    .get(homeSlideContent.projectTypeView);

// Project type route
router.route('/industryType')
    .post(homeSlideContent.industryTypeAll);

router.route('/industryType/:page')
    .get(homeSlideContent.industryTypeIndex);

router.route('/industryTypeInsert/')
    .post(homeSlideContent.industryTypecreate);

router.route('/industryType/:id')
    .put(homeSlideContent.industryTypeUpdate);

router.route('/industryType/:id')
    .delete(homeSlideContent.industryTypeDelete);

router.route('/industryType/view/:id')
    .get(homeSlideContent.industryTypeView);

// Genere type route
router.route('/genereType')
    .post(homeSlideContent.genereTypeAll);

router.route('/genereType/:page')
    .get(homeSlideContent.genereTypeIndex);

router.route('/genereTypeInsert/')
    .post(homeSlideContent.genereTypecreate);

router.route('/genereType/:id')
    .put(homeSlideContent.genereTypeUpdate);

router.route('/genereType/:id')
    .delete(homeSlideContent.genereTypeDelete);

router.route('/genereType/view/:id')
    .get(homeSlideContent.genereTypeView);

router.route('/allContent/')
    .get(homeSlideContent.allContent);

router.get('/industry-genre-all/:id', homeSlideContent.IndustryGenreAll)


module.exports = router;