const express = require('express');
const validate = require('../../middlewares/validate');
const recordValidation = require('../../validations/record.validation');
const recordController = require('../../controllers/record.controller');

const router = express.Router();

router.route('/').get(validate(recordValidation.getRecords), recordController.getRecords);
router.route('/').post(validate(recordValidation.getAggregatedRecords), recordController.getAggregatedRecords);

module.exports = router;
